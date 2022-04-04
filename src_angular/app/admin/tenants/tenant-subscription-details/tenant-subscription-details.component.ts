import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscribedEditionDetailsDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-tenant-subscription-details',
  templateUrl: './tenant-subscription-details.component.html',
  styleUrls: ['./tenant-subscription-details.component.css']
})
export class TenantSubscriptionDetailsComponent implements OnInit {
  @ViewChild('subscriptionModal', { static: true }) modal: ModalDirective;
  SubscribedEditionsData: SubscribedEditionDetailsDto[];
  TenantName;
  constructor() { }

  ngOnInit(): void {
  }
show(editions: SubscribedEditionDetailsDto[], tenantName){
  this.SubscribedEditionsData = editions;
  this.TenantName = tenantName;
  this.modal.show();
}
close(){
  this.modal.hide();
}
}
