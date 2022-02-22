/*
    CREATED BY: Vishal
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  USP_CreateOrUpdateService @vcServiceName='Airline Solutions',@UserId=0

*/

CREATE PROCEDURE [dbo].[USP_CreateOrUpdateService] 
	@inServiceID INT = null,
	@vcServiceName VARCHAR(100),
	@vcDescription VARCHAR(250) = NULL,
	@UserId BIGINT
AS
BEGIN
    IF(ISNULL(@inServiceID,0)=0)
        BEGIN
	        INSERT INTO TblMst_Services
						(
						vcServiceName,
						vcDescription,
						btIsActive,
						dtCreatedOn,
						inCreatedBy
						)
						VALUES
						(
						@vcServiceName,
						ISNULL(@vcDescription,''),
						1,
						GETDATE(),
						@UserId
                        )
            SELECT @inServiceID = SCOPE_IDENTITY();
	    END
	    ELSE
		    BEGIN
				UPDATE TblMst_Services
				SET
				vcServiceName=@vcServiceName ,
				vcDescription=@vcDescription ,
				dtModifiedOn=GETUTCDATE(),
				inModifiedBy=@UserId
				WHERE inServiceID=@inServiceID
				AND btIsActive = 1
            END
        SELECT @inServiceID [Id]		
END