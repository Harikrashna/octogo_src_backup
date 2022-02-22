-- =============================================  
 /*  
 CREATED ON : 24-NOV-2021  
 CREATED BY:  GOURAV AHUJA  
 DESC:   
 DRY RUN :   
 [USP_CheckDuplicacyRecord] @PricingTypeId int = null,  
 @TypeName varchar(50)='',  
 @NoOfDays varchar(50)=2,  
 @UserId bigint  
-- =============================================*/  
CREATE PROCEDURE [dbo].[USP_CheckDuplicacyRecord]  
(  
    @PricingTypeId int = null,  
    @TypeName varchar(50),  
    @NoOfDays varchar(50)  
)     
AS  
BEGIN  
        SELECT inPricingTypeId, vcTypeName, inNoOfDays 
            FROM tblmst_PricingType 
            WHERE (vcTypeName=@TypeName OR inNoOfDays=@NoOfDays) 
            AND btIsActive=1  
            AND inPricingTypeId <> ISNULL(@PricingTypeId,0)
END

