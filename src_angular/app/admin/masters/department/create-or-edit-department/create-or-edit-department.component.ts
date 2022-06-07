import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateDepartmentInput, DepartmentListDto, DepartmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-or-edit-department',
  templateUrl: './create-or-edit-department.component.html',
  styleUrls: ['./create-or-edit-department.component.css']
})
export class CreateOrEditDepartmentComponent  extends AppComponentBase {
  @ViewChild('createOrEditDepartment', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input()  departmentListDto: DepartmentListDto[];
  createDepartment: CreateOrUpdateDepartmentInput = new CreateOrUpdateDepartmentInput()
  active: boolean = false;
  saving: boolean = false; 
  edit: boolean = false;
  exist:boolean = false;
  currentDepartmentName;
  constructor(injector: Injector, private _Department: DepartmentServiceProxy,
    public _validationService: ValidationServiceService) {
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
      this._Department.getDepartmentById(e).subscribe(res => {
        this.createDepartment.inDepartmentID = res.table[0].inDepartmentID;
        this.createDepartment.vcDepartmentName = res.table[0].vcDepartmentName;
        this.createDepartment.vcDescription = res.table[0].vcDescription;
        this.currentDepartmentName = res.table[0].vcDepartmentName
        this.modal.show();
      })
    }
  }
  
  onShown(): void {
    document.getElementById('DepartmentName').focus();
  }

  save(form: NgForm):void{

    // let Duplicacy = this.Department.filter((x) => x.vcDepartmentName.toUpperCase() == this.createDepartment.vcDepartmentName.toUpperCase());
    // if (Duplicacy != null && Duplicacy != undefined && Duplicacy.length > 0 && Duplicacy[0].inDepartmentID != this.createDepartment.inDepartmentID) {
    //   return this.notify.warn(this.l('DuplicateDepartmentMessage'));
    // }
    this.exist = this.departmentListDto.some((x) => x.vcDepartmentName.trim().toUpperCase() == this.createDepartment.vcDepartmentName.trim().toUpperCase() && x.inDepartmentID != this.createDepartment.inDepartmentID);
    //if condition is true , it shows a duplicate warning message
    //otherwise it emit the current object into parent component
    if (this.exist) {
      this.notify.warn(this.l('DuplicateDepartmentMessage'));
      return;
    }
    
    else if (this.createDepartment.inDepartmentID == 0 || this.createDepartment.inDepartmentID == null) {
      this.saving = true;
      this._Department.createOrUpdateDepartment(this.createDepartment)
      .pipe(finalize(() => { this.saving = false; })).subscribe(e => {
        this.saving = false;
        this.notify.info(this.l('SavedSuccessfully'));

        this.close(form);
        this.modalSave.emit(null)
      })

      // this.primengTableHelper.totalRecordsCount = this.departmentListDto.length;
    }
    else {
      this.saving = true;
      this._Department.createOrUpdateDepartment(this.createDepartment)
      .pipe(finalize(() => { this.saving = false; })).subscribe(e => {
        this.saving = false;
        this.notify.info(this.l('UpdateDepartmentMessage'));
        this.close(form);
        this.modalSave.emit(null)
      })      
    }

    // this.primengTableHelper.totalRecordsCount = this.departmentListDto.length;
  }
}
export class DepartmentDto{
  inDepartmentID:number;
  vcDepartmentName:string;
  vcDescription:string;
}


