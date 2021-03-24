import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithLoadingPipe } from './with-loading.pipe';


@NgModule({
  declarations: [
    WithLoadingPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    WithLoadingPipe,
  ],
})
export class UtilsModule {
}
