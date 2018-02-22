import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Storage } from "@ionic/storage";

@Injectable()
export class NemService {

    nodeUrl: any;
    signedTx: any;

    constructor(private http: Http, public storage: Storage) {
            
    }

    broadcastTx(signedTransaction: any): Promise<any> {
        this.storage.get("currentServer")
        .then((value)=>{

            if(!value){
                this.nodeUrl = "http://62.75.171.41:7890/transaction/announce";
                console.log(this.nodeUrl);
                return;
            }
            this.nodeUrl = `http://${value}:7890/transaction/announce`;
            console.log(this.nodeUrl);
        })
        .catch(()=>{
            this.nodeUrl = "http://62.75.171.41:7890/transaction/announce";
            console.log(this.nodeUrl);
        })  

        this.signedTx = signedTransaction;

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });


        return this.http.post(this.nodeUrl, this.signedTx, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

    private handleErrorPromise(error: Response | any) {
        console.error(error.message || error);
        return Promise.reject(error.message || error);
    }
}