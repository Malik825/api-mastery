import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorHandlerService } from '../../error-handler.service.service';
import { environment } from '../../../environments/environment';
import { Post } from '../models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: ErrorHandlerService, useValue: errorHandlerSpy }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no open requests remain
    localStorage.clear(); // Clean up after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch posts and merge with local/overrides', () => {
    const mockPosts: Post[] = [
      { id: 1, userId: 1, title: 'Test Post', body: 'Body content' }
    ];

    service.getPosts(5, 1).subscribe(posts => {
      expect(posts.length).toBeGreaterThan(0);
      expect(posts[0].title).toContain('Test Post');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/posts?_limit=5&_page=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should create and store a post locally', (done) => {
    const newPost: Post = {
      id: 0,
      userId: 1,
      title: 'Local Post',
      body: 'Hello',
      category: 'Tech',
      readTime: '5 min'
    };

    service.createPost(newPost).subscribe(post => {
      expect(post.title).toBe('Local Post');
      done();
    });
  });

  it('should return cached post if available', () => {
    const post: Post = { id: 123, userId: 1, title: 'Cached', body: 'Body' };
    (service as any).setCache('post-123', post);

    service.getPost(123).subscribe(p => {
      expect(p.title).toBe('Cached');
    });
  });

  it('should delete a post from local and override storage', () => {
    const localPost: Post = {
      id: 456,
      userId: 1,
      title: 'To Delete',
      body: 'Bye',
      category: 'General',
      readTime: '2 min'
    };

    localStorage.setItem(environment.localPostKey, JSON.stringify([localPost]));

    service.deletePost(456);
    const local: Post[] = (service as any).getLocalPosts();
    expect(local.find((p: Post) => p.id === 456)).toBeUndefined();
  });
});
