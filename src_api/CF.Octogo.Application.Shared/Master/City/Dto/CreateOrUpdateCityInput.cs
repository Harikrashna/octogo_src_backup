using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.City.Dto
{
    public class CreateOrUpdateCityInput
    {
        public Nullable<int> SNo { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public Nullable<int> StateSNo { get; set; }
        public string StateName { get; set; }
        public int CountrySNo { get; set; }
        public string CountryCode { get; set; }
        public string CountryName { get; set; }
        public bool IsActive { get; set; }
        public bool PriorApproval { get; set; }
        public int TimeZoneSNo { get; set; }
        public Nullable<int> ZoneSNo { get; set; }
        public string ZoneName { get; set; }
        public Nullable<int> IataAreaCode { get; set; }
        public Nullable<int> ShcSNo { get; set; }
        public Nullable<int> DgClassSNo { get; set; }
        public bool IsDayLightSaving { get; set; }

    }
}
