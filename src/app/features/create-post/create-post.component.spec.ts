import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostComponent } from './create-post.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;

  const mockApiService = {
    createPost: jasmine.createSpy().and.returnValue(of({}))
  };

  const mockRouter = {
    navigate: jasmine.createSpy()
  };

  const mockToastr = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePostComponent, ReactiveFormsModule, CommonModule],
      providers: [
        FormBuilder,
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers constructor
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
