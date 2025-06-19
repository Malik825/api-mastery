import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { Post } from '../../core/models';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  animations: [
    trigger('listStagger', [
      transition('* => *', [
        query(
          ':leave',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(100, [
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];

  currentPage = 1;
  itemsPerPage = 6;

  loading = false;
  error: string | null = null;

  searchQuery = '';
  selectedCategory = '';
  sortOption = 'newest';

  sampleImages = [
    'assets/1.jpg', 'assets/2.jpg', 'assets/3.jpg',
    'assets/4.jpg', 'assets/5.jpg', 'assets/6.jpg',
    'assets/7.jpg', 'assets/8.jpg', 'assets/9.jpg',
  ];

  sampleCategories: string[] = ['Technology', 'Business', 'Health'];

  constructor(private apiService: ApiService, private router:Router, private auth: AuthService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  get visiblePosts(): Post[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPosts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.itemsPerPage);
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.apiService.getPosts(30, 1).subscribe({
      next: (data) => {
        const enhanced = data.map(post => ({
          ...post,
          image: this.getRandomItem(this.sampleImages),
          category: this.getRandomItem(this.sampleCategories),
          date: new Date().toLocaleDateString(),
          readTime: `${Math.floor(Math.random() * 8 + 3)} min read`
        }));

        this.posts = enhanced;
        this.applyFilters();
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

  changeItemsPerPage(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);
    this.itemsPerPage = value;
    this.currentPage = 1;
  }
createPost(): void {
  this.router.navigate(['/create-post']);
}
  applyFilters(): void {
    let filtered = [...this.posts];

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

    switch (this.sortOption) {
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'popular':
        filtered.sort(() => Math.random() - 0.5);
        break;
    }

    this.filteredPosts = filtered;
    this.currentPage = 1;
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
     logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  deletePost(id: number): void {
  this.apiService.deletePost(id);
  this.loadPosts(); 
  this.toastr.success('Post deleted successfully.');
}
onDeleteClick(event: Event, id: number): void {
  event.stopPropagation(); // 🚫 prevents bubbling to [routerLink]
  this.deletePost(id);     // 🧹 your actual delete logic

}

  }