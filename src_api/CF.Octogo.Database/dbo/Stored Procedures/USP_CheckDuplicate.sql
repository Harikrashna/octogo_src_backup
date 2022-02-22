/*
    CREATED BY: Vishal
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  
*/

CREATE PROCEDURE [dbo].[USP_CheckDuplicate]
	@UserTypeID int = null,
	@UserTypeName varchar(50),
	@Description varchar(50)
AS
BEGIN
		BEGIN TRY
					BEGIN TRANSACTION

						IF(ISNULL(@UserTypeID,0)=0)
							BEGIN
								
								SELECT * FROM
								TblMst_UserType
								where
								(vcUserTypeName=@UserTypeName
								OR
								vcDescription=@Description) 
								AND
								btIsActive=1
							END

						ELSE
							BEGIN
								SELECT * FROM
								TblMst_UserType 
								WHERE 
								(vcUserTypeName=@UserTypeName
								OR
								vcDescription=@Description)
								AND 
								(inUserTypeID!=@UserTypeID) 
								AND
								(btIsActive=1)
							END

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
