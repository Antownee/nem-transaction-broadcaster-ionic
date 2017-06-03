import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class NemService {

    nodeUrl: any;
    signedTx: any;

    constructor(private http: Http) {
        this.nodeUrl = "http://bob.nem.ninja:7890/transaction/announce";
        
    }

    broadcastTx(signedTransaction: any): Promise<any> {
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