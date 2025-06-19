import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Post } from '../../core/models';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getPosts', 'deletePost']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [PostListComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts and apply filters', () => {
    const mockPosts: Post[] = [
      { id: 1, userId: 1, title: 'Post One', body: 'Content' },
      { id: 2, userId: 1, title: 'Post Two', body: 'Content' }
    ];

    mockApiService.getPosts.and.returnValue(of(mockPosts));

    component.loadPosts();

    expect(mockApiService.getPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(2);
    expect(component.filteredPosts.length).toBe(2);
  });

  it('should delete a post and reload', () => {
    spyOn(component, 'loadPosts');

    component.deletePost(1);

    expect(mockApiService.deletePost).toHaveBeenCalledWith(1);
    expect(component.loadPosts).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalledWith('Post deleted successfully.');
  });

  it('should stop propagation and call delete', () => {
    const event = new Event('click');
    spyOn(event, 'stopPropagation');
    spyOn(component, 'deletePost');

    component.onDeleteClick(event, 1);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.deletePost).toHaveBeenCalledWith(1);
  });

  it('should apply filters correctly', () => {
    component.posts = [
      { id: 1, title: 'Angular', body: 'Cool', userId: 1 },
      { id: 2, title: 'React', body: 'Meh', userId: 2 }
    ];

    component.searchQuery = 'angular';
    component.applyFilters();

    expect(component.filteredPosts.length).toBe(1);
    expect(component.filteredPosts[0].title).toContain('Angular');
  });

  it('should logout and navigate to login', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
