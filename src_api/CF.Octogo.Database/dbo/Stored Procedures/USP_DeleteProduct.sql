/*
    CREATED ON : 24/11/2021
    CREATE BY : Vishal
    DESC : 
    DRY RUN: 
    USP_DeleteProduct 1,
*/
CREATE PROCEDURE [dbo].[USP_DeleteProduct]
	@ProductId INT,
    @UserId BIGINT
AS
BEGIN
	BEGIN TRY
	    BEGIN TRANSACTION
	        UPDATE TblMst_Product SET
                btIsActive=0,
                dtModifiedOn = GETDATE(),
                inModifiedBy = @UserId 
                WHERE inProductID = @ProductId

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