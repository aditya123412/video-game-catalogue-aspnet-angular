import { Injectable } from '@angular/core';
import settings from '../../assets/appsettings.json';

export interface AppSettings {
  ApiBaseUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfig {
  private settings: AppSettings | undefined = undefined;

  constructor() {}

  load(): Promise<void> {
    this.settings = (settings as unknown) as AppSettings;
    return Promise.resolve();
  }

  get apiBaseUrl(): string {
    return this.settings?.ApiBaseUrl ?? 'https://localhost:7087/api';
  }
}
