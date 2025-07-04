import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, of, map, tap, BehaviorSubject } from 'rxjs';
import { Post, PostComment } from '../models';
import { ErrorHandlerService } from '../../error-handler.service.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE_URL = environment.apiUrl;
  private readonly LOCAL_POST_KEY = environment.localPostKey;
  private readonly OVERRIDE_KEY = environment.overridePostKey;
  private readonly cacheDuration = environment.cacheDurationMs;

  private cache = new Map<string, { data: any; expiry: number }>();

  public posts$ = new BehaviorSubject<Post[]>([]);
  public comments$ = new BehaviorSubject<{ [postId: number]: PostComment[] }>({});

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  private setCache(key: string, data: any) {
    const expiry = Date.now() + this.cacheDuration;
    this.cache.set(key, { data, expiry });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    } else {
      this.cache.delete(key);
      return null;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  private saveLocalPosts(posts: Post[]): void {
    localStorage.setItem(this.LOCAL_POST_KEY, JSON.stringify(posts));
  }

  private getLocalPosts(): Post[] {
    const data = localStorage.getItem(this.LOCAL_POST_KEY);
    return data ? JSON.parse(data) : [];
  }

  getLocalPost(id: number): Post | undefined {
    return this.getLocalPosts().find(p => p.id === id);
  }

  private savePostOverrides(posts: Post[]): void {
    localStorage.setItem(this.OVERRIDE_KEY, JSON.stringify(posts));
  }

  private getPostOverrides(): Post[] {
    const data = localStorage.getItem(this.OVERRIDE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getOverride(id: number): Post | undefined {
    return this.getPostOverrides().find(p => p.id === id);
  }

  getPosts(limit: number = 5, page: number = 1): Observable<Post[]> {
    const cacheKey = `posts-page-${page}-limit-${limit}`;
    const cached = this.getCache(cacheKey);
    if (cached) return of(cached);

    const params = new HttpParams().set('_limit', limit).set('_page', page);

    return this.http.get<Post[]>(`${this.BASE_URL}/posts`, { params }).pipe(
      map(apiPosts => {
        const local = this.getLocalPosts();
        const overrides = this.getPostOverrides();
        const mergedApi = apiPosts.map(p => overrides.find(o => o.id === p.id) || p);
        const allPosts = [...local.reverse(), ...mergedApi];
        this.setCache(cacheKey, allPosts);
        this.posts$.next(allPosts); // Live update emit
        return allPosts;
      }),
      catchError(error => this.errorHandler.handleError(error))
    );
  }

  createPost(post: Post): Observable<Post> {
    const localPosts = this.getLocalPosts();
    const newPost: Post = { ...post, id: Date.now() };
    localPosts.push(newPost);
    this.saveLocalPosts(localPosts);
    this.posts$.next([...localPosts]);
    return of(newPost).pipe(
      tap(() => console.log('Post saved locally:', newPost))
    );
  }

  getPost(id: number): Observable<Post> {
    const cacheKey = `post-${id}`;
    const cached = this.getCache(cacheKey);
    if (cached) return of(cached);

    const override = this.getOverride(id);
    if (override) return of(override);

    const local = this.getLocalPost(id);
    if (local) return of(local);

    return this.http.get<Post>(`${this.BASE_URL}/posts/${id}`).pipe(
      tap(post => this.setCache(cacheKey, post)),
      catchError(err => this.errorHandler.handleError(err))
    );
  }

  updateLocalPost(id: number, updates: Partial<Post>): void {
    const localPosts = this.getLocalPosts();
    const index = localPosts.findIndex(p => p.id === id);

    if (index !== -1) {
      localPosts[index] = { ...localPosts[index], ...updates };
      this.saveLocalPosts(localPosts);
      this.cache.delete(`post-${id}`);
      this.posts$.next([...localPosts]);
      return;
    }

    const overrides = this.getPostOverrides();
    const overrideIndex = overrides.findIndex(p => p.id === id);

    if (overrideIndex !== -1) {
      overrides[overrideIndex] = { ...overrides[overrideIndex], ...updates };
    } else {
      overrides.push({ id, userId: 1, title: '', body: '', ...updates });
    }

    this.savePostOverrides(overrides);
    this.cache.delete(`post-${id}`);
    this.posts$.next([...this.getLocalPosts(), ...overrides]);
  }

  getCommentsForPost(postId: number): Observable<PostComment[]> {
    const cacheKey = `comments-post-${postId}`;
    const cached = this.getCache(cacheKey);
    if (cached) return of(cached);

    return this.http.get<PostComment[]>(`${this.BASE_URL}/posts/${postId}/comments`).pipe(
      map(apiComments => {
        const local = this.getLocalComments(postId);
        const combined = [...local.reverse(), ...apiComments];
        this.comments$.next({ ...this.comments$.getValue(), [postId]: combined });
        return combined;
      }),
      tap(data => this.setCache(cacheKey, data)),
      catchError(error => {
        console.error('Error fetching comments:', error);
        return throwError(() => new Error('Failed to fetch comments'));
      })
    );
  }

  deletePost(id: number): void {
    const local = this.getLocalPosts().filter(p => p.id !== id);
    this.saveLocalPosts(local);

    const overrides = this.getPostOverrides().filter(p => p.id !== id);
    this.savePostOverrides(overrides);

    this.cache.delete(`post-${id}`);
    this.posts$.next([...local]);
  }

  private COMMENT_KEY = 'localComments';
  private LOCAL_COMMENTS_KEY = 'localComments';

 addComment(postId: number, comment: PostComment): void {
  const comments = this.getLocalComments(postId);
  const updated = [comment, ...comments];
  localStorage.setItem(`${this.LOCAL_COMMENTS_KEY}_${postId}`, JSON.stringify(updated));
}
getLocalComments(postId: number): PostComment[] {
  const data = localStorage.getItem(`${this.LOCAL_COMMENTS_KEY}_${postId}`);
  return data ? JSON.parse(data) : [];
}

deleteComment(postId: number, commentId: number): void {
  const comments = this.getLocalComments(postId);
  const filtered = comments.filter(c => c.id !== commentId);
  localStorage.setItem(`${this.LOCAL_COMMENTS_KEY}_${postId}`, JSON.stringify(filtered));
}

}
