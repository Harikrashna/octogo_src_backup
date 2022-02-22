import { Component, Injector, Input, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
  selector: 'app-shared-tenant-setup-progress',
  templateUrl: './shared-tenant-setup-progress.component.html',
  styleUrls: ['./shared-tenant-setup-progress.component.css']
})
export class SharedTenantSetupProgressComponent extends AppComponentBase implements OnInit {

  @Input()TenantData;
  constructor(injector: Injector) {
    super(injector);
}
  ngOnInit(): void {
  }

}
