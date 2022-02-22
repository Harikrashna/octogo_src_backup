
/*  
    CREATED ON : 12 Nov 2021  
    DESC :  This is for Pricing Type
    DRY RUN :   
                GetPricingTypes  
*/  
  
CREATE PROCEDURE GetPricingTypes
AS  
    BEGIN  
        SELECT  inPricingTypeID [Id],vcTypeName [TypeName]  ,inNoOfDays [NoOfDays]  
            FROM TblMst_PricingType (NOLOCK)  
            WHERE btIsActive = 1  

    END