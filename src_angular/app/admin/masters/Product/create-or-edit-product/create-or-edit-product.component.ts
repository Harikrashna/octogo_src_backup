import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { PermissionTreeComponent } from '@app/admin/shared/permission-tree.component';
import { AppComponentBase } from '@shared/common/app-component-base';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { CreateOrUpdateProductInput, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { ValidationServiceService } from '@app/admin/validation-service.service';



@Component({
  selector: 'app-create-or-edit-product',
  templateUrl: './create-or-edit-product.component.html',
  styleUrls: ['./create-or-edit-product.component.css']
})
export class CreateOrEditProductComponent extends AppComponentBase {

  @ViewChild('createOrEditProduct', { static: true }) modal: ModalDirective;
  @ViewChild('permissionTree') permissionTree: PermissionTreeComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() Product: any

  createProduct: CreateOrUpdateProductInput = new CreateOrUpdateProductInput()
  active: boolean = false;
  saving: boolean = false;
  edit: boolean = false;
  currentProductName;
  constructor(injector: Injector, private _product: ProductServiceProxy,
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
    
    if (e == undefined) {
      this.active = true;
      this.createProduct.inProductID = null;
      this.modal.show();
    }

    else {
      this.active = true;
      console.log(this.Product)
      this._product.getProductForEdit(e).subscribe(res => {
        this.createProduct.inProductID = res.table[0].inProductID;
        this.createProduct.vcProductName = res.table[0].vcProductName;
        this.createProduct.vcDescription = res.table[0].vcDescription;
        this.currentProductName = res.table[0].vcProductName
        this.modal.show();
      })
    }
  }

  onShown(): void {
    document.getElementById('ProductName').focus();
  }

  save(form: NgForm):void{

    let Duplicacy = this.Product.filter((x) => x.vcProductName.trim().toUpperCase() == this.createProduct.vcProductName.trim().toUpperCase());
    if (Duplicacy != null && Duplicacy != undefined && Duplicacy.length > 0 && Duplicacy[0].inProductID != this.createProduct.inProductID) {
      return this.notify.warn(this.l('DuplicateProductMessage'));
    }
    else if (this.createProduct.inProductID == 0 || this.createProduct.inProductID == null) {
      this.saving = true;
      this._product.createorUpdateProduct(this.createProduct).subscribe(e => {
        this.saving = false;
        this.notify.info(this.l('SavedSuccessfully'));
        this.close(form);
        this.modalSave.emit(null)
      })
    }
    else {
      this.saving = true;
      this._product.createorUpdateProduct(this.createProduct).subscribe(e => {
        this.saving = false;
        this.notify.info(this.l('UpdateProductMessage'));
        this.close(form);
        this.modalSave.emit(null)
      })      
    }
  }
  
  
}
export class ProductDto{
  inProductID:number;
  vcProductName:string;
  vcDescription:string;
}


