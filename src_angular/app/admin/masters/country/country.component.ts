import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CountryServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditCountryComponent } from './create-or-edit-country/create-or-edit-country.component';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  animations: [appModuleAnimation()]
})
export class CountryComponent extends AppComponentBase implements AfterViewInit {
  @ViewChild('createOrEditCountry', { static: true }) createOrEditCountry: CreateOrEditCountryComponent;
   @ViewChild('createOrEditCountry', { static: true }) modal: ModalDirective;
   @ViewChild('dataTable', { static: true }) dataTable: Table;
   @ViewChild('paginator', { static: true }) paginator: Paginator;
   Country: any;
   filterText = '';
   constructor(injector: Injector,private _country: CountryServiceProxy, private _activatedRoute: ActivatedRoute) {
     super(injector);
     this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
   }
 
   getallCountryList(event?: LazyLoadEvent) {
     if (this.primengTableHelper.shouldResetPaging(event)) {
       this.paginator.changePage(0);
       return;
     }
     this.primengTableHelper.showLoadingIndicator();
     this._country.getCountry(
       this.primengTableHelper.getMaxResultCount(this.paginator, event),
       this.primengTableHelper.getSkipCount(this.paginator, event),
       this.primengTableHelper.getSorting(this.dataTable),
       this.filterText,
     ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this.primengTableHelper.records=result.items
      this.primengTableHelper.totalRecordsCount = result.totalCount;
      this.Country=result.items;
      this.primengTableHelper.hideLoadingIndicator();  
     });
   }
 
   ngAfterViewInit() {
     this.getallCountryList();
   }
 
   createCountry(): void {
     this.createOrEditCountry.show();
   }
 
   deleteCountry(Country) {
     this.message.confirm
       (
         this.l('CountryDeleteWarningMessage', Country.countryName),
         this.l('AreYouSure'),
         (isConfirmed) => {
           if (isConfirmed) {
             this._country.deleteCountry(Country.sNo).subscribe(() => {
               this.notify.info(this.l('SuccessfullyDeleted'));
               this.getallCountryList();
             });
           }
         }
       )
    }
 }
