import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from '../../../../../models/appointment/Appointment';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-next-card',
  templateUrl: './next-card.component.html',
  styleUrls: ['./next-card.component.scss'],
})
export class NextCardComponent implements OnInit {

  @Input() appointment!: Promise<Appointment | null>;

  appointment$!: Observable<Appointment | null>;

  ngOnInit(): void {
    this.appointment$ = fromPromise(this.appointment);
  }
}
