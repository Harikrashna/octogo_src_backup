-- =============================================  
 /*  
 CREATED ON : 24-NOV-2021  
 CREATED BY:  GOURAV AHUJA  
 DESC:   
 DRY RUN :   
 [USP_CreateUpdatePricingType] @PricingTypeId int = null,  
 @TypeName varchar(50)='',  
 @NoOfDays varchar(50)=2,  
 @UserId bigint  
-- =============================================*/  
CREATE PROCEDURE [dbo].[USP_CreateUpdatePricingType]   
 (
    @PricingTypeId int = null,  
    @TypeName varchar(50),  
    @NoOfDays varchar(50),  
    @UserId bigint  
 )
AS  
  
BEGIN   
 BEGIN TRY  
   BEGIN TRANSACTION  
        IF(ISNULL(@PricingTypeId,0)=0)  
            BEGIN  
               Insert INTO TblMst_PricingType(vcTypeName,inNoOfDays,btIsActive,dtCreatedOn,inCreatedBy)   
                   VALUES(@TypeName,@NoOfDays,1,GETDATE(),@UserId)  
                SELECT @PricingTypeId = SCOPE_IDENTITY();
            END  
        ELSE  
            BEGIN  
               UPDATE TblMst_PricingType  
               SET vcTypeName=@TypeName , 
               inNoOfDays=@NoOfDays , 
               dtModifiedOn=GETDATE(), 
               inModifiedBy=@UserId 
               WHERE inPricingTypeID=@PricingTypeId  
            END  
        
        SELECT @PricingTypeId [Id]
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