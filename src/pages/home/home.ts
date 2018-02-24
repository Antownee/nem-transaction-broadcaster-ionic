import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NemService } from '../../services/nem.services';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public signedTransaction: any;
  public btnDisabled: boolean;
  returnMsg: any;

  constructor(
    public navCtrl: NavController,
    private barcodeScnr: BarcodeScanner,
    private nemService: NemService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {

    this.devfn();

    //this.btnDisabled = true;
  }

  devfn(){
    this.signedTransaction = {"data":"010100000100006818216505200000007d2b057b8d2585d88128bdf75279b4f5c9aae855c273aa3daa10424e1728ef7f80841e000000000098726605280000004e424f4a42474f5a5a4d33524557364351335037564754433534523542594c535649465a4954565540420f000000000018000000010000001000000074657374207472616e73616374696f6e","signature":"088c3cc193ba53692ba21790d3cb215ea2d6d1b30caa39ec829478687f88ce594c50099b0792a7a77d81f29d3f3fd4ef83a9dadbbf39c97b4a15c748ba68c50a"};
    this.btnDisabled = false;
  }


  scan() {
    this.barcodeScnr.scan()
      .then((bd) => {
        if (bd.format !== "QR_CODE") {
          return; //return an error alert
        }
        //Activate broadcast button
        //this.signedTransaction = bd.text;
        this.btnDisabled = false;
      }, (err) => {
        this.showAlert("Error", err.message)
      })
  }


  broadcastTransaction() {
    let signedTX = this.signedTransaction || "";
    if (signedTX == "") {
      return this.showAlert("Warning", "Check your scanned transaction")
    }

    //load spinner
    let spnr = this.loadingCtrl.create({
      content: "Broadcasting transaction.."
    });

    spnr.present();

    this.nemService.broadcastTx(signedTX)
      .then((resp) => {
        let retMsg = `MESSAGE: ${resp.message}
         HASH: ${resp.transactionHash.data}`;
        spnr.dismiss();

        if (resp.message != "SUCCESS") {
          return this.showAlert("Error", retMsg);
        }

        return this.showAlert("Success", retMsg);
      })
      .catch((err) => {
        spnr.dismiss();
        return this.showAlert("Error", err);
      })
  }


  showAlert(title, message) {
    this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    }).present();
  }


}
