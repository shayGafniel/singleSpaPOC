import { Component } from '@angular/core';
import * as singleSpa from 'single-spa';
import GlobalEventDistributor from './global-event-distributer';
import {loadApp} from './helper';

// import { Store, StoreConfig } from '@datorama/akita';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'root-shell';
}




