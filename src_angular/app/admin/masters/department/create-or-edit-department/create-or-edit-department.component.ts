import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateDepartmentInput, DepartmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-or-edit-department',
  templateUrl: './create-or-edit-department.component.html',
  styleUrls: ['./create-or-edit-department.component.css']
})
export class CreateOrEditDepartmentComponent  extends AppComponentBase {
  @ViewChild('createOrEditDepartment', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() Department: DepartmentDto[];
  createDepartment: CreateOrUpdateDepartmentInput = new CreateOrUpdateDepartmentInput()
  active: boolean = false;
  saving: boolean = false; 
  edit: boolean = false;
  currentDepartmentName;
  constructor(injector: Injector, private _Department: DepartmentServiceProxy,) {
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
    this.createDepartment = new CreateOrUpdateDepartmentInput;
    if (e == undefined) {
      this.active = true;
      this.createDepartment.inDepartmentID = null;
      this.modal.show();
    }
    else {
      this.active = true;
      this._Department.getDepartmentForEdit(e).subscribe(res => {
        this.createDepartment.inDepartmentID = res.table[0].inDepartmentID;
        this.createDepartment.vcDepartmentName = res.table[0].vcDepartmentName;
        this.createDepartment.vcDescription = res.table[0].vcDescription;
        this.currentDepartmentName = res.table[0].vcDepartmentName
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
    document.getElementById('DepartmentName').focus();
  }

  save(form: NgForm):void{

    let Duplicacy = this.Department.filter((x) => x.vcDepartmentName.toUpperCase() == this.createDepartment.vcDepartmentName.toUpperCase());
    if (Duplicacy != null && Duplicacy != undefined && Duplicacy.length > 0 && Duplicacy[0].inDepartmentID != this.createDepartment.inDepartmentID) {
      return this.notify.warn(this.l('DuplicateDepartmentMessage'));
    }
    else if (this.createDepartment.inDepartmentID == 0 || this.createDepartment.inDepartmentID == null) {
      this._Department.createorUpdateDepartment(this.createDepartment).subscribe(e => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
    else {
      this._Department.createorUpdateDepartment(this.createDepartment).subscribe(e => {
        this.notify.info(this.l('UpdateDepartmentMessage'));
        this.close(form);
        this.modalSave.emit(null)
      })      
    }
  }
}
export class DepartmentDto{
  inDepartmentID:number;
  vcDepartmentName:string;
  vcDescription:string;
}


