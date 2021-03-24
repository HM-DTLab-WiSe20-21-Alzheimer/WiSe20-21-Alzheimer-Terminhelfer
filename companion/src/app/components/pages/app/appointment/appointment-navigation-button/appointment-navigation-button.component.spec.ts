import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentNavigationButtonComponent } from './appointment-navigation-button.component';
import { IconComponent } from '../../../../icon/icon.component';
import { AlexaAppointment } from '../../../../../models/appointment/AlexaAppointment';
import * as dayjs from 'dayjs';
import { GoogleMapsLink } from './links/GoogleMapsLink';
import { Link } from './links/Link';
import { By } from '@angular/platform-browser';

describe('AppointmentNavigationButtonComponent', () => {
  let component: AppointmentNavigationButtonComponent;
  let fixture: ComponentFixture<AppointmentNavigationButtonComponent>;

  let appointment: AlexaAppointment;
  let position: Position;
  let link: Link;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentNavigationButtonComponent, IconComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentNavigationButtonComponent);
    component = fixture.componentInstance;

    position = {
      coords: {
        longitude: 1,
        latitude: 2,
      } as Coordinates,
    } as Position;

    appointment = new AlexaAppointment({
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

    link = new GoogleMapsLink();

    component.link = link;
    component.appointment = appointment;
    component.position = position;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render link', () => {
    const linkDe = fixture.debugElement.query(By.css('[data-test="link"]'));
    const href = linkDe.properties.href;

    expect(href).toEqual(link.get(appointment, position));
  });

  it('should render icon', () => {
    const iconDe = fixture.debugElement.query(By.css('[data-test="icon"] .uil'));
    const iconNe = iconDe.nativeElement;

    expect(iconNe.classList.contains(`uil-${link.getIcon()}`)).toBeTruthy();
  });

  it('should render name', () => {
    const textDe = fixture.debugElement.query(By.css('[data-test="name"]'));
    const textNe = textDe.nativeElement;

    expect(textNe.textContent.trim()).toEqual(link.getName());
  });
});
