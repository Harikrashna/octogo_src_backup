import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PriceApproachServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { PriceApproachComponent } from '../price-approach.component';


@Component({
  selector: 'app-create-or-edit-pricing-approach-modal',
  templateUrl: './create-or-edit-pricing-approach-modal.component.html',
})
export class CreateOrEditPricingApproachModalComponent extends AppComponentBase {
  @ViewChild('createOrEditModal', {static: true}) modal: ModalDirective;
  @ViewChild('priceApproachForm') priceApproachForm: NgForm;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  PriceApproach:PriceApproach
  PriceApproachComponent: any;
  EditPriceApproachName:any
  CurrentApproachName:string

  constructor(
    injector: Injector,private _priceApproach:PriceApproachComponent,
    private _PricingApproach:PriceApproachServiceProxy,
    public _validationService: ValidationServiceService) 
    {
    super(injector);
    this.PriceApproach = new PriceApproach();
}

  show(record?: any): void {
    if(record!=null && record!=undefined){
      this.active = true;
      this.PriceApproach.approachId = record.id
      this.PriceApproach.approachName = record.approachName
      this.CurrentApproachName= record.approachName
      this.PriceApproach.description = record.description;
      this.EditPriceApproachName=record.approachName
      this.modal.show();
    }
    else{
      this.active = true;
      this.modal.show();
    }
  }
onShown(): void {
  document.getElementById('PricingApproachName').focus();
}

save(Record:any): void {
  let flag;
  var priceApproach=this._priceApproach.records
  priceApproach.forEach(function (priceApproachValue) {
    if(priceApproachValue.approachName.trim().toUpperCase()==Record.approachName.trim().toUpperCase() && priceApproachValue.id!=Record.approachId){
    flag=0
    }
  }); 

  if(flag!=0){
   this.saving = true;
   this._PricingApproach.insertUpdatePricingApproach(Record)
       .pipe(finalize(() => this.saving = false))
       .subscribe(() => {
           this.notify.info(this.l('SavedSuccessfully'));
           this.PriceApproach.approachId=0
           this.close();
           this.modalSave.emit(null); 
       });
  }
  else{
    this.notify.warn(this.l('DuplicateApproachName'));
  }
}

close(): void {
  this.active = false;
  this.PriceApproach.approachId=0;
  this.priceApproachForm.reset();
  this.modal.hide();
}

}
export class PriceApproach{
  approachId?:number;
  approachName:string;
  description: string;
  constructor(){
    this.approachId = 0;
  }
}

