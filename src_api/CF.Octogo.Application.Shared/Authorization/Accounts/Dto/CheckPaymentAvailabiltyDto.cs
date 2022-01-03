using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Authorization.Accounts.Dto
{
        public class CheckPaymentAvailabiltyDto
        {
            public TenantAvailabilityState State { get; set; }

            public TenantPyamenteSateAndAvailability States { get; set; }

            public int? TenantId { get; set; }

            public string ServerRootAddress { get; set; }
            public int? EdiEditionId { get; set; }


            public CheckPaymentAvailabiltyDto(TenantPyamenteSateAndAvailability state)
            {
                States = state;

            }
            public CheckPaymentAvailabiltyDto(TenantPyamenteSateAndAvailability state, int? tenantId, string serverRootAddress)
            {
                States = state;
                TenantId = tenantId;
                ServerRootAddress = serverRootAddress;

            }


            public CheckPaymentAvailabiltyDto(TenantPyamenteSateAndAvailability state, int? tenantId, string serverRootAddress, int? editionId)
            {
                States = state;
                TenantId = tenantId;
                ServerRootAddress = serverRootAddress;
                EdiEditionId = editionId;
            }
    }
}
