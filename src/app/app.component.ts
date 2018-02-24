import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SettingsPage } from './../pages/settings/settings';
import { Storage } from "@ionic/storage";
import nem from 'nem-sdk';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;
  settingsPage: any = SettingsPage;
  homePage: any = HomePage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.storage.get("serverList")
        .then((val) => {
          if (!val) {
            //add nem list of servers here
            this.storage.set("serverList", nem.model.nodes.mainnet);
          }
        })
        .catch(() => {

        })
    });
  }

  openPage(p) {
    this.rootPage = p;
  }
}

