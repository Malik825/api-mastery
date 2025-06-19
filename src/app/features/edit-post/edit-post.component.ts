import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Post } from '../../core/models';


@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'] // ✅ plural
})

export class EditPostComponent implements OnInit {
  postForm!: FormGroup;
  postId!: number;
  submitting = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postId = +id;
      const post = this.api.getLocalPost(this.postId);
      if (!post) {
        this.error = 'Post not found or cannot be edited.';
        return;
      }

      this.postForm = this.fb.group({
        title: [post.title, [Validators.required, Validators.minLength(5)]],
        body: [post.body, [Validators.required, Validators.minLength(10)]],
        category: [post.category || 'Technology'],
        readTime: [post.readTime || '5 min read']
      });
    }
  }

  submit(): void {
    if (this.postForm.invalid) return;

    this.submitting = true;
    const updatedPost: Partial<Post> = {
      ...this.postForm.value,
      date: new Date().toISOString()
    };

    this.api.updateLocalPost(this.postId, updatedPost);
    this.router.navigate(['/posts']);
  }
   goBack(): void {
    this.router.navigate(['/posts']);
  }
}
