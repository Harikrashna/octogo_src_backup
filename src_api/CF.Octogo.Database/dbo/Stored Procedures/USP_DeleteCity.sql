/*
*************************************************************************************
Procedure Name	:	
Purpose		    :	For City list
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Deepak
Created On		:   31/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_DeleteCity]
(
	@SNo INT,
	@UserId BIGINT
)
AS
BEGIN
    BEGIN TRY
		BEGIN TRANSACTION
	        UPDATE TblMst_City 
                SET IsActive=0,
                UpdatedOn=GETDATE(),
                UpdatedBy=@UserId 
                WHERE SNo=@SNo AND IsActive = 1
	    COMMIT TRANSACTION
	END TRY
    BEGIN CATCH
		DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
		SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
		RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
    END CATCH
END




