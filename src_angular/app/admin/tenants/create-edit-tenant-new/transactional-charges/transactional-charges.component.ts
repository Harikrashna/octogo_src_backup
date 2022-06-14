import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { AwbCostApproachDto, AwbCostApproachListDto, AwbCostApproachServiceProxy, AwbCountsDto, CommonServiceProxy, CreateOrUpdateAwbCostApproachInput, MasterDataDto, TenantServiceProxy, TransactionDataInputDto } from '@shared/service-proxies/service-proxies';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-transactional-charges',
  templateUrl: './transactional-charges.component.html',
  styleUrls: ['./transactional-charges.component.css']
})
export class TransactionalChargesComponent extends AppComponentBase implements OnInit {
  
  @ViewChild('transactionalChargesForm') transactionalChargesForm: NgForm;
  @Input()TenantId = 0;
  @Input()viewForm = false;
  active = false;
  BillingList: AwbCostApproachListDto[] = [];
  isEdit: boolean = false;
  listIndex: number = -1;
  model: AwbCountsDto = new AwbCountsDto();
  approachId: number;
  AWBData: AwbCostApproachDto[]=[];
  // public AWBCostAppraochData: AwbCostApproachDto[] = [];
  AWBCountData : CreateOrUpdateAwbCostApproachInput;
  primengTableHelperAWBCharges = new PrimengTableHelper();
  constructor(injector: Injector,
    private _commonServiceProxy: CommonServiceProxy,
    private _tenantServiceProxy : TenantServiceProxy,
    public _validationService: ValidationServiceService,private _awbcostapproachservice: AwbCostApproachServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.GetBillingApproach();
  }
  GetBillingApproach() {
    this.BillingList = [];
    this._commonServiceProxy.getMasterData_Cache("AWBCOSTAPPROACH").subscribe(result => {
      this.BillingList = this.fillMasterData(result, "AWBCOSTAPPROACH");
    })

  }
  fillMasterData(Data: MasterDataDto[], MasterName) {
    if (Data != null && Data.length > 0) {
      let filteredData = Data.filter(obj => obj.masterName == MasterName);
      if (filteredData != null && filteredData != undefined && filteredData.length > 0) {
        return filteredData[0].masterData;

      }
    }
    return [];
  }
  IsValidInput(min, max) {
    for (let i = 0; i < this.AWBData.length; i++) {
        if (i != this.listIndex && ((parseInt(min) >= (this.AWBData[i].countMin) && parseInt(min) <= (this.AWBData[i].countMax))
          || (parseInt(max) >= (this.AWBData[i].countMin) && parseInt(max) <= (this.AWBData[i].countMax))
          || (parseInt(min) <= (this.AWBData[i].countMin) && parseInt(max) <= (this.AWBData[i].countMax) && parseInt(max) >= (this.AWBData[i].countMin))
          || (parseInt(max) >= (this.AWBData[i].countMax) && parseInt(min) >= (this.AWBData[i].countMin) && parseInt(min) <= (this.AWBData[i].countMax))
          || (parseInt(min) <= (this.AWBData[i].countMin) && parseInt(max) >= (this.AWBData[i].countMax)))) {
          this.notify.warn(this.l('SelectDifferentRange'));
          return false;
        }
      }
    return true;
  }
  addAWB() {
    if(this.AWBData == null || this.AWBData == undefined){
      this.AWBData = new Array<AwbCostApproachDto>();
    }
    if (this.IsValidInput(this.model.countMin, this.model.countMax)) {
      if (!(this.listIndex >= 0)) {
        this.AWBData.push(this.model);
        this.model = new AwbCountsDto();
      }
      else {
        let k = this.listIndex;
        for (let i = 0; i < this.AWBData.length; i++) {
          if (i == k) {
            this.AWBData[i] = this.model;
            this.model = new AwbCountsDto();
          }
        }
        this.listIndex = -1;
      }
    }
  }
  getAwbData(inApproachid){
    this.AWBData = new Array<AwbCostApproachDto>();
    this._awbcostapproachservice.getPerAwbCostApproachById(inApproachid).subscribe(response => {
      
      this.AWBData = response.awbCostAppraochData;
      // console.log(response);
      // console.log(response.awbCostAppraochData);
      
      //this.AWBData = result;
    })
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

  delete(index) {
    this.message.confirm
      (
        this.l('AWBDeleteWarningMessage'),
        this.l('AreYouSure'),
        (isConfirmed) => {
          if (isConfirmed) {
            this.AWBData.splice(index, 1);
            this.model = new AwbCountsDto();
          }
        }
      )
  }
  // countMax,countMin, billingRate, amount, approachId
  edit(index: any) {
    this.model.countMin = this.AWBData[index].countMin;
    this.model.countMax = this.AWBData[index].countMax;
    this.model.billingRate = this.AWBData[index].billingRate;
    this.model.amount = this.AWBData[index].amount;
    this.model.inPerAWBCostID = this.AWBData[index].inPerAWBCostID;
    this.listIndex = index;
  }
  CheckValidData() :boolean
  {
    if(this.approachId > 0 && this.AWBData != null && this.AWBData != undefined && this.AWBData.length > 0)
    {
      return true;
    }
    else{
      const controls = this.transactionalChargesForm.controls;
      Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
    }
  }
  GetDataToInsert():TransactionDataInputDto
  {
    let data = new TransactionDataInputDto();
    data.approachId = this.approachId;
    data.awbData = this.AWBData;
    return data;
  }
}

