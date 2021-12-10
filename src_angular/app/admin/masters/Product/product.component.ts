import { CreateOrEditProductComponent } from './create-or-edit-product/create-or-edit-product.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  animations: [appModuleAnimation()]
})
export class ProductComponent extends AppComponentBase implements AfterViewInit {



  @ViewChild('createOrEditProduct', { static: true }) createOrEditProduct: CreateOrEditProductComponent;
  @ViewChild('createOrEditProduct', { static: true }) modal: ModalDirective;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  Product: any;
  filterText = '';

  constructor(injector: Injector, private _product: ProductServiceProxy,
    private _activatedRoute: ActivatedRoute) { super(injector); 
    this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }

  ngAfterViewInit(){
    this.getallProductList();
  }
  
  getallProductList(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
        this.paginator.changePage(0);
        return;
    }

    this.primengTableHelper.showLoadingIndicator();
    this._product.getProduct(
        this.primengTableHelper.getMaxResultCount(this.paginator, event),
        this.primengTableHelper.getSkipCount(this.paginator, event),
        this.primengTableHelper.getSorting(this.dataTable),
        this.filterText
    
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
    this.primengTableHelper.totalRecordsCount = result.items.length;
        this.primengTableHelper.records = result.items;
        this.Product=result.items;
      
        this.primengTableHelper.hideLoadingIndicator();
    });
}
  createProduct(): void {
    this.createOrEditProduct.show();
  }
  deleteProduct(product) {
    this.message.confirm
      (
        this.l('ProductDeleteWarningMessage', product.vcProductName),
        this.l('AreYouSure'),
        (isConfirmed) => {
          if (isConfirmed) {
            this._product.deleteProduct(product.inProductID).subscribe(() => {
              this.notify.info(this.l('SuccessfullyDeleted'));
              this.getallProductList();
            });
          }
        }
      )
  }

  
}


