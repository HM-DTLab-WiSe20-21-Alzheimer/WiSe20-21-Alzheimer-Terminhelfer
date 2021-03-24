import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { LinkComponent } from './link/link.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [LoginComponent, LogoutComponent, LinkComponent, SignupComponent, ConfirmComponent],
    imports: [
        CommonModule,
        UserRoutingModule,
        ReactiveFormsModule,
        ComponentsModule,
    ],
})
export class UserModule { }
