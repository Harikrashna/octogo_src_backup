import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrUpdateIndustryInput, IndustryServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-or-edit-industry',
  templateUrl: './create-or-edit-industry.component.html',
  styleUrls: ['./create-or-edit-industry.component.css']
})
export class CreateOrEditIndustryComponent extends AppComponentBase {
  @ViewChild('createOrEditIndustry', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() Industry: IndustryDto[];
  createIndustry: CreateOrUpdateIndustryInput = new CreateOrUpdateIndustryInput()
  active: boolean = false;
  saving: boolean = false; 
  edit: boolean = false;
  currentIndustryName;
  constructor(injector: Injector, private _Industry: IndustryServiceProxy,
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
    this.createIndustry = new CreateOrUpdateIndustryInput;
    if (e == undefined) {
      this.active = true;
      this.createIndustry.inIndustryID = null;
      this.modal.show();
    }
    else {
      this.active = true;
      this._Industry.getIndustryForEdit(e).subscribe(res => {
        this.createIndustry.inIndustryID = res.table[0].inIndustryID;
        this.createIndustry.vcIndustryName = res.table[0].vcIndustryName;
        this.createIndustry.vcDescription = res.table[0].vcDescription;
        this.currentIndustryName = res.table[0].vcIndustryName
        this.modal.show();
      })
    }
  }

  onShown(): void {
    document.getElementById('IndustryName').focus();
  }


  save(form: NgForm):void{
    let Duplicacy = this.Industry.filter((x) => x.vcIndustryName.trim().toUpperCase() == this.createIndustry.vcIndustryName.trim().toUpperCase());
    if (Duplicacy != null && Duplicacy != undefined && Duplicacy.length > 0 && Duplicacy[0].inIndustryID != this.createIndustry.inIndustryID) {
      return this.notify.warn(this.l('DuplicateIndustryMessage'));
    }
    else if (this.createIndustry.inIndustryID == 0 || this.createIndustry.inIndustryID == null) {
      this._Industry.createorUpdateIndustry(this.createIndustry).subscribe(e => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
    else {
      this._Industry.createorUpdateIndustry(this.createIndustry).subscribe(e => {
        this.notify.info(this.l('UpdateIndustryMessage'));
        this.close(form);
        this.modalSave.emit(null)
      })      
    }
  }
}
export class IndustryDto{
  inIndustryID:number;
  vcIndustryName:string;
  vcDescription:string;
}


