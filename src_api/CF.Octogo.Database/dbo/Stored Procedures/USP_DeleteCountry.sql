/*
*************************************************************************************
Procedure Name	:	USP_DeleteCountry
Purpose		    :	For Country list
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:   Vishal Dogra
Created On		:   28/12/2021
Modified By (On):	
Description		:	

*************************************************************************************
*/

CREATE PROCEDURE [dbo].[USP_DeleteCountry]
(	
	@SNo INT,
	@UserId BIGINT
)
AS
BEGIN
	BEGIN TRY
		BEGIN TRANSACTION
			UPDATE TblMst_Country 
				SET IsActive=0, UpdatedOn=GETDATE(), UpdatedBy=@UserId
				WHERE SNo=@SNo AND IsActive = 1
		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
	IF @@TRANCOUNT > 0
	ROLLBACK
	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY= ERROR_SEVERITY()

	RAISERROR(@ERRMSG, @ERRSEVERITY,1)
	END CATCH
END
