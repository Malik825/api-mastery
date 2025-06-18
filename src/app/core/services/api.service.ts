import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Post, PostComment } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getPosts(limit: number =5, page: number = 1): Observable<Post[]> {
    const params = new HttpParams()
      .set('_limit', limit)
      .set('_page', page);

    return this.http.get<Post[]>(`${this.BASE_URL}/posts`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching posts:', error);
        return throwError(() => new Error('Failed to fetch posts'));
      })
    );
  }
  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.BASE_URL}/posts`, post);
  }
  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.BASE_URL}/posts/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching post:', error);
        return throwError(() => new Error('Failed to fetch post'));
      })
    );
  }

  getCommentsForPost(postId: number): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.BASE_URL}/posts/${postId}/comments`).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        return throwError(() => new Error('Failed to fetch comments'));
      })
    );
  }
}