import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FeaturesComponent } from '../../../components/pages/start/home/features/features.component';
import { FaqComponent } from '../../../components/pages/start/home/faq/faq.component';
import { FaqListComponent } from '../../../components/pages/start/home/faq/faq-list/faq-list.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [
          HomeComponent,
          FeaturesComponent,
          FaqComponent,
          FaqListComponent,
        ],
        imports: [RouterTestingModule],
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });
});
