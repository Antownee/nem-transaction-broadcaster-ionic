import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import { NemService } from '../../services/nem.services'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public signedTransaction: any;
  public btnDisabled: boolean;
  returnMsg: any;
  public tmpDisabled: boolean;

  constructor(
    public navCtrl: NavController,
    private barcodeScnr: BarcodeScanner, 
    private nemService: NemService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
    this.signedTransaction = { "data": "0101000001000098fc80160420000000ddc585a3d11f5921e56c74b495e8e79b3884cd7c396ba9b56d73fa2868e201e880841e00000000000c8f160428000000544244545948545045534a544653445156544458324d32425648323546433546444d425234474f34404b4c000000000016000000010000000e00000046726f6d20616464726573732031", "signature": "92d183b4daccd11592bbf17ad063e7855ab5ecd4bc589cf5bfdbebda565c2dc425daca283649388d3d34c05cb7394f4978edc231012b9cf331ab7af5bfce3b04" };
    this.btnDisabled = false;
    this.tmpDisabled = true;
  }

  scan() {
    this.barcodeScnr.scan()
      .then((bd) => {
        if (bd.format !== "QR_CODE") {
          return; //return an error alert
        }
        //Activate button
        this.signedTransaction = bd.text;
        this.btnDisabled = false;
      }, (err) => {


      })
  }

  broadcastTransaction() {
    let signedTX = this.signedTransaction || "";
    if (signedTX == "") {
      //throw error or warning
      //return;
    }
    let spnr = this.loadingCtrl.create({
      content: "Broadcasting transaction.."
    });
    spnr.present();

    this.nemService.broadcastTx(signedTX)
      .then((resp) => {
        let retMsg = `MESSAGE: ${resp.message}, HASH: ${resp.transactionHash.data}`;
        this.returnMsg = retMsg;

        console.log(resp);
        if (resp.message != "SUCCESS") {
          spnr.dismiss();
          this.showAlert("Error", retMsg);
          return console.log(retMsg)
        }
        spnr.dismiss();
        this.showAlert("Success", retMsg);
        return console.log(retMsg)
      })
      .catch((err) => {
        spnr.dismiss();
        this.showAlert("Error", err);
        return console.log("error" + err)
      })
  }

  showAlert(title, message){
    let alrt = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    }).present();
  }

  //{innerTransactionHash: Object, code: 1, type: 1, message: "SUCCESS", transactionHash: Object}
  //transactionHash.data
}
