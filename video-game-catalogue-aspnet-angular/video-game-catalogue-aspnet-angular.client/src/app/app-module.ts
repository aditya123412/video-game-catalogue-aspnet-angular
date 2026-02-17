import { HttpClientModule } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Browse } from './Components/browse/browse';
import { Edit } from './Components/edit/edit';
import { AppConfig } from './services/app-config.service';
import { APP_INITIALIZER } from '@angular/core';

@NgModule({
  declarations: [
    App,
    Browse,
    Edit
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: (cfg: AppConfig) => () => cfg.load(), deps: [AppConfig], multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
