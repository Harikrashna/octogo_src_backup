import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateUserTypeInputDto, UserTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-or-edit-usertype',
  templateUrl: './create-or-edit-usertype.component.html',
  styleUrls: ['./create-or-edit-usertype.component.css']
})
export class CreateOrEditUsertypeComponent extends AppComponentBase {
  @ViewChild('createOrEditUserType', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() UserType: UserTypeDto[];
  createUserType: CreateOrUpdateUserTypeInputDto = new CreateOrUpdateUserTypeInputDto()
  active: boolean = false;
  saving: boolean = false; 
  edit: boolean = false;
  currentUserTypeName;
  constructor(injector: Injector, private _UserType: UserTypeServiceProxy,) {
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
    this.createUserType = new CreateOrUpdateUserTypeInputDto();
    if (e == undefined) {
      this.active = true;
      this.createUserType.inUserTypeID = null;
      this.modal.show();
    }
    else {
      this.active = true;
      this._UserType.getUserTypeForEdit(e).subscribe(res => {
        this.createUserType.inUserTypeID = res.table[0].inUserTypeID;
        this.createUserType.vcUserTypeName = res.table[0].vcUserTypeName;
        this.createUserType.vcDescription = res.table[0].vcDescription;
        this.currentUserTypeName = res.table[0].vcUserTypeName
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
    document.getElementById('UserTypeName').focus();
  }

  save(form: NgForm):void{

    let Duplicacy = this.UserType.filter((x) => x.vcUserTypeName.toUpperCase() == this.createUserType.vcUserTypeName.toUpperCase());
    if (Duplicacy != null && Duplicacy != undefined && Duplicacy.length > 0 && Duplicacy[0].inUserTypeID != this.createUserType.inUserTypeID) {
      return this.notify.warn(this.l('DuplicateUserTypeMessage'));
    }
    else if (this.createUserType.inUserTypeID == 0 || this.createUserType.inUserTypeID == null) {
      this._UserType.createorUpdateUserType(this.createUserType).subscribe(e => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
    else {
      this._UserType.createorUpdateUserType(this.createUserType).subscribe(e => {
        this.notify.info(this.l('UpdateUserTypeMessage'));
        this.close(form);
        this.modalSave.emit(null)
      })      
    }
  }
}
export class UserTypeDto{
  inUserTypeID:number;
  vcUserTypeName:string;
  vcDescription:string;
}

