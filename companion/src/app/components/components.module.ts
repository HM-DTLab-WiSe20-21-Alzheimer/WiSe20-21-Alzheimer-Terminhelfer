import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { IconComponent } from './icon/icon.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { GeolocationPopupComponent } from './geolocation-popup/geolocation-popup.component';
import { HelpOverviewColumnComponent } from './pages/start/help/help-overview-column/help-overview-column.component';

@NgModule({
  declarations: [
    NavigationComponent,
    IconComponent,
    LoaderComponent,
    PageLoaderComponent,
    GeolocationPopupComponent,
    HelpOverviewColumnComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
    exports: [
        NavigationComponent,
        IconComponent,
        LoaderComponent,
        PageLoaderComponent,
        GeolocationPopupComponent,
        HelpOverviewColumnComponent,
    ],
})
export class ComponentsModule {
}
