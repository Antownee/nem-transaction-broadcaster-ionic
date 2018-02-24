import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  selectedServer: any;
  serverList: any[] = [];
  currentServer: any;
  selectPlaceholder: any;
  

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public alertCtrl: AlertController) {

    this.storage.get("serverList")
      .then((val) => {
        this.serverList = val;
      });

    this.storage.get("currentServer")
      .then((val) => {
        this.currentServer = val
        this.selectPlaceholder = val;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  onSelectChange(selectedServer) {
    this.storage.set("currentServer", selectedServer);
    this.currentServer = selectedServer;
    this.selectPlaceholder = selectedServer;
  }

  addServer() {

    let prompt = this.alertCtrl.create({
      title: 'Add server ip address',
      inputs: [{
        name: 'ip'
      }],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add',
          handler: data => {
            this.storage.set("currentServer", data.ip);
            //add server to server list
            this.currentServer = data.ip;
            this.selectPlaceholder = "";
          }
        }
      ]
    });

    prompt.present();
  }

}
