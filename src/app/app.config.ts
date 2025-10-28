import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * APPLICATION CONFIGURATION - THE SETUP INSTRUCTIONS
 * Tells Angular how to run your loan system
 * Like reading the manual before using a complex machine
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),      // Enable navigation between pages
    provideHttpClient()         // Enable talking to servers/APIs
  ]
};