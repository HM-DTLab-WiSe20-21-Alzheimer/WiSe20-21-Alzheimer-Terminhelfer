import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartRoutingModule } from './start-routing.module';
import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';
import { AppModule } from '../../app.module';
import { ComponentsModule } from '../../components/components.module';
import { HomeComponentsModule } from '../../components/pages/start/home/home-components.module';


@NgModule({
  declarations: [HomeComponent, HelpComponent],
  imports: [
    CommonModule,
    StartRoutingModule,
    ComponentsModule,
    HomeComponentsModule,
  ],
})
export class StartModule { }
