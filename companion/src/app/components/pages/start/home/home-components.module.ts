import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesComponent } from './features/features.component';
import { FaqComponent } from './faq/faq.component';
import { FaqListComponent } from './faq/faq-list/faq-list.component';

@NgModule({
  declarations: [FeaturesComponent, FaqComponent, FaqListComponent],
  exports: [
    FeaturesComponent,
    FaqComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class HomeComponentsModule {
}
