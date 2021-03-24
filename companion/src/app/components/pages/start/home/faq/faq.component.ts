import { Component } from '@angular/core';
import { faqItems, ItemData } from './faq.items.data';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {

  items: ItemData[] = faqItems;

  getFirstHalfOfItems(): ItemData[] {
    return faqItems.slice(0, Math.ceil(faqItems.length / 2));
  }

  getSecondHalfOfItems(): ItemData[] {
    return faqItems.slice(Math.ceil(faqItems.length / 2));
  }

}
