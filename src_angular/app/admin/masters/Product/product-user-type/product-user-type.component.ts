import { Component, Injector, Input } from '@angular/core';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommonServiceProxy, MasterDataDto, ProductServiceProxy, ProductUserTypeEditDto, } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-product-user-type',
  templateUrl: './product-user-type.component.html',
  styleUrls: ['./product-user-type.component.css']
})
export class ProductUserTypeComponent extends AppComponentBase {
  @Input() usertype: any
  saving = false;
  SelectedUserTypes = [];
  userTypes: any;
  SelectedIndex: number = -1;
  isEdit: boolean = false;
  constructor(injector: Injector, private _product: ProductServiceProxy, private _commonServiceProxy: CommonServiceProxy, public _validationService: ValidationServiceService) {

    super(injector)

  }

  ngOnInit(): void {
    this.usertype=[];
  }
  getUserType(TypeIds?: ProductUserTypeEditDto[]) :void {
    this._commonServiceProxy.getMasterData_Cache("USERTYPE").subscribe(result => {
      this.usertype = this.fillMasterData(result, "USERTYPE");
      if (TypeIds != null && TypeIds != undefined && TypeIds.length > 0 && this.usertype != null && this.usertype.length > 0) {
        this.usertype.forEach(element => {
          let tempIndex = TypeIds.findIndex(x => x.userTypeId == element.id);
          if (tempIndex >= 0) {
            element["selected"] = true;
            if (TypeIds[tempIndex].canEdit == false) {
              element["isEdit"] = true;
            }
            if (element["selected"] == true) {
              this.SelectedUserTypes.push(element.id)
              this.userTypes = this.SelectedUserTypes.join()
            }
          }
        });
      }
    });
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
  onChange(event, id, i) {
    if (event.target.checked == true) {
      this.SelectedUserTypes.push(id);
    }
    else {
      let index = this.SelectedUserTypes.findIndex(x => x == id);
      if (index >= 0) {
        this.SelectedUserTypes.splice(index, 1);
      }
    }
    this.userTypes = this.SelectedUserTypes.join()
  }

}
