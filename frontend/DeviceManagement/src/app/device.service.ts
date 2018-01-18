import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,  } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { Idevice } from './idevice';

@Injectable()
export class DeviceService {

  deviceUrl = 'http://device_core_service:3000/device/';

  constructor(private _http: HttpClient) { }

  getDevice(deviceId: string) {
    this._http.get<Idevice>(this.deviceUrl).subscribe(data => {
      console.log(data);
    });
  }

  getDeviceList(): Observable<Idevice[]> {
    return this._http.get<Idevice[]>(this.deviceUrl);
  }

  getDeviceById(deviceId): Observable<Idevice> {
    return this._http.get<Idevice>(this.deviceUrl + deviceId);
  }


  /**private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
**/

  private log(log: string) {
    console.log(log);
  }
}