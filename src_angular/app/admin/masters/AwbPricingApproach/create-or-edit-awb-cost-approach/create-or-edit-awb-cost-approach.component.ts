import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { AwbCostApproachDto, AwbCostApproachListDto, AwbCostApproachServiceProxy, AwbCountsDto, CreateOrUpdateAwbCostApproachInput } from '@shared/service-proxies/service-proxies';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';

@Component({
  selector: 'app-create-or-edit-awb-cost-approach',
  templateUrl: './create-or-edit-awb-cost-approach.component.html',
  styleUrls: ['./create-or-edit-awb-cost-approach.component.css']
})
export class CreateOrEditAwbCostApproachComponent extends AppComponentBase {
  AwbCostApproachForm: NgForm;
  @ViewChild('createOrEditAwbCostApproach', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
  @ViewChild('AwbCostApproachForm') awbCostApproachForm: NgForm;
  @Input() perAWBCostApproach: AwbCostApproachListDto[]
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  createAwbApproach: CreateOrUpdateAwbCostApproachInput = new CreateOrUpdateAwbCostApproachInput()

  AwbCostApproachComponent: any;

  active = false;
  saving = false;
  isEdit = false;
  vcApproachName = '';
  model: AwbCostApproachDto = new AwbCostApproachDto();
  listIndex: number = -1;
  public AWBCostAppraochData: AwbCostApproachDto[] = [];
  primengTableHelperAWBCharges = new PrimengTableHelper();
  constructor(injector: Injector, private _awbcostapproachservice: AwbCostApproachServiceProxy
    , public _validationService: ValidationServiceService) {
    super(injector)
  }

  ngOnInit(): void {
  }

  show(inApproachid?: number): void {
    if (inApproachid == undefined) {
      this.active = true;
      this.isEdit = false;
      this.modal.show();
    }
    else {
      debugger
      this.active = true;
      this.isEdit = true;
      this._awbcostapproachservice.getPerAwbCostApproachForEdit(inApproachid).subscribe(response => {
        this.createAwbApproach.inApproachID = response.inApproachID;
        this.createAwbApproach.vcApproachName = response.vcApproachName;
        this.createAwbApproach.vcDescription = response.vcDescription;
        this.AWBCostAppraochData = response.awbCostAppraochData;
        this.vcApproachName = response.vcApproachName;
        this.modal.show();
      })
    }
  }

  save(form: NgForm): void {
    if (this.AWBCostAppraochData.length == 0) {
      this.notify.warn('Please Add AWB Counts, Rate & Amount');
    }
    else {
      let Duplicacy = this.perAWBCostApproach.filter((a) => a.vcApproachName.trim().toLowerCase() === this.createAwbApproach.vcApproachName.trim().toLowerCase() && a.inApproachID != this.createAwbApproach.inApproachID).length === 1;;
      if (Duplicacy) {
        return this.notify.warn(this.l('DuplicateRecord'));
      }
      else if (this.CheckValidData() == true && this.createAwbApproach.inApproachID == null) {
        this.createAwbApproach.awbCostAppraochData = this.AWBCostAppraochData;
        this._awbcostapproachservice.createOrUpdateAwbCostType(this.createAwbApproach).subscribe(e => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.close(form)
          this.modalSave.emit(null);
        })
      }
      else {
        this.saving = true;
        this.createAwbApproach.awbCostAppraochData = this.AWBCostAppraochData;
        this._awbcostapproachservice.createOrUpdateAwbCostType(this.createAwbApproach).subscribe(e => {
          this.saving = false;
          this.notify.info(this.l('UpdateAwbCostApproachMessage'));
          this.close(form)
          this.modalSave.emit(null);
        })
      }
    }
  }

  onShown(): void {
    document.getElementById('vcApproachName').focus();;
  }

  close(form: NgForm): void {
    this.active = false;
    this.createAwbApproach.inApproachID = null;
    this.modal.hide();
    this.AWBCostAppraochData = [];
    form.resetForm();
  }

