/*
    CREATED BY: Vishal
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  
*/ 

CREATE PROCEDURE [dbo].[USP_GetUserTypeById]
@UserTypeId int
AS
BEGIN
	SELECT 
	inUserTypeID,
	vcUserTypeName,
	vcDescription
	from 
	TblMst_UserType (NOLOCK)
	WHERE
	inUserTypeID = @UserTypeId AND btIsActive = 1
end
