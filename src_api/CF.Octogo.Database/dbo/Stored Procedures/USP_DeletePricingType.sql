-- =============================================  
 /*  
 CREATED ON : 24-NOV-2021  
 CREATED BY:  GOURAV AHUJA  
 DESC:   
 DRY RUN :   
 [USP_DeletePricingType] @PricingTypeId=,  
   
 @UserId bigint  
-- =============================================*/  
  
CREATE PROCEDURE [dbo].[USP_DeletePricingType]  
(  
    @PricingTypeId int,  
    @UserId int  
)  
AS  
BEGIN  
 BEGIN TRY  
   BEGIN TRANSACTION  
         UPDATE TblMst_PricingType 
            SET btIsActive = 0 ,
            dtModifiedOn = GETDATE(), 
            inModifiedBy = @UserId  
            WHERE inPricingTypeID=@PricingTypeId  
  
   COMMIT TRANSACTION  
 END TRY  
     BEGIN CATCH  
       IF @@TRANCOUNT>0  
       ROLLBACK  
       DECLARE @ERRMSG NVARCHAR(4000) , @ERRSEVERITY INT  
       SELECT @ERRMSG = ERROR_MESSAGE() ,@ERRSEVERITY=ERROR_SEVERITY()  
  
       RAISERROR(@ERRMSG, @ERRSEVERITY , 1)  
     END CATCH  
  
END  