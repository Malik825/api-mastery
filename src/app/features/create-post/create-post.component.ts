import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
 postForm: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      category: ['Technology'],
      readTime: ['5 min read']
    });
  }

  submit(): void {
    if (this.postForm.invalid) return;

    this.submitting = true;
    this.error = null;

    const sanitizedBody = this.sanitizer.sanitize(1, this.postForm.value.body) || '';
    const newPost = {
      ...this.postForm.value,
      body: sanitizedBody,
      userId: 1,
      date: new Date().toISOString(),
      image: 'assets/placeholder.jpg'
    };

    this.api.createPost(newPost).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: () => {
        this.error = 'Failed to create post';
        this.submitting = false;
      }
  });
  }

}
