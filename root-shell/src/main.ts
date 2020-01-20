import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import GlobalEventDistributor from './app/global-event-distributer';
import {loadApp} from './app/helper';
import * as singleSpa from 'single-spa';

import storeInstance from '../../app1/store.js';



async function init() {
  console.log('got here');

  const globalEventDistributor = new GlobalEventDistributor();
  const loadingPromises = [];

  loadingPromises.push(loadApp('app1', '/app1', 'http://localhost:4201', './store.js', globalEventDistributor));
  loadingPromises.push(loadApp('app2', '/app2', 'http://localhost:4202', './store.js', globalEventDistributor));
  loadingPromises.push(loadApp('navbar', '/navbar', 'http://localhost:4300/main.single-spa.ts', null, null));

  // wait until all stores are loaded and all apps are registered with singleSpa
  await Promise.all(loadingPromises);

  singleSpa.start();
}

init();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
