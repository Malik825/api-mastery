import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Post, PostComment } from '../../core/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post | null = null;
  comments: PostComment[] = [];
  loading = true;
  error: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(postId)) {
      this.error = 'Invalid post ID';
      this.loading = false;
      return;
    }

    // Load post
    const postSub = this.api.getPost(postId).subscribe({
      next: (post) => {
        this.post = post;
        this.checkLoadingState();
      },
      error: (err) => {
        this.error = err.message || 'Failed to load post';
        this.checkLoadingState();
      }
    });

    // Load comments
    const commentsSub = this.api.getCommentsForPost(postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.checkLoadingState();
      },
      error: (err) => {
        this.error = this.error || err.message || 'Failed to load comments';
        this.checkLoadingState();
      }
    });

    this.subscriptions.add(postSub);
    this.subscriptions.add(commentsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private checkLoadingState(): void {
    // Only set loading to false when both post and comments have resolved (success or error)
    if (this.post !== null || this.comments.length > 0 || this.error) {
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}