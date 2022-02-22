/*
    CREATED BY: HARI KRASHNA
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  InsertUserTypeLinking
    @UserTypeId = 2,@UserId=32,@LoginUserId=1
*/
CREATE PROCEDURE USP_InsertUserTypeMapping
(
    @UserTypeId INT,
    @UserId INT,
    @LoginUserId INT = NULL
)
AS 
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION
                SET NOCOUNT ON;
                DECLARE @Id INT;

                INSERT INTO TblTrn_UserUserTypesMapping(inUserTypeID, inUserID, btIsActive, inCreatedBy, dtCreatedOn)
                        VALUES(@UserTypeId, @UserId, 1, ISNULL(@LoginUserId,0), GETDATE())
                        
                SELECT @Id = SCOPE_IDENTITY();
                SELECT vcUserTypeName [UserType] FROM TblMst_UserType 
                    WHERE inUserTypeID = @UserTypeId

            COMMIT TRANSACTION
        END TRY
        BEGIN CATCH
            --IF @@TRANCOUNT > 0
	    	ROLLBACK
	    	DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
	    	SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
	    	RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END