import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';

export const appConfig = {
  providers: [
    importProvidersFrom(CommonModule),
    provideHttpClient()
  ]
};