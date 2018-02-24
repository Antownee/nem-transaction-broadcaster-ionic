import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Storage } from "@ionic/storage";

@Injectable()
export class NemService {

    nodeUrl: any;
    signedTx: any;

    constructor(private http: Http, public storage: Storage) {
        //this.nodeUrl = "http://62.75.171.41:7890/transaction/announce";

    }

    broadcastTx(signedTransaction: any): Promise<any> {
        return this.storage.get("currentServer")
            .then((value) => {
                this.nodeUrl = `${value}:7890/transaction/announce`;
                this.signedTx = signedTransaction;

                let headers = new Headers({ 'Content-Type': 'application/json' });
                let options = new RequestOptions({ headers: headers });


                return this.http.post(this.nodeUrl, this.signedTx, options)
                    .toPromise()
                    .then(this.extractData)
                    .catch(this.handleErrorPromise);
            })
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleErrorPromise(error: Response | any) {
        console.error(error.message || error);
        if(error.code == 12){
            return Promise.reject(`The provided server url is invalid.\nTry again.` || error);
        }
        return Promise.reject(error.message || error);
    }


}