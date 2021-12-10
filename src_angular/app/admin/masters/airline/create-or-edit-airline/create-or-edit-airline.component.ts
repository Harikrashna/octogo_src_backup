import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm, PatternValidator } from '@angular/forms';
import { AirlineServiceProxy, CreateOrUpdateAirlineInput } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-create-or-edit-airline',
  templateUrl: './create-or-edit-airline.component.html',
  styleUrls: ['./create-or-edit-airline.component.css']
})
export class CreateOrEditAirlineComponent extends AppComponentBase {
    @ViewChild('createOrEditAirline', { static: true }) modal: ModalDirective;
    @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Input() Airline: AirlineDto[];
    createAirline: CreateOrUpdateAirlineInput = new CreateOrUpdateAirlineInput()
    active: boolean = false;
    saving: boolean = false;
    edit: boolean = false;
    currentAirlineName;
  constructor(injector: Injector, private _Airline: AirlineServiceProxy,) { super(injector)}

  ngOnInit() {
  }
  close(form: NgForm): void {
    this.active = false;
    this.modal.hide();
    this.edit = !this.edit;
    form.resetForm();
  }
  show(e?: number): void {
    this.createAirline = new CreateOrUpdateAirlineInput;
    if (e == undefined) {
      this.active = true;
      this.createAirline.inAirlineID = null;
      this.modal.show();
    }
    else {
      this.active = true;
      this._Airline.getAirlineForEdit(e).subscribe(res => {
        this.createAirline.inAirlineID = res.table[0].inAirlineID;
        this.createAirline.vcAirlineName = res.table[0].vcAirlineName;
        this.createAirline.vcDescription = res.table[0].vcDescription;
        this.currentAirlineName = res.table[0].vcAirlineName
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
    document.getElementById('AirlineName').focus();
  }

  save(form: NgForm):void{

    let Duplicacy = this.Airline.filter((x) => x.vcAirlineName.toUpperCase() == this.createAirline.vcAirlineName.toUpperCase());
    if (Duplicacy != null && Duplicacy != undefined && Duplicacy.length > 0 && Duplicacy[0].inAirlineID != this.createAirline.inAirlineID) {
      return this.notify.warn(this.l('DuplicateAirlineMessage'));
    }
    else if (this.createAirline.inAirlineID == 0 || this.createAirline.inAirlineID == null) {
      this._Airline.createorUpdateAirline(this.createAirline).subscribe(e => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
    else {
      this._Airline.createorUpdateAirline(this.createAirline).subscribe(e => {
        this.notify.info(this.l('UpdateAirlineMessage'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
  }
}
export class AirlineDto{
    inAirlineID:number;
    vcAirlineName:string;
    vcDescription:string;
  }

