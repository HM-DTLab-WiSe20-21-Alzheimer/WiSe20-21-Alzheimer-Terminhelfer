import { Injectable } from '@angular/core';
import { API } from '@aws-amplify/api';
import { Appointment } from '../../models/appointment/Appointment';
import { AlexaAppointment } from '../../models/appointment/AlexaAppointment';
import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {

  getNext(): Promise<Appointment | null> {
    return API.get('TerminHelferAppointment', '/appointment/next', {})
      .then(result => result.body ? JSON.parse(result.body) : null)
      .then(data => data ? new AlexaAppointment(data) : null);
  }

  getAllByDay(date: dayjs.Dayjs): Promise<Appointment[]> {
    return API
      .get('TerminHelferAppointment', '/appointment', {
        queryStringParameters: {
          date: date.format(),
        },
      })
      .then(result => JSON.parse(result.body) || [])
      .then(result => result.map((appointment: any) => new AlexaAppointment(appointment)))
  }

  get(id: string): Promise<Appointment | null> {
    return API
      .get('TerminHelferAppointment', `/appointment/${id}`, {})
      .then(result => result.body ? JSON.parse(result.body) : null)
      .then(data => data ? new AlexaAppointment(data) : null);
  }

}
