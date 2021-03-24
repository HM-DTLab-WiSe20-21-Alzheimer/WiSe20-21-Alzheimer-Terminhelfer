import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-help-overview-column',
  templateUrl: './help-overview-column.component.html',
  styleUrls: ['./help-overview-column.component.scss'],
})
export class HelpOverviewColumnComponent {

  @Input() icon!: string;
  @Input() section!: string;

}
