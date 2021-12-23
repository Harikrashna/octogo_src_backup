import { Component, Injector, OnInit, Input } from '@angular/core';
import { ThemesLayoutBaseComponent } from '../themes/themes-layout-base.component';
import { AbpSessionService } from 'abp-ng2-module';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    selector: 'chat-toggle-button',
    templateUrl: './chat-toggle-button.component.html'
})
export class ChatToggleButtonComponent extends ThemesLayoutBaseComponent implements OnInit {

    unreadChatMessageCount = 0;
    chatConnected = false;
    isHost = false;
    isShowChatToggler: boolean;

    @Input() customStyle = 'btn btn-icon btn-dropdown btn-clean btn-lg mr-1';

    public constructor(
        injector: Injector,
        private _abpSessionService: AbpSessionService,
        _dateTimeService: DateTimeService
    ) {
        super(injector, _dateTimeService);
    }

    ngOnInit(): void {
                // Added for Tenents Login(Hari Krashna 20/12/2021)
        // This process will changes to Setting Management
        if ((this.appSession.tenant != null && this.appSession.tenant != undefined && this.appSession.tenant.id > 0)
        || this.permission.isGranted('Pages.isdefaultRegisterUser')) {
            this.isShowChatToggler = false;
        }
        else{
            this.isShowChatToggler = true;
        }
        this.registerToEvents();
        this.isHost = !this._abpSessionService.tenantId;
    }

    registerToEvents() {
        abp.event.on('app.chat.unreadMessageCountChanged', messageCount => {
            this.unreadChatMessageCount = messageCount;
        });

        abp.event.on('app.chat.connected', () => {
            this.chatConnected = true;
        });
    }
}
