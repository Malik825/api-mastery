import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, of, map, tap } from 'rxjs';
import { Post, PostComment } from '../models';
import { ErrorHandlerService } from '../../error-handler.service.service';

const LOCAL_POST_KEY = 'localPosts';
const OVERRIDE_KEY = 'postOverrides';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE_URL = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient,  private errorHandler: ErrorHandlerService) {}

  // Local posts
  private saveLocalPosts(posts: Post[]): void {
    localStorage.setItem(LOCAL_POST_KEY, JSON.stringify(posts));
  }

  private getLocalPosts(): Post[] {
    const data = localStorage.getItem(LOCAL_POST_KEY);
    return data ? JSON.parse(data) : [];
  }

  getLocalPost(id: number): Post | undefined {
    return this.getLocalPosts().find(p => p.id === id);
  }

  // Override system
  private savePostOverrides(posts: Post[]): void {
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(posts));
  }

  private getPostOverrides(): Post[] {
    const data = localStorage.getItem(OVERRIDE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getOverride(id: number): Post | undefined {
    return this.getPostOverrides().find(p => p.id === id);
  }

  // Fetch all posts with merge
  getPosts(limit: number = 5, page: number = 1): Observable<Post[]> {
    const params = new HttpParams()
      .set('_limit', limit)
      .set('_page', page);

    return this.http.get<Post[]>(`${this.BASE_URL}/posts`, { params }).pipe(
      map(apiPosts => {
        const local = this.getLocalPosts();
        const overrides = this.getPostOverrides();

        // Replace API posts with overrides if they exist
        const mergedApi = apiPosts.map(p => overrides.find(o => o.id === p.id) || p);

        return [...local.reverse(), ...mergedApi];
      }),
      catchError(error => {
        console.error('Error fetching posts:', error);
        return throwError(() => new Error('Failed to fetch posts'));
      })
    );
  }

  // Create post locally only
  createPost(post: Post): Observable<Post> {
    const localPosts = this.getLocalPosts();
    const newPost: Post = {
      ...post,
      id: Date.now() // unique ID for local
    };
    localPosts.push(newPost);
    this.saveLocalPosts(localPosts);
    return of(newPost).pipe(
      tap(() => console.log('Post saved locally:', newPost))
    );
  }

  // Get single post (check override → local → API)
  getPost(id: number): Observable<Post> {
    const override = this.getOverride(id);
    if (override) return of(override);

    const local = this.getLocalPost(id);
    if (local) return of(local);

    return this.http.get<Post>(`${this.BASE_URL}/posts/${id}`).pipe(
    catchError(err => this.errorHandler.handleError(err))
  );
   
  }
  
  

  // Edit post: updates override or local
  updateLocalPost(id: number, updates: Partial<Post>): void {
    const localPosts = this.getLocalPosts();
    const index = localPosts.findIndex(p => p.id === id);

    if (index !== -1) {
      localPosts[index] = { ...localPosts[index], ...updates };
      this.saveLocalPosts(localPosts);
      return;
    }

    // Not a local post → store override
    const overrides = this.getPostOverrides();
    const overrideIndex = overrides.findIndex(p => p.id === id);

    if (overrideIndex !== -1) {
      overrides[overrideIndex] = { ...overrides[overrideIndex], ...updates };
    } else {
      overrides.push({ id, userId: 1, title: '', body: '', ...updates });
    }

    this.savePostOverrides(overrides);
  }

  // Comments (unchanged)
  getCommentsForPost(postId: number): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.BASE_URL}/posts/${postId}/comments`).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        return throwError(() => new Error('Failed to fetch comments'));
      })
    );
  }
}
