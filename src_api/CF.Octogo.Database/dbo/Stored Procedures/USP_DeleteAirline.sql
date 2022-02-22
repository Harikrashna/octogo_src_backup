﻿/*
	CREATED BY: Manav
	CREATED ON: 07/12/2021
	DESC
*/



CREATE PROCEDURE [dbo].[USP_DeleteAirline]
	@AirlineId INT,
	@UserId BIGINT
AS
BEGIN
	BEGIN TRY
		BEGIN TRANSACTION
			UPDATE TblMst_Airline SET IsActive=0,UpdatedOn=GETDATE(), UpdatedBy=@UserId
				WHERE SNo=@AirlineId

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


