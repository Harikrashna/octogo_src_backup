import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { PriceApproachServiceProxy } from '@shared/service-proxies/service-proxies';
import { result } from 'lodash';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditPricingApproachModalComponent } from './create-or-edit-pricing-approach-modal/create-or-edit-pricing-approach-modal.component';


@Component({
  templateUrl: './price-approach.component.html',
  styleUrls: ['./price-approach.component.css'],
  animations: [appModuleAnimation()]
})
export class PriceApproachComponent extends AppComponentBase implements OnInit {
  @ViewChild('createOrEditPricingApproachModal', {static: true}) createOrEditPricingApproachModal: CreateOrEditPricingApproachModalComponent;
  @ViewChild('dataTable', {static: true}) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  records:any
  filterText = '';
    constructor( injector: Injector, private _priceApproachService: PriceApproachServiceProxy,private _activatedRoute: ActivatedRoute,) { 
    super(injector);
    this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }
 
  ngOnInit() {
   
  }
  edit(record){
    this.createOrEditPricingApproachModal.show(record)
  }
  getPricingApproach(event? :LazyLoadEvent, isSubmit:boolean = false):void{
    if(isSubmit == true){
      this.filterText = "";
     }
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
  }
    this._priceApproachService.getPricingApproach(
      this.filterText,
      this.primengTableHelper.getSorting(this.dataTable),
      this.primengTableHelper.getMaxResultCount(this.paginator, event),
      this.primengTableHelper.getSkipCount(this.paginator, event),
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
    .subscribe(result => {
        this.primengTableHelper.records=result.items
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.records=result.items;
        this.primengTableHelper.hideLoadingIndicator();   

    });    
  }
  
  createRole(): void {
    this.createOrEditPricingApproachModal.show();
  }
  deletePriceApproach(data): void {
    this.message.confirm(
        this.l('ApproachNameDeleteWarningMessage', data.approachName),
        this.l('AreYouSure'),
        isConfirmed => {
            if (isConfirmed) {
              this._priceApproachService.deletePricingApproach(data.id).subscribe(() => {
                this.getPricingApproach();
                  abp.notify.info(this.l('SuccessfullyDeleted'));
            });
      
            }
        }
    );
  }
}


