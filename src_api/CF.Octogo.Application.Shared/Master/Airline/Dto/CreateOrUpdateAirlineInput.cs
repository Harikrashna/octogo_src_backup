using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Airline.Dto
{
    public class CreateOrUpdateAirlineInput
    {
        public Nullable<int> inAirlineID { get; set; }
        public string vcAWBPrifix { get; set; }
        public string vcCarrierCode { get; set; }

        public string vcAirlineName { get; set; }

        public string vcICAOCode { get; set; }
        public string vcCountryName { get; set; }
        public string vcAirport { get; set; }
        public string vcRegisteredAddress { get; set; }
        public string vcContactPerson { get; set; }

        public string vcMobileNo { get; set; }
        public string vcPhoneNo { get; set; }
        public string vcFaxNo { get; set; }


        public bool isCheckModulus7 { get; set; }

        public string vcAWBDuplicacy { get; set; }
        public string vcHandlingInformation { get; set; }
        public bool isInterline { get; set; }
        public string vcAirlineWebsite { get; set; }
        public bool isInvoiceGeneration { get; set; }
        public bool isCCShipment { get; set; }
        public bool isPartShipment { get; set; }
        public bool isFSUTime { get; set; }
        public bool isIncludeInFFM { get; set; }
        public string vcCIMPGrossWeight { get; set; }
        public string vcCIMPCBM { get; set; }
        public bool isActive { get; set; }
        public string vcAirlineLogo { get; set; }
        public string vcAWBLogo { get; set; }

    }
}
