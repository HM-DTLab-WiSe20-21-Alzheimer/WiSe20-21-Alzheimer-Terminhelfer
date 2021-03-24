import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentNavigationComponent } from './appointment-navigation.component';
import { AppointmentNavigationButtonComponent } from '../appointment-navigation-button/appointment-navigation-button.component';
import { AlexaAppointment } from '../../../../../models/appointment/AlexaAppointment';
import { IconComponent } from '../../../../icon/icon.component';
import * as dayjs from 'dayjs';
import { PositionService } from '../../../../../services/position/position.service';
import { Observable } from 'rxjs';
import { UtilsModule } from '../../../../../utils/utils.module';
import { LoaderComponent } from '../../../../loader/loader.component';
import { By } from '@angular/platform-browser';

describe('AppointmentNavigationComponent', () => {

  let component: AppointmentNavigationComponent;
  let fixture: ComponentFixture<AppointmentNavigationComponent>;

  let positionService: PositionService;
  let currentPosition: Promise<Position>;

  beforeEach(async () => {
    currentPosition = Promise.resolve({
      coords: {
        longitude: 1,
        latitude: 2,
      } as Coordinates,
    } as Position);

    positionService = {
      getCurrentPosition: jest.fn(() => currentPosition),
    } as unknown as PositionService;


    await TestBed.configureTestingModule({
      declarations: [
        AppointmentNavigationComponent,
        AppointmentNavigationButtonComponent,
        IconComponent,
        LoaderComponent,
      ],
      imports: [
        UtilsModule,
      ],
      providers: [
        { provide: PositionService, useValue: positionService },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentNavigationComponent);
    component = fixture.componentInstance;

    component.appointment = new AlexaAppointment({
      M: {
        dateTime: { S: dayjs().format() },
        location: {
          M: {
            name: { S: 'TestLoc' },
            coordinates: { S: '48.1559366,11.5243933' },
          },
        },
        title: { S: 'test' },
        id: { S: '123456789' },
        transport: { S: 'auto' },
      },
    });

    fixture.detectChanges();
  });

  describe('Constructor', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should create position observable', () => {
      expect(component.currentPosition$).toBeInstanceOf(Observable);
      expect(positionService.getCurrentPosition).toHaveBeenCalled();
    });

  });

  describe('Render', () => {

    it('should render links', async (done) => {
      await currentPosition;
      fixture.detectChanges();

      const linksDe = fixture.debugElement.query(By.css('[data-test="links"]'));
      expect(linksDe.nativeElement).toBeDefined();
      expect(linksDe.nativeElement.childNodes.length).toEqual(3);
      done();
    });
  });
});