  CalculateAmount() {
    if (this.model.countMax != null && this.model.countMax > 0 && this.model.billingRate != null && this.model.billingRate > 0) {
      this.model.amount = this.model.countMax * this.model.billingRate;
    }
  }

  checkValidMaxCount(min, max) {
    if (parseInt(min) >= parseInt(max)) {
      this.notify.warn(this.l("MaxShouldbeGreaterThanMin"));
      this.model.countMax = null;
    }
  }

  IsValidInput(min, max) {
    for (let i = 0; i < this.AWBCostAppraochData.length; i++) {
      if (i != this.listIndex && ((parseInt(min) >= (this.AWBCostAppraochData[i].countMin) && parseInt(min) <= (this.AWBCostAppraochData[i].countMax))
        || (parseInt(max) >= (this.AWBCostAppraochData[i].countMin) && parseInt(max) <= (this.AWBCostAppraochData[i].countMax))
        || (parseInt(min) <= (this.AWBCostAppraochData[i].countMin) && parseInt(max) <= (this.AWBCostAppraochData[i].countMax) && parseInt(max) >= (this.AWBCostAppraochData[i].countMin))
        || (parseInt(max) >= (this.AWBCostAppraochData[i].countMax) && parseInt(min) >= (this.AWBCostAppraochData[i].countMin) && parseInt(min) <= (this.AWBCostAppraochData[i].countMax))
        || (parseInt(min) <= (this.AWBCostAppraochData[i].countMin) && parseInt(max) >= (this.AWBCostAppraochData[i].countMax)))) {
        this.notify.warn(this.l('SelectDifferentRange'));
        return false;
      }
    }
    return true;
  }

  addAWB() {
    let Duplicacy = this.perAWBCostApproach.filter((a) => a.vcApproachName.trim().toLowerCase() === this.createAwbApproach.vcApproachName.trim().toLowerCase() && a.inApproachID != this.createAwbApproach.inApproachID).length === 1;;
    if (Duplicacy) {
      return this.notify.warn(this.l('DuplicateRecord'));
    }
    if (this.IsValidInput(this.model.countMin, this.model.countMax)) {
      if (!(this.listIndex >= 0) && Duplicacy == false) {
        this.AWBCostAppraochData.push(this.model);
        this.model = new AwbCostApproachDto();
      }
      else {
        let k = this.listIndex;
        for (let i = 0; i < this.AWBCostAppraochData.length; i++) {
          if (i == k) {
            this.AWBCostAppraochData[i] = this.model;
            this.model = new AwbCostApproachDto();
          }
        }
        this.listIndex = -1;
      }
    }
  }

  delete(index) {
    this.message.confirm
      (
        this.l('AWBDeleteWarningMessage'),
        this.l('AreYouSure'),
        (isConfirmed) => {
          if (isConfirmed) {
            this.AWBCostAppraochData.splice(index, 1);
            this.model = new AwbCostApproachDto();
          }
        }
      )
  }
  // countMax,countMin, billingRate, amount, approachId
  edit(index: any) {
    this.model.inPerAWBCostID=this.AWBCostAppraochData[index].inPerAWBCostID;
    this.model.countMin = this.AWBCostAppraochData[index].countMin;
    this.model.countMax = this.AWBCostAppraochData[index].countMax;
    this.model.billingRate = this.AWBCostAppraochData[index].billingRate;
    this.model.amount = this.AWBCostAppraochData[index].amount;
    this.listIndex = index;
  }

  CheckValidData(): boolean {
    if (this.AWBCostAppraochData != null && this.AWBCostAppraochData != undefined && this.AWBCostAppraochData.length > 0 && this.createAwbApproach.vcApproachName !=null) {
      return true;
    }
    else {
      const controls = this.AwbCostApproachForm.controls;
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
    }
  }
}
