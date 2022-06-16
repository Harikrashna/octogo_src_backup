import { CreateOrEditAwbCostApproachComponent } from './../create-or-edit-awb-cost-approach/create-or-edit-awb-cost-approach.component';
import { Component, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Paginator } from 'primeng/paginator';
import { finalize } from 'rxjs/operators';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { AwbCostApproachServiceProxy } from '@shared/service-proxies/service-proxies';
import { PermissionTreeModalComponent } from '@app/admin/shared/permission-tree-modal.component';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-awb-cost-approach',
  templateUrl: './awb-cost-approach.component.html',
  styleUrls: ['./awb-cost-approach.component.css'],
  animations: [appModuleAnimation()]
})
export class AwbCostApproachComponent extends AppComponentBase implements AfterViewInit {

  @ViewChild('createOrEditAwbCostApproach', { static: true }) createOrEditAwbCostApproach: CreateOrEditAwbCostApproachComponent;
  @ViewChild('createOrEditAwbCostApproach', { static: true }) modal: ModalDirective;
  @ViewChild('permissionFilterTreeModal', { static: true }) permissionFilterTreeModal: PermissionTreeModalComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;

  perAWBCostApproach: any;
  filterText = '';
  constructor(injector: Injector, private _awbcostapproachservice: AwbCostApproachServiceProxy, private _modalService: BsModalService, private _activatedRoute: ActivatedRoute) {
    super(injector);
    this.filterText = this._activatedRoute.snapshot.queryParams['filterText'] || '';
  }
  ngAfterViewInit(): void {
    this.GetPerAWBCostApproachList();
  }
  createApproach(): void {
    this.createOrEditAwbCostApproach.show();
  }
  GetPerAWBCostApproachList(event?: LazyLoadEvent, isSubmit:boolean = false) {
    if(isSubmit == true){
      this.filterText = "";
     }
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();
    this._awbcostapproachservice.getPerAWBCostApproach(
      this.primengTableHelper.getMaxResultCount(this.paginator, event),
      this.primengTableHelper.getSkipCount(this.paginator, event),
      this.primengTableHelper.getSorting(this.dataTable),
      this.filterText
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this.primengTableHelper.records=result.items
      this.primengTableHelper.totalRecordsCount = result.totalCount;
      this.perAWBCostApproach=result.items;
      this.primengTableHelper.hideLoadingIndicator();   
    });
  }

  deleteAwbCostApproach(AwbCostApproach) {
    this.message.confirm(
      this.l('AwbCostApproachDeleteWarningMessage', AwbCostApproach.vcApproachName),
      this.l('AreYouSure'),
      isConfirmed => {
        if (isConfirmed) {
          this._awbcostapproachservice.deleteAwbCostApproach(AwbCostApproach.inApproachID).subscribe(() => {
              abp.notify.info(this.l('SuccessfullyDeleted'));
            this.GetPerAWBCostApproachList();
          });
        }
      }
    )
  }

  

}
