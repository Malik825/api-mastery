import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { noProfanity } from '../../../custom-typings/core/validators/profanity.validator';
@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'] // ✅ fixed typo from `styleUrl`
})
export class CreatePostComponent {
  postForm: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), noProfanity]],
  body: ['', [Validators.required, Validators.minLength(10), noProfanity]],
      category: ['Technology'],
      readTime: ['5 min read']
    });
  }

  submit(): void {
    if (this.postForm.invalid) return;

    this.submitting = true;
    this.error = null;

    const newPost = {
      ...this.postForm.value,
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
  goBack(): void {
    this.router.navigate(['/posts']);
  }
}
