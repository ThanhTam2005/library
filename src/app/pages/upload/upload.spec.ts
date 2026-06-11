import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Upload } from './upload';

describe('Upload', () => {
  let component: Upload;
  let fixture: ComponentFixture<Upload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Upload, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Upload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
