
/*
    CREATED ON : 24/11/2021
    CREATE BY : Vishal
    DESC : 
    DRY RUN: 
    USP_CreateOrUpdateProduct 1,'Name','',1
*/
CREATE PROCEDURE [dbo].[USP_CreateOrUpdateProduct] 
(
    @inProductID INT = null,
	@vcProductName VARCHAR(100),
	@vcDescription VARCHAR(250) = NULL,
	@UserId BIGINT
)
AS
BEGIN
    IF(ISNULL(@inProductID,0)=0)
        BEGIN
	        INSERT INTO TblMst_Product
						(
						vcProductName,
						vcDescription,
						btIsActive,
						dtCreatedOn,
						inCreatedBy
						)
						VALUES(
						@vcProductName,
						@vcDescription,
						1,
						GETDATE(),
						@UserId)
            SELECT @inProductID = SCOPE_IDENTITY();
	    END
	ELSE
		BEGIN
			UPDATE TblMst_Product SET
				vcProductName = @vcProductName ,
				vcDescription = @vcDescription ,
				dtModifiedOn = GETDATE(),
				inModifiedBy = @UserId
				WHERE inProductID = @inProductID
                AND btIsActive = 1
			
        END

    SELECT @inProductID [Id]
END