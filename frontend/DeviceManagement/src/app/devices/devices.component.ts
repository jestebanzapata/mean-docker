import { ApplicationState } from './../store/application-state';
import { Component, OnInit } from '@angular/core';
import { Idevice } from '../idevice';
import { DeviceService } from '../device.service';
import { Observable } from 'rxjs/Observable';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { catchError, map, tap, groupBy, flatMap } from 'rxjs/operators';
import 'rxjs/Rx';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { toArray } from 'rxjs/operators/toArray';
import { forEach } from '@angular/router/src/utils/collection';
import { filter } from 'rxjs/operators/filter';
import { DEVICE_TYPES } from './device-type';
import { first } from 'rxjs/operators/first';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { defaultIfEmpty } from 'rxjs/operators/defaultIfEmpty';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { switchMap } from 'rxjs/operators/switchMap';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { startWith } from 'rxjs/operators/startWith';
import { share } from 'rxjs/operators/share';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit, OnDestroy {

  devicesList: Idevice[];
  deviceId: string;
  selectedDevice: Idevice;
  errorMessage: string;

  devicesSubject$: Observable<Idevice[]>;

  devices$: Observable<Idevice[]>;

  devicesGroup$: Observable<any[]>;

  observableMRA$: Observable<string>;

  observableVOC$: Observable<string>;

  observableLSR$: Observable<string>;

  combineResult$: Observable<[{}, {}, {}]>;

  private lastDeviceSubscription: Subscription;

  keySubject: Subject<string> = new Subject();

  constructor(public deviceService: DeviceService, private store: Store<ApplicationState>) { }

  ngOnInit() {
    this.findDevices();
    this.initObservables();
    this.deviceService.test();

    //////////// PRACTICE /////////////

    const array1 = [
      {id: 1},
      {id: 2}
    ];

    // Observable.from(array1).pipe(
    //   map(val => val.id)
    // ).subscribe(console.log);


    const observableIssue = this.deviceService.getIssue().pipe(
      map(issue => issue.fields.creator.key)
    );

    const observableOrganizations = this.deviceService.getOrganizations().pipe(
      map(organization => organization.values),
      map(array => Observable.from(array)),
      mergeMap(val => val.map(test => {
        return {id: test.id, name: test.name};
      })),
    );

    const usersOrganization = observableOrganizations
    .pipe(
      mergeMap(val => {

        // this.deviceService.getUsersByOrganization(val.id).pipe(
        //   mergeMap(val =>)
        // );

        return this.deviceService.getUsersByOrganization(val.id)
        .map(res => ({ name: val.name, users: res}));
      }),
      toArray(),
      map(array => Observable.from(array)),
      mergeMap(val => val)
    );



    usersOrganization.subscribe(console.log);


  }

  initObservables() {
    this.store.subscribe(
      val => {
        // console.log('');
      }
    );



    this.devicesSubject$ = this.keySubject.asObservable().pipe(
      debounceTime(1000),
      startWith(''),
      distinctUntilChanged(),
      switchMap(textfilter => {
        return this.deviceService.getDeviceList(textfilter);
      })
    );

    // this.keySubject.pipe(
    //   debounceTime(1000),
    //   distinctUntilChanged(),
    //   switchMap(textfilter => this.deviceService.getDeviceList(textfilter))
    // ).subscribe(function(val){
    //   console.log(val);
    // });

    this.devices$ = this.deviceService.getDeviceList(null);

    this.devicesGroup$ = this.devices$.pipe(
      mergeMap(obs$ => Observable.from(obs$)),
      groupBy(device => device.type),
      mergeMap(list$ => {
        const count$ = list$.count();
        return count$.map(count => ({ type: list$.key, count }));
      }),
      toArray(),
    );

    // this.devicesGroup$.subscribe(function (val) {
    //   console.log('Text');
    //   console.log(val);
    // });

     this.combineResult$ = Observable.combineLatest(this.deviceService.observableMRA$,
      this.deviceService.observableLSR$,
      this.deviceService.observableVOC$);



    //////////////////////////////////////

    // const pageSource = this.pageStream.map(pageNumber => {
    //   this.page = pageNumber;
    //   return {search: this.terms, page: pageNumber};
    // });

    // const searchSource = this.searchTermStream
    //     .debounceTime(1000)
    //     .distinctUntilChanged()
    //     .map(searchTerm => {
    //       this.terms = searchTerm;
    //       return {search: searchTerm, page: 1};
    //     });

    //     const source = pageSource
    //     .merge(searchSource)
    //     .startWith({search: this.terms, page: this.page})
    //     .mergeMap((params: {search: string, page: number}) => {
    //       console.log('test');
    //       return this.deviceService.getDeviceList();
    //     })
    //     .share();

    //     source.pluck('_id');
  }

  findDevices() {
    if (this.deviceId != null && this.deviceId.trim().length > 0) {
      this.findDeviceById();
    } else {
      this.findAllDevices();
    }
  }

  findAllDevices() {
    this.deviceService.getDeviceList(null).subscribe(
      (devices) => {
        this.devicesList = [];
        this.devicesList = devices;

        // this.devicesGroup$ = Observable.from(this.devicesList).pipe(
        //   groupBy(device => device.type),
        //   mergeMap( list$ => {
        //     const count$ = list$.count();
        //     return count$.map( count => ({ type: list$.key, count }));
        //   }),
        //   toArray(),
        // );

        // this.devicesGroup$.subscribe(function(val){
        //   console.log(val);
        // });

      },
      (error) => {
        this.errorMessage = <any>error;
      }
    );
  }

  findDeviceById() {
    console.log('DeviceId -> ' + this.deviceId);
    this.deviceService.getDeviceById(this.deviceId).subscribe(
      (devices) => {
        this.devicesList = [];
        this.devicesList.push(devices);
      },
      (error) => {
        this.errorMessage = <any>error;
      }
    );
  }

  onSelectedDevice(deviceId: string) {
    this.findAllDevices();
  }

  ngOnDestroy() {
    // this.lastDeviceSubscription.unsubscribe();
  }

  search(searchFilterText) {
    console.log('searchFilterText');
    this.keySubject.next(searchFilterText);
  }

}
