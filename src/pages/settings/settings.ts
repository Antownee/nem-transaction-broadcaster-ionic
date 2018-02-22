import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import nem from 'nem-sdk';
import { Storage } from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  selectedServer: any;
  serverList: any[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage) {
    this.serverList = nem.model.nodes.mainnet;
    //render custom servers as well
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  onSelectChange(selectedServer) {
    //save to db as current server
  
    this.storage.set("currentServer", selectedServer)
  }
}
