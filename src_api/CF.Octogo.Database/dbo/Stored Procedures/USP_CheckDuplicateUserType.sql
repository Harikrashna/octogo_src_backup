/*
    CREATED BY: Vishal
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  USP_CheckDuplicateUserType

*/

CREATE PROCEDURE [dbo].[USP_CheckDuplicateUserType]
(
    @UserTypeID int = null,
	@UserTypeName varchar(50)
)AS 
BEGIN 
    SET NOCOUNT ON;
    	SELECT  vcUserTypeName , vcDescription 
            FROM TblMst_UserType(NOLOCK)
            WHERE vcUserTypeName = @UserTypeName 
            AND btIsActive=1 
			AND inUserTypeID <> ISNULL(@UserTypeID,0) 		
END