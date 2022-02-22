CREATE PROCEDURE [dbo].[USP_GetUpdateEmailSendForRegsiterTenant]
(
   @IntenantId INT = NULL
)
AS
    BEGIN
        BEGIN TRY
		IF(ISNULL(@IntenantId,0) = 0)
		SELECT inTenantID [TenantId] FROM TblTrn_TenantSetupProcessLog WHERE
	        btIsDBSetup =1 AND
	        btIsAppURLSetup = 1 AND
	        btIsSetupProcessComplete =1 AND 
	        btIsActive=1 AND 
	        ISNULL(btIsEmailSend,0)= 0
	    ELSE
	         UPDATE TblTrn_TenantSetupProcessLog
	         SET btIsEmailSend = 1 
	         WHERE inTenantID = @IntenantId
          
        END TRY
	    BEGIN CATCH
	        DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END
