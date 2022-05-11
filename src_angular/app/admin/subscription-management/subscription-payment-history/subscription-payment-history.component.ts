import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateInvoiceDto, InvoiceServiceProxy, PaymentServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-subscription-payment-history',
  templateUrl: './subscription-payment-history.component.html',
  styleUrls: ['./subscription-payment-history.component.css']
})
export class SubscriptionPaymentHistoryComponent  extends AppComponentBase implements OnInit {

  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @Input() TenantId = 0;
  constructor(injector: Injector,private _paymentServiceProxy: PaymentServiceProxy,private _invoiceServiceProxy: InvoiceServiceProxy) {
    super(injector);
   }

  ngOnInit(): void {
  }
  getPaymentHistory(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
        this.paginator.changePage(0);

        return;
    }

    this.primengTableHelper.showLoadingIndicator();

    this._paymentServiceProxy.getPaymentHistoryNew(
        this.primengTableHelper.getSorting(this.dataTable),
        this.primengTableHelper.getMaxResultCount(this.paginator, event),
        this.primengTableHelper.getSkipCount(this.paginator, event),
        this.TenantId
    ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
        this.primengTableHelper.totalRecordsCount = result.totalCount;
        this.primengTableHelper.records = result.items;
        this.primengTableHelper.hideLoadingIndicator();
    });
}
createOrShowInvoice(paymentId: number, invoiceNo: string): void {
  if (invoiceNo) {
      window.open('/app/admin/invoice/' + paymentId, '_blank');
  } else {
      this._invoiceServiceProxy.createInvoice(new CreateInvoiceDto({ subscriptionPaymentId: paymentId })).subscribe(() => {
          this.getPaymentHistory();
          window.open('/app/admin/invoice/' + paymentId, '_blank');
      });
  }
}
}
