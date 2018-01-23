import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Idevice } from '../../idevice';
import { DeviceService } from '../../device.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {

  // @Output() selectedDeviceEmmiter = new EventEmitter<Idevice>();

  @Input() device: Idevice;

  constructor(public deviceService: DeviceService) { }

  ngOnInit() {

  }

  /**onSelectedDevice() {
    // this.device = idevice;
    console.log('Selected -> ' + this.device);
    this.deviceService.setSelectedDevice(this.device);
    this.selectedDeviceEmmiter.emit(this.device);
  }**/

}