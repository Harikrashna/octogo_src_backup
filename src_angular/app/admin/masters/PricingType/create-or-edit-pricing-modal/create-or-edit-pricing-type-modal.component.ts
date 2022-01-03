import { Component, ElementRef, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateorUpdatePricingType, PricingTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PricingTypeDto } from '../pricing-type.component';

@Component({
  selector: 'CreateorEditPricingType',
  templateUrl: './create-or-edit-pricing-type-modal.component.html',
  styleUrls: ['./create-or-edit-pricing-type-modal.component.css']
})
export class CreateOrEditPricingTypeModalComponent extends AppComponentBase {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @ViewChild('typeNameInput', { static: false }) nameInput: ElementRef;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() pricingTypeList: PricingTypeDto[]
  @Output() data = new EventEmitter<any>();

  active: boolean = false;
  saving: boolean = false;
  edit: boolean = false;
  editpricingType: CreateorUpdatePricingType;
  exist: boolean;
  currentTypeName;
  currentNoOfDays;




  constructor(injector: Injector, private _pricingTypeService: PricingTypeServiceProxy,
    public _validationService: ValidationServiceService) {
    super(injector)
    this.editpricingType = new CreateorUpdatePricingType()
  }

  ngOnInit(): void {
  }

  //it is called whenever a user clicks on cancel
  close(form: NgForm): void {
    this.active = false;
    this.modal.hide();
    this.edit = !this.edit;
    form.resetForm();
  }

  //it is callled when the CreateorEditModal is called
  show(i?: number): void {
    if (i == undefined) {
      this.active = true;
      this.modal.show();
    }
    else {
      this.active = true;
      this._pricingTypeService.getPricingTypeForEdit(i).subscribe(res => {
        this.editpricingType.inPricingTypeId = res.table[0].inPricingTypeID;
        this.editpricingType.vcTypeName = res.table[0].vcTypeName;
        this.editpricingType.inNoOfDays = res.table[0].inNoOfDays;
        this.currentTypeName = res.table[0].vcTypeName
        this.currentNoOfDays = res.table[0].inNoOfDays;
        this.modal.show();
      })
    }
  }
  //it focuses on input element 
  onShown(): void {
    this.nameInput.nativeElement.focus();
  }

  //it is called whenever a user clicks on save during save or edit
  save(form: NgForm): void {
    //this condition checks value of Type Name field
    let isNum = /^\d+$/.test(this.editpricingType.vcTypeName);
    //if Type-Name is only numeric , it shows a warning message
    if (isNum) {
      this.notify.warn(this.l('OnlyNumericCharacters'))
      return
    }
    //it checks the duplicate condition
    this.exist = this.pricingTypeList.some((x) => x.vcTypeName.trim().toUpperCase() == this.editpricingType.vcTypeName.trim().toUpperCase() && x.inNoOfDays == this.editpricingType.inNoOfDays && x.inPricingTypeId != this.editpricingType.inPricingTypeId || (x.vcTypeName.trim().toUpperCase() == this.editpricingType.vcTypeName.trim().toUpperCase() || x.inNoOfDays == this.editpricingType.inNoOfDays) && x.inPricingTypeId != this.editpricingType.inPricingTypeId);
    //if condition is true , it shows a duplicate warning message
    //otherwise it emit the current object into parent component
    if (this.exist) {
      this.notify.warn(this.l('DuplicatePricingTypeMessage'));
      return;
    }
    else {
      this.saving = true;
      if (this.editpricingType.inPricingTypeId != null) {
        this._pricingTypeService.insertUpdatePricingType(this.editpricingType).subscribe(e => {
          this.saving = false;
          this.notify.info(this.l('UpdatePricingTypeMessage'));
          this.close(form);
          this.modalSave.emit(null);
        })
        this.primengTableHelper.totalRecordsCount = this.pricingTypeList.length;
      }
      else {
        this._pricingTypeService.insertUpdatePricingType(this.editpricingType).subscribe(e => {
          this.saving = false;
          this.notify.info(this.l('SavedSuccessfully'));
          this.close(form);
          this.modalSave.emit(null);
        })
        this.primengTableHelper.totalRecordsCount = this.pricingTypeList.length;
      }
    }
  }


  //it is called during keyup event on No of Days
  //it allows only numbers to be entered
  //restrict the user from entering other than numbers   
  IsNumeric(e) {
    if (e.target.value == "" && e.keyCode == 48) {
      return false
    }
    var keyCode = e.which ? e.which : e.keyCode
    var ret = ((keyCode >= 48 && keyCode <= 57));
    return ret
  }
}


