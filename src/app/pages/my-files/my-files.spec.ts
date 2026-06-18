import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MyFiles } from './my-files';

describe('MyFiles', () => {
  let component: MyFiles;
  let fixture: ComponentFixture<MyFiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFiles],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: (key: string) => {
                if (key === 'section') {
                  return 'my-files';
                }

                return null;
              }
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyFiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});