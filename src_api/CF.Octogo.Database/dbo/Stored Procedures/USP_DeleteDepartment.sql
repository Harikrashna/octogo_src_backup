﻿/*
	CREATE BY: Vishal
	CREATED ON: 04/12/2021
	DESC:
*/

CREATE PROCEDURE [dbo].[USP_DeleteDepartment]
	@DepartmentId INT,
	@UserId BIGINT
AS
BEGIN
	BEGIN TRY
	BEGIN TRANSACTION
	update TblMst_Department set btIsActive=0,dtModifiedOn=GETDATE(), inModifiedBy=@UserId where inDepartmentID=@DepartmentId

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
