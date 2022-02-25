import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvailableAddonModulesDto, DashboardCustomizationServiceProxy, EditionServiceProxy, TenantEditionAddonDto, TenantEditionAddonModulesDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-package-detailed-information',
  templateUrl: './package-detailed-information.component.html',
  styleUrls: ['./package-detailed-information.component.css']
})
export class PackageDetailedInformationComponent implements OnInit {

  @Input() PackageDetails:TenantEditionAddonDto;
  @Output() backClicked = new EventEmitter();
  @Output() upgradeClicked = new EventEmitter();

  IsExtend: boolean = false;
  IsUpgrade: boolean = false;
  dataFetched: boolean = false;
  IsBackToPackageDetails: boolean = true;
  additionalDetailsList : TenantEditionAddonModulesDto[];
  availableAddonList : AvailableAddonModulesDto[];
  EditionId;
  constructor(private _dsashboardCustomizationService: DashboardCustomizationServiceProxy, private _editionService: EditionServiceProxy) { }

  ngOnInit(): void {
    if(this.PackageDetails != null && this.PackageDetails != undefined){
    this.EditionId = this.PackageDetails.editionId;
    }
  }
  Show(editionId,packageDetails: TenantEditionAddonDto){
    this.EditionId = packageDetails.editionId;
    this.PackageDetails = packageDetails;
    this.GetPackageDetailedInformation();
    this.GetAvailableAddonBySubscribedEditionId();
  }
GetPackageDetailedInformation()
{
  if(this.PackageDetails.editionId > 0){
    this.dataFetched = false;
    this.additionalDetailsList = new Array<TenantEditionAddonModulesDto>();
    this._dsashboardCustomizationService.getTenantEditionAddonModuleDetails(this.PackageDetails.editionId )
    .subscribe(result => {
      this.dataFetched = true;
      if(result != null){
         this.additionalDetailsList = result;
         
        //  this.CheckScrollable();
      }
    });
  }
}
GetAvailableAddonBySubscribedEditionId(): void {
  this.availableAddonList = new Array<AvailableAddonModulesDto>();
  this._editionService.getAvailableAddonBySubscribedEditionId(this.PackageDetails.editionId)
  .subscribe(result => {
    this.availableAddonList = result;
  })
}
checkProcess(process){
  if(process == false){
    return true;
  }
  return false;
}
checkExpiryTime(remainingDays){
  if(remainingDays <= 7){
    return true
  }
      return false;
    }

 BackToPackageDetails(){
  this.IsUpgrade = false;
  this.IsExtend = false;
  this.backClicked.emit(null);
 }
 ExtendPackage(){
    // this.IsExtend = true;
 }
 UpgradePackage(){
  this.IsUpgrade = true;
  this.upgradeClicked.emit(true);
 }
 upgradeClickedOutput(event){
 this.IsBackToPackageDetails = !event;
 this.upgradeClicked.emit(true);
 }
 CalculateExpiryPercentage(startDate, endDate, remainingDays){
  var date1 = new Date(startDate); 
  var date2 = new Date(endDate); 
  
    var Time = date2.getTime() - date1.getTime(); 
    var totalDays = Math.floor(Time / (1000 * 3600 * 24));
    let remainPercentage = (remainingDays * 100)/totalDays;
    let color = "green"
    if(remainingDays <= 7) color = "red";
    if(remainingDays > 7 && remainingDays <= 15) color = "orange";
    
    return "width: "+remainPercentage+"%;background: "+color+";"
}
}
