using System;

namespace CF.Octogo.Product.Dto
{

    public class ProductListDto
    {
        public int inProductID { get; set; }
        public string vcProductName { get; set; }
        public string vcDescription { get; set; }
    }
    public class CreateOrUpdateProductInput
    {
        public Nullable<int> inProductID { get; set; }
        public string vcProductName { get; set; }
        public string vcDescription { get; set; }
    }
    public class GetEditProductinput
    {
        public int inProductID { get; set; }
    }
}
