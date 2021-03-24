import { Component, Input } from '@angular/core';
import { ItemData } from '../faq.items.data';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss'],
})
export class FaqListComponent {

  @Input() items: ItemData[] = [];

}
