import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DesignationServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { DesignationComponent } from '../designation.component';


@Component({
  selector: 'app-create-or-update-designation',
  templateUrl: './create-or-update-designation.component.html',
  styleUrls: ['./create-or-update-designation.component.css']
})
export class CreateOrUpdateDesignationComponent  extends AppComponentBase  {
  @ViewChild('createOrEditModal', {static: true}) modal: ModalDirective;
  @ViewChild('designationForm') designationForm: NgForm;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  saving = false;
  designation:Designation
  PriceApproachComponent: any;
  currentDesingnation:string
  constructor(  injector: Injector,private _designation:DesignationComponent,private _Designation:DesignationServiceProxy) {
    super(injector);
    this.designation = new Designation();
   }

   isAlphanumericAndAlphabet(e){
  
  
    if(e.target.value=="" && e.keyCode==32){
      return false    
    }
   
    if(e.target.value=="" && e.keyCode>=48 && e.keyCode<=57){
      return false
    }
    var keyCode=e.which? e.which:e.keyCode
    var ret=((keyCode >=97 && keyCode<=122) || (keyCode >=65 && keyCode<=90 ) || (keyCode==32)
    || (keyCode>=48 && keyCode<=57) || e.keyCode==45 || e.keyCode==8 ||e.keyCode==37 || e.keyCode==39);
    return ret
  
  }
    show(record?: any): void {
      
      if(record!=null && record!=undefined){
        this.active = true;
        this.designation.designationId = record.id
        this.designation.designationName = record.designationName
        this.currentDesingnation= record.designationName
        this.designation.description = record.description;
        this.modal.show();
      }
      else{
        this.active = true;
        this.modal.show();
      }
    }
  onShown(): void {
    document.getElementById('DesignationName').focus();
  }
  
  save(Record:any): void {
    let flag
    let designation=this._designation.records
    designation.forEach(function (designationValue) {
      if(designationValue.designationName.trim().toUpperCase()==Record.designationName.trim().toUpperCase() && designationValue.id!=Record.designationId){
      flag=0
      }
    }); 
  
  
    if(flag!=0){
     this.saving = true;
     this._Designation.insertUpdateDesignation(Record)
         .pipe(finalize(() => this.saving = false))
         .subscribe(() => {
             this.notify.info(this.l('SavedSuccessfully'));
             this.designation.designationId=0
             this.close();
             this.modalSave.emit(null); 
         });
    }
    else{
      this.notify.warn(this.l('DuplicateDesignationName'));
    }
  }
  
  close(): void {
    this.active = false;
    this.designation.designationId=0;
    this.designationForm.reset();
    this.modal.hide();
  }
  
  }
  export class Designation{
    designationId?:number;
    designationName:string;
    description: string;
    constructor(){
      this.designationId = 0;
    }
  }

