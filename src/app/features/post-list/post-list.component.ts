import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  standalone: true,
  imports: [CommonModule] // Add necessary Angular modules or components here
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 100; // Placeholder (API doesn't return total count)

  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getPosts(this.itemsPerPage, this.currentPage).subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  changeItemsPerPage(count: number) {
    this.itemsPerPage = count;
    this.currentPage = 1;
    this.loadPosts();
  }
}
