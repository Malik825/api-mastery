import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '1' // simulate post ID = 1
      }
    }
  };

  const mockApiService = {
    getPost: jasmine.createSpy().and.returnValue(of({
      id: 1,
      title: 'Test Post',
      body: 'This is a test post.'
    })),
    getCommentsForPost: jasmine.createSpy().and.returnValue(of([])),
    getLocalComments: jasmine.createSpy().and.returnValue([]),
    addComment: jasmine.createSpy(),
    deleteComment: jasmine.createSpy()
  };

  const mockRouter = {
    navigate: jasmine.createSpy()
  };

  const mockToastr = {
    success: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailComponent, ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
