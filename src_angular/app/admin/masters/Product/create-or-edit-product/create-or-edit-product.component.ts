import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { CommonServiceProxy, CreateOrUpdateProductInput, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { ValidationServiceService } from '@app/admin/validation-service.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ProductUserTypeComponent } from '../product-user-type/product-user-type.component';
import { Router } from '@angular/router';
import { ProductModulesComponent } from '../product-modules/product-modules.component';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'app-create-or-edit-product',
  templateUrl: './create-or-edit-product.component.html',
  styleUrls: ['./create-or-edit-product.component.css']
})
export class CreateOrEditProductComponent extends AppComponentBase {

  @ViewChild('createOrEditProduct', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
  @ViewChild('productModule') productModule: ProductModulesComponent;
  @ViewChild('usertypes') usertypes: ProductUserTypeComponent;
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() Product: any

  createProduct: CreateOrUpdateProductInput = new CreateOrUpdateProductInput()
  active: boolean = false;
  saving: boolean = false;
  edit: boolean = false;
  usertype: any = [];
  currentProductName;
  constructor(injector: Injector, private _product: ProductServiceProxy, 
    private _commonServiceProxy: CommonServiceProxy, private _router: Router,
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
    if (e == undefined && this.usertypes) {
      this.active = true;
      this.createProduct.inProductID = null;
      this.usertypes.getUserType();
      this.modal.show();
    }
    else {
      this.active = true;
      this._product.getProductById(e).subscribe(res => {
        this.createProduct.inProductID = res.inProductID;
        this.createProduct.vcProductName = res.vcProductName;
        this.createProduct.vcDescription = res.vcDescription;
        this.usertypes.getUserType(res.userTypes);
        this.currentProductName = res.vcProductName;
        this.modal.show();
      })
      this._product.getProductModuleList(e).subscribe(result => {
        if (result != null) {
           this.productModule.ModuleList = result;         
        }
      });
    }
  }

  onShown(): void {
    document.getElementById('ProductName').focus();
  }
  selectTab(tabId: number) {
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
    }
  }
  save(form: NgForm): void {
    this.createProduct.userTypes = this.usertypes.userTypes;
    if (this.createProduct.userTypes == undefined || this.createProduct.userTypes == "") {
      this.notify.warn(this.l('PleaseSelectuserType'));
      this.selectTab(1);
    } else {
     if (this.createProduct.inProductID == 0 || this.createProduct.inProductID == null) {
        this.saving = true;
        this._product.createorUpdateProduct(this.createProduct)
        .pipe(finalize(() => this.saving = false))
        .subscribe(e => {
          this.saving = false;
          this.notify.info(this.l('SavedSuccessfully'));
          this.close(form);
          this.modalSave.emit(null)
        })
      }
      else {
        this.saving = true;
        this._product.createorUpdateProduct(this.createProduct)
        .pipe(finalize(() => this.saving = false))
        .subscribe(e => {
          this.saving = false;
          this.notify.info(this.l('UpdateProductMessage'));
          this.close(form);
          this.modalSave.emit(null)
        })
      }
    }
  }
  
  
}
export class ProductDto{
  inProductID:number;
  vcProductName:string;
  vcDescription:string;
}


