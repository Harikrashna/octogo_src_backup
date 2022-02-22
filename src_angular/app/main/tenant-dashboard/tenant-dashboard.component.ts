import { result } from 'lodash';
import { TenantEditionAddonDto, SubscribedAddonDto } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tenant-dashboard',
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.css'],
  animations: [appModuleAnimation()]
})
export class TenantDashboardComponent extends AppComponentBase implements OnInit {

  constructor( injector: Injector) { 
    super(injector);
  }
  ngOnInit() {
   
  }
}

