import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { Post } from '../../core/models';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  originalPosts: Post[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 100; 

  loading = false;
  error: string | null = null;

  searchQuery: string = '';
  selectedCategory: string = '';
  sortOption: string = 'newest';

  // Sample UI metadata
  sampleImages: string[] = [
 "assets/1.jpg",
 "assets/2.jpg",
 "assets/3.jpg",
  "assets/4.jpg",
  "assets/5.jpg",
  "assets/6.jpg",
  "assets/7.jpg",  
  "assets/8.jpg",
  "assets/9.jpg",
  ];

  sampleCategories: string[] = ['Technology', 'Business', 'Health'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getPosts(this.itemsPerPage, this.currentPage).subscribe({
      next: (data) => {
        const enhanced = data.map(post => ({
          ...post,
          image: this.getRandomItem(this.sampleImages),
          category: this.getRandomItem(this.sampleCategories),
          date: new Date().toLocaleDateString(),
          readTime: `${Math.floor(Math.random() * 8 + 3)} min read`
        }));

        this.originalPosts = enhanced;
        this.posts = enhanced;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  changeItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = parseInt(target.value, 10);
    this.itemsPerPage = value;
    this.currentPage = 1;
    this.loadPosts();
  }

  applyFilters(): void {
    let filtered = structuredClone(this.originalPosts);

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.body.toLowerCase().includes(query)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    if (this.sortOption === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id);
    } else if (this.sortOption === 'oldest') {
      filtered = filtered.sort((a, b) => a.id - b.id);
    } else if (this.sortOption === 'popular') {
      filtered = filtered.sort(() => Math.random() - 0.5); // Simulate popularity
    }

    this.posts = filtered.slice(0, this.itemsPerPage);
  }
}
