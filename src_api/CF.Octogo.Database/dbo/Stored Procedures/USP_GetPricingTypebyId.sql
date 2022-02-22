-- =============================================  
 /*  
 CREATED ON : 24-NOV-2021  
 CREATED BY:  GOURAV AHUJA  
 DESC:   
 DRY RUN :   
 [USP_GetPricingTypeById] @PricingTypeId int = ,  
   
-- =============================================*/  
CREATE procedure [dbo].[USP_GetPricingTypebyId]  
(  
    @PricingTypeId int  
)  
AS   
    BEGIN  
          SELECT inPricingTypeID, vcTypeName , inNoOfDays 
            FROM TblMst_PricingType (NOLOCK) 
            WHERE inPricingTypeID = @PricingTypeId 
                AND btIsActive = 1 
    END