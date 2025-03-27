import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDetailReportComponent } from './category-detail-report.component';

describe('CategoryDetailReportComponent', () => {
  let component: CategoryDetailReportComponent;
  let fixture: ComponentFixture<CategoryDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryDetailReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
