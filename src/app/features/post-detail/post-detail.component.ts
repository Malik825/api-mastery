import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Post, PostComment } from '../../core/models';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post | null = null;
  comments: PostComment[] = [];
  loading = true;
  error: string | null = null;

  commentForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      body: ['', Validators.required],
    });
  }
showCommentForm = false;

closeModal(): void {
  this.showCommentForm = false;
}

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(postId)) {
      this.error = 'Invalid post ID';
      this.loading = false;
      return;
    }

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

    const commentsSub = this.api.getCommentsForPost(postId).subscribe({
      next: (comments) => {
     const local = this.api.getLocalComments(postId);

        this.comments = [...local.reverse(), ...comments];
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
    if (this.post !== null || this.comments.length > 0 || this.error) {
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }

 addComment(): void {
  if (!this.post || this.commentForm.invalid) return;

  const newComment: PostComment = {
    postId: this.post.id,
    id: Date.now(),
    ...this.commentForm.value,
  };

  this.api.addComment(this.post.id, newComment);
  this.comments.unshift(newComment);
  this.commentForm.reset();
  this.toastr.success('Comment added successfully! 🎉');
}
deleteComment(commentId: number): void {
  if (!this.post) return;
  this.api.deleteComment(this.post.id, commentId);
  this.comments = this.comments.filter(c => c.id !== commentId);
}


}
