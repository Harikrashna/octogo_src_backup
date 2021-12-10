import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AddonServiceProxy, GetAddonInput, PagedResultDtoOfAddonListDto } from '@shared/service-proxies/service-proxies';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { InsertUpdateAddonsComponent } from '../insert-update-addons/insert-update-addons.component';

@Component({
  selector: 'app-addonslist',
  templateUrl: './addonslist.component.html',
  styleUrls: ['./addonslist.component.css'],
  animations: [appModuleAnimation()]
})
export class AddonslistComponent extends AppComponentBase implements OnInit {
  
  @ViewChild('insertUpdateAddon', {static: true}) insertUpdateAddonModel: InsertUpdateAddonsComponent;
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  filterText;
  constructor(injector: Injector, private addonServiceProxy: AddonServiceProxy) {
    super(injector);
   }

  ngOnInit(): void {
  }
  CreateNewAddon(){
    this.insertUpdateAddonModel.show();
  }
  GetAddons(event?){
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
  }
  this.primengTableHelper.showLoadingIndicator();
  this.addonServiceProxy.getAddonList(new GetAddonInput({
      filter: this.filterText,
      sorting: this.primengTableHelper.getSorting(this.dataTable),
      maxResultCount: this.primengTableHelper.getMaxResultCount(this.paginator, event),
      skipCount: this.primengTableHelper.getSkipCount(this.paginator, event)
  })
  ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
      this.primengTableHelper.totalRecordsCount = result.totalCount;
      this.primengTableHelper.records = result.items;
      this.primengTableHelper.hideLoadingIndicator();
  });
  }
  EditAddon(row){
    this.insertUpdateAddonModel.isEdit = true;
    this.insertUpdateAddonModel.show(row);
  }
  DeleteAddon(row){
    this.message.confirm(
      this.l('AddonDeleteWarningMsg', row.forEditionName),
      this.l('AreYouSure'),
      isConfirmed => {
          if (isConfirmed) {
              // this._editionService.deleteEdition(edition.id).subscribe(() => {
                  this.GetAddons();
                  this.notify.success(this.l('SuccessfullyDeleted'));
              // });
          }
      }
  );
  }
}
