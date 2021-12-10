import { CreateOrUpdateServiceInput, ServicesServiceProxy } from '@shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm, PatternValidator } from '@angular/forms';
@Component({
  selector: 'app-create-or-edit-services',
  templateUrl: './create-or-edit-services.component.html',
  styleUrls: ['./create-or-edit-services.component.css']
})
export class CreateOrEditServicesComponent extends AppComponentBase {
  @ViewChild('createOrEditServices', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() Services: ServiceDto[];
  createServices: CreateOrUpdateServiceInput = new CreateOrUpdateServiceInput()
  active: boolean = false;
  saving: boolean = false; 
  edit: boolean = false;
  currentServiceName;
  constructor(injector: Injector, private _services: ServicesServiceProxy,) {
    super(injector)
  }
  ngOnInit(): void {
  }
  close(form: NgForm): void {
    this.active = false;
    this.modal.hide();
    this.edit = !this.edit;
    form.resetForm();
  }
  show(e?: number): void {
    this.createServices = new CreateOrUpdateServiceInput;
    if (e == undefined) {
      this.active = true;
      this.createServices.inServiceID = null;
      this.modal.show();
    }
    else {
      this.active = true;
      this._services.getServiceForEdit(e).subscribe(res => {
        this.createServices.inServiceID = res.table[0].inServiceID;
        this.createServices.vcServiceName = res.table[0].vcServiceName;
        this.createServices.vcDescription = res.table[0].vcDescription;
        this.currentServiceName = res.table[0].vcServiceName
        this.modal.show();
      })
    }
  }
  validations(event: any) {
    if (event.target.selectionStart == 0 && event.keyCode == 32 || event.keyCode >=104 && event.keyCode<=222) {
      return false;
    }
  }
  onShown(): void {
    document.getElementById('ServiceName').focus();
  }

  save(form: NgForm):void{

    let Duplicacy = this.Services.filter((x) => x.vcServiceName.toUpperCase() == this.createServices.vcServiceName.toUpperCase());
    if (Duplicacy != null && Duplicacy != undefined && Duplicacy.length > 0 && Duplicacy[0].inServiceID != this.createServices.inServiceID) {
      return this.notify.warn(this.l('DuplicateServiceMessage'));
    }
    else if (this.createServices.inServiceID == 0 || this.createServices.inServiceID == null) {
      this._services.createorUpdateService(this.createServices).subscribe(e => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
    else {
      this._services.createorUpdateService(this.createServices).subscribe(e => {
        this.notify.info(this.l('UpdateServiceMessage'));
        this.close(form);
        this.modalSave.emit(null)
      })      
    }
  }
}
export class ServiceDto{
  inServiceID:number;
  vcServiceName:string;
  vcDescription:string;
}

