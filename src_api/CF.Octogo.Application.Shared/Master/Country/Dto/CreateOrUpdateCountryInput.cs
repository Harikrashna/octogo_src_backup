using System;
using System.Collections.Generic;
using System.Text;

namespace CF.Octogo.Master.Country.Dto
{
    public class CreateOrUpdateCountryInput
    {
        public Nullable<int> SNo { get; set; }
        public string CountryName { get; set; }
        public Nullable<int> CurrencySNo { get; set; }
        public string CountryCode { get; set; }
        public Nullable<int> ISDCode { get; set; }
        public string CurrencyCode { get; set; }
        public string Continent { get; set; }
        public string IATAAreaCode { get; set; }
        public string Nationality { get; set; }


    }
}
