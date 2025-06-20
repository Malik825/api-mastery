import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPostComponent } from './edit-post.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '1' // simulate route param id = 1
      }
    }
  };

  const mockApiService = {
    getLocalPost: jasmine.createSpy().and.returnValue({
      id: 1,
      title: 'Test Post',
      body: 'This is a test post body',
      category: 'Tech',
      readTime: '3 min read'
    }),
    updateLocalPost: jasmine.createSpy()
  };

  const mockRouter = {
    navigate: jasmine.createSpy()
  };

  const mockToastr = {
    success: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
