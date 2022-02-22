

/*  
*************************************************************************************  
Procedure Name : USP_UpdateTenantSetupProcess   
Purpose      : Use to update TblTrn_TenantSetupProcessLog table data after Admin user data pushed to new Database  
Company      :   CargoFlash InfoTech.   
Scope   :   
Author   : Hari Krashna  
Created On  :   21 Jan 2022  
Modified By (On):   
Description  :   
  
*************************************************************************************  
*/  
CREATE PROCEDURE USP_UpdateTenantSetupProcess  
(  
    @SetupId BIGINT,  
    @AdminCreationCompleted BIT = NULL,
	@EmailSendFlag varchar(20) = NULL
)  
AS  
BEGIN  
    BEGIN TRY  
        BEGIN TRANSACTION   
            SET NOCOUNT ON;  
             IF(@EmailSendFlag = 'EmailSended')
			 BEGIN  
                    UPDATE TblTrn_TenantSetupProcessLog   
                        SET btIsEmailSend = 1,  
                            dtEmailSend = GETDATE()  
                        WHERE inSetupId = @SetupId   
                END  

             IF(@AdminCreationCompleted = 1 )  
                BEGIN  
                    UPDATE TblTrn_TenantSetupProcessLog   
                        SET btAdminCreationCompleted = 1,  
                            dtModifiedOn = GETDATE()  
                        WHERE inSetupId = @SetupId   
                END  

        COMMIT TRANSACTION  
		SELECT 0;  
    END TRY  
    BEGIN CATCH  
                --IF @@TRANCOUNT > 0  
    ROLLBACK  
      
    DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT  
    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()  
  
    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)  
    END CATCH  
END
 
