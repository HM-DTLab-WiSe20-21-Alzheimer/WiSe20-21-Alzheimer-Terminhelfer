import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationComponent } from './location.component';
import { IconComponent } from '../../../components/icon/icon.component';
import { LocationsCardComponent } from '../../../components/pages/app/location/locations-card/locations-card.component';
import { UtilsModule } from '../../../utils/utils.module';
import { LoaderComponent } from '../../../components/loader/loader.component';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  beforeEach(async () => {
    await TestBed
      .configureTestingModule({
        declarations: [
          LocationComponent,
          IconComponent,
          LoaderComponent,
          LocationsCardComponent,
        ],
        imports: [
          UtilsModule,
        ]
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
