/*
    CREATED BY: Vishal
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  
*/

CREATE PROCEDURE [dbo].[USP_CreateOrUpdateUserType] 
	@inUserTypeID INT = null,
	@vcUserTypeName VARCHAR(100),
	@vcDescription VARCHAR(250)=NULL,
	@UserId BIGINT
AS
BEGIN
    IF(ISNULL(@inUserTypeID,0)=0)
        BEGIN
	
	        INSERT INTO TblMst_UserType
						(
						vcUserTypeName,
						vcDescription,
						btIsActive,
						dtCreatedOn,
						inCreatedBy
						)
						VALUES
						(
						@vcUserTypeName,
						@vcDescription,
						1,
						GETDATE(),
						@UserId
                        )
            SELECT @inUserTypeID =SCOPE_IDENTITY();
	    END
	ELSE
		BEGIN
				UPDATE TblMst_UserType
				SET
				vcUserTypeName=@vcUserTypeName ,
				vcDescription=@vcDescription ,
				dtModifiedOn=GETUTCDATE(),
				inModifiedBy=@UserId
				WHERE inUserTypeID=@inUserTypeID
                AND btIsActive = 1
			
        END
    SELECT @inUserTypeID [Id]
END