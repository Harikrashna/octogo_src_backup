import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { CommonLookupModalComponent } from '@app/shared/common/lookup/common-lookup-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CommonLookupServiceProxy, CommonServiceProxy, EditionServiceProxy, EntityDtoOfInt64, FindUsersInput, GetTenantsInputNew, NameValueDto, SubscribedEditionDetailsDto, TenantListNewDto, TenantServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTime } from 'luxon';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { CreateTenantModalComponent } from './create-tenant-modal.component';
import { EditTenantModalComponent } from './edit-tenant-modal.component';
import { TenantFeaturesModalComponent } from './tenant-features-modal.component';
import { EntityTypeHistoryModalComponent } from '@app/shared/common/entityHistory/entity-type-history-modal.component';
import { filter as _filter } from 'lodash-es';
import { finalize } from 'rxjs/operators';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { TenantSubscriptionDetailsComponent } from './tenant-subscription-details/tenant-subscription-details.component';
import { CreateEditTenantNewComponent } from './create-edit-tenant-new/create-edit-tenant-new.component';

@Component({
    templateUrl: './tenants.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TenantsComponent extends AppComponentBase implements OnInit {

    @ViewChild('impersonateUserLookupModal', {static: true}) impersonateUserLookupModal: CommonLookupModalComponent;
    @ViewChild('createTenantModal', {static: true}) createTenantModal: CreateTenantModalComponent;
    @ViewChild('editTenantModal', {static: true}) editTenantModal: EditTenantModalComponent;
    @ViewChild('tenantFeaturesModal', {static: true}) tenantFeaturesModal: TenantFeaturesModalComponent;
    @ViewChild('subscriptionsModel', {static: true}) subscriptionsModel: TenantSubscriptionDetailsComponent;
    @ViewChild('dataTable', {static: true}) dataTable: Table;
    @ViewChild('paginator', {static: true}) paginator: Paginator;
    @ViewChild('entityTypeHistoryModal', {static: true}) entityTypeHistoryModal: EntityTypeHistoryModalComponent;
    @ViewChild('createEditTenantNew', { static: true }) createEditTenantNew: CreateEditTenantNewComponent;

    subscriptionDateRange: DateTime[] = [this._dateTimeService.getStartOfDay(), this._dateTimeService.getEndOfDayPlusDays(30)];
    creationDateRange: DateTime[] = [this._dateTimeService.getStartOfDay(), this._dateTimeService.getEndOfDay()];

    _entityTypeFullName = 'CF.Octogo.MultiTenancy.Tenant';
    entityHistoryEnabled = false;
    ProductList: any;
    EditionList:any;
    selectedTenantId = 0;
    showCreateForm :boolean = false;

    filters: {
        filterText: string;
        creationDateRangeActive: boolean;
        subscriptionEndDateRangeActive: boolean;
        selectedEditionId: number;
        selectedProductId: number;
    } = <any>{};

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _commonLookupService: CommonLookupServiceProxy,
        private _impersonationService: ImpersonationService,
        private _dateTimeService: DateTimeService,
        private _commonServiceProxy: CommonServiceProxy,
        private _editionService: EditionServiceProxy
    ) {
        super(injector);
        this.setFiltersFromRoute();
    }

    setFiltersFromRoute(): void {
        if (this._activatedRoute.snapshot.queryParams['subscriptionEndDateStart'] != null) {
            this.filters.subscriptionEndDateRangeActive = true;
            this.subscriptionDateRange[0] = this._dateTimeService.fromISODateString(this._activatedRoute.snapshot.queryParams['subscriptionEndDateStart']);
        } else {
            this.subscriptionDateRange[0] = this._dateTimeService.getStartOfDay();
        }

        if (this._activatedRoute.snapshot.queryParams['subscriptionEndDateEnd'] != null) {
            this.filters.subscriptionEndDateRangeActive = true;
            this.subscriptionDateRange[1] = this._dateTimeService.fromISODateString(this._activatedRoute.snapshot.queryParams['subscriptionEndDateEnd']);
        } else {
            this.subscriptionDateRange[1] = this._dateTimeService.getEndOfDayPlusDays(30);
        }

        if (this._activatedRoute.snapshot.queryParams['creationDateStart'] != null) {
            this.filters.creationDateRangeActive = true;
            this.creationDateRange[0] = this._dateTimeService.fromISODateString(this._activatedRoute.snapshot.queryParams['creationDateStart']);
        } else {
            this.creationDateRange[0] = this._dateTimeService.getEndOfDayMinusDays(7);
        }

        if (this._activatedRoute.snapshot.queryParams['creationDateEnd'] != null) {
            this.filters.creationDateRangeActive = true;
            this.creationDateRange[1] = this._dateTimeService.fromISODateString(this._activatedRoute.snapshot.queryParams['creationDateEnd']);
        } else {
            this.creationDateRange[1] = this._dateTimeService.getEndOfDay();
        }

        if (this._activatedRoute.snapshot.queryParams['editionId'] != null) {
            this.filters.selectedEditionId = parseInt(this._activatedRoute.snapshot.queryParams['editionId']);
        }
    }

    ngOnInit(): void {
        this.filters.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
        this.GetProductList();
        this.setIsEntityHistoryEnabled();

        this.impersonateUserLookupModal.configure({
            title: this.l('SelectAUser'),
            dataSource: (skipCount: number, maxResultCount: number, filter: string, tenantId?: number) => {
                let input = new FindUsersInput();
                input.filter = filter;
                input.maxResultCount = maxResultCount;
                input.skipCount = skipCount;
                input.tenantId = tenantId;
                return this._commonLookupService.findUsers(input);
            }
        });
    }

    private setIsEntityHistoryEnabled(): void {
        let customSettings = (abp as any).custom;
        this.entityHistoryEnabled = customSettings.EntityHistory && customSettings.EntityHistory.isEnabled && _filter(customSettings.EntityHistory.enabledEntities, entityType => entityType === this._entityTypeFullName).length === 1;
    }

    getTenants(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);

            return;
        }

        this.primengTableHelper.showLoadingIndicator();
        let input = new GetTenantsInputNew();
        input.filter = this.filters.filterText;
        input.subscriptionEndDateStart = this.filters.subscriptionEndDateRangeActive ? this.subscriptionDateRange[0] : undefined;
        input.subscriptionEndDateEnd = this.filters.subscriptionEndDateRangeActive ? this.subscriptionDateRange[1].endOf('day') : undefined;
        input.creationDateStart = this.filters.creationDateRangeActive ? this.creationDateRange[0] : undefined;
        input.creationDateEnd = this.filters.creationDateRangeActive ? this.creationDateRange[1].endOf('day') : undefined;
        input.editionId =  this.filters.selectedEditionId;
        input.editionIdSpecified = this.filters.selectedEditionId !== undefined && (this.filters.selectedEditionId + '') !== '-1';
        input.productId = this.filters.selectedProductId;
        input.sorting = this.primengTableHelper.getSorting(this.dataTable);
        input.skipCount = this.primengTableHelper.getSkipCount(this.paginator, event);
        input.maxResultCount = this.primengTableHelper.getMaxResultCount(this.paginator, event);
        this._tenantService.getTenantsNew(input).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    showUserImpersonateLookUpModal(record: any): void {
        this.impersonateUserLookupModal.tenantId = record.id;
        this.impersonateUserLookupModal.show();
    }

    unlockUser(record: any): void {
        this._tenantService.unlockTenantAdmin(new EntityDtoOfInt64({ id: record.id })).subscribe(() => {
            this.notify.success(this.l('UnlockedTenandAdmin', record.name));
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createTenant(): void {
        this.showCreateForm = true;
        this.selectedTenantId = 0;
        // this.createOrEditTenant.show();
      }
    editTenant(tenantId) {
        debugger
        this.showCreateForm = true;
        this.selectedTenantId = tenantId;
        // let timer = setInterval(() => {
        //     if (this.createEditTenantNew != null && this.createEditTenantNew != undefined) {
        //         clearInterval(timer);
        //         this.createEditTenantNew.IsEdit = true;
        //         this.createEditTenantNew.TenantId = tenantId;
        //     }
        // }, 50)
    }
    CreateFormClosed(event) {
        this.showCreateForm = false;
        this.selectedTenantId = 0;
        if(event == true){
            this.getTenants();
        }
      }

    deleteTenant(tenant: TenantListNewDto): void {
        this.message.confirm(
            this.l('TenantDeleteWarningMessage', tenant.tenancyName),
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._tenantService.deleteTenant(tenant.id).subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
                }
            }
        );
    }

    showHistory(tenant: TenantListNewDto): void {
        this.entityTypeHistoryModal.show({
            entityId: tenant.id.toString(),
            entityTypeFullName: this._entityTypeFullName,
            entityTypeDescription: tenant.tenancyName
        });
    }

    impersonateUser(item: NameValueDto): void {
        this._impersonationService
            .impersonate(
                parseInt(item.value),
                this.impersonateUserLookupModal.tenantId
            );
    }
    GetProductList(){
        let masterName = "PRODUCT";
        this.ProductList = [];
        this._commonServiceProxy.getMasterData_Cache(masterName).subscribe(result => {
            if (result != null && result.length > 0) {
                let filteredData = result.filter(obj => obj.masterName == masterName);
                if (filteredData != null && filteredData != undefined && filteredData.length > 0) {
                  this.ProductList =  filteredData[0].masterData;
                }
              }
          });
    }
    GetEditionList()
    {
        this.filters.selectedEditionId = null;
        this.EditionList = [];
        if(this.filters.selectedProductId > 0){
            this._editionService.getEditionsByProductId(this.filters.selectedProductId, 0, '')
            .pipe().subscribe(result => {
                this.EditionList = result.items;
            });
        }
    }
    ShowSubscriptionDetails(editions: SubscribedEditionDetailsDto[], tenantName)
    {
        this.subscriptionsModel.show(editions,tenantName);
    }
}
