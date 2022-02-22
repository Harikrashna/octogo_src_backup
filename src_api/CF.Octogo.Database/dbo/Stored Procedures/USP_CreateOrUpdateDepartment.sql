/*
	CREATE BY: Vishal
	CREATED ON: 04/12/2021
	DESC:
*/

CREATE PROCEDURE [dbo].[USP_CreateOrUpdateDepartment] 
	@inDepartmentID INT = null,
	@vcDepartmentName VARCHAR(100),
	@vcDescription VARCHAR(250),
	@UserId BIGINT
AS
BEGIN
    IF(ISNULL(@inDepartmentID,0)=0)
        BEGIN
	
	        INSERT INTO TblMst_Department
						(
						vcDepartmentName,
						vcDescription,
						btIsActive,
						dtCreatedOn,
						inCreatedBy,
						dtModifiedOn,
						inModifiedBy
						)
						VALUES
						(
						@vcDepartmentName,
						@vcDescription,
						1,
						GETDATE(),
						@UserId,
						null,
						0)
            SELECT @inDepartmentID = SCOPE_IDENTITY();
	    END
	ELSE
		BEGIN
			UPDATE TblMst_Department
				SET
				vcDepartmentName=@vcDepartmentName ,
				vcDescription=@vcDescription ,
				dtModifiedOn=GETUTCDATE(),
				inModifiedBy=@UserId
				WHERE inDepartmentID=@inDepartmentID
			
        END

    SELECT @inDepartmentID [Id]
END