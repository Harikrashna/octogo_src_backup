import { AfterViewInit, Component, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PricingTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditPricingTypeModalComponent } from './create-or-edit-pricing-modal/create-or-edit-pricing-type-modal.component';

@Component({
  selector: 'app-pricing-type',
  templateUrl: './pricing-type.component.html',
  styleUrls: ['./pricing-type.component.css'],
  animations: [appModuleAnimation()]
})

export class PricingTypeComponent extends AppComponentBase implements AfterViewInit {
  @ViewChild('createPricingType', { static: true }) CreateorEditPricingType: CreateOrEditPricingTypeModalComponent;
  @ViewChild('dt', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  pricingTypeList: PricingTypeDto[] = [];
  pricingType: PricingTypeDto;
  filterText=''

  constructor(injector: Injector, private _pricingTypeService: PricingTypeServiceProxy,private _activatedRoute: ActivatedRoute) {
    super(injector);
    this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }

  ngAfterViewInit(): void {
    //during page loading it is called
    this.getAllPricingList();
  }

  getAllPricingList(event?: LazyLoadEvent, isSubmit:boolean = false) {
    if(isSubmit == true){
      this.filterText = "";
    }
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();
    this._pricingTypeService.getPricingType
      (
        this.filterText,
        this.primengTableHelper.getSorting(this.dataTable),
        this.primengTableHelper.getMaxResultCount(this.paginator, event),
        this.primengTableHelper.getSkipCount(this.paginator, event)
      )
      .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.pricingTypeList = result.items;
        this.primengTableHelper.hideLoadingIndicator();
      });
  }

  //it shows the create or edit modal
  createpricingType() {
    this.CreateorEditPricingType.show();
  }

  deletePricingType(PricingType) {
    this.message.confirm
      (
        this.l('PricingTypeDeleteWarningMessage', PricingType.vcTypeName),
        this.l('AreYouSure'),
        (isConfirmed) => {
          if (isConfirmed) {
            this._pricingTypeService.deletePricingType(PricingType.inPricingTypeId).subscribe(() => {
              this.notify.info(this.l('SuccessfullyDeleted'));
              this.getAllPricingList();
            });
          }
        }
      )
  }
}

export class PricingTypeDto {
  inPricingTypeId: number;
  vcTypeName: string;
  inNoOfDays: number;
}








