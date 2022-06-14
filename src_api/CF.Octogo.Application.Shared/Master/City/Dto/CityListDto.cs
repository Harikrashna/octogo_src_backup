using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.City.Dto
{
    public class CityListDto
    {
        public int SNo { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public string StateName { get; set; }
        public string CountryName { get; set; }
        public Nullable<bool> PriorApproval { get; set; }
        public Nullable<bool> IsDayLightSaving { get; set; }
        public bool IsActive { get; set; }
    }
    public class CityListRet
    {
        public int SNo { get; set; }
        public string CityCode { get; set; }
        public string CityName { get; set; }
        public string StateName { get; set; }
        public string CountryName { get; set; }
        public Nullable<bool> PriorApproval { get; set; }
        public Nullable<bool> IsDayLightSaving { get; set; }
        public bool IsActive { get; set; }
        public int TotalCount { get; set; }

    }
    public class GetEditCityInput
    {
        public int SNo { get; set; }
    }

}
