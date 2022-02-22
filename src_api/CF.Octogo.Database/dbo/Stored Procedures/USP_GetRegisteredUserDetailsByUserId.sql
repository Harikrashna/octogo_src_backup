/*
    CREATED ON : 16 Dec 2021
    DESC : 
    DRY RUN : 
        EXEC USP_GetRegisteredUserDetailsByUserId 116
*/

CREATE PROCEDURE USP_GetRegisteredUserDetailsByUserId
(
    @UserId BIGINT
)AS
BEGIN
    SET NOCOUNT ON;
        SELECT UD.inUserDetailsID [UserDetailId],UT.inUserTypeID [UserTypeId], UT.vcUserTypeName [UserTypeName] 
            FROM TblTrn_UserDetails UD(NOLOCK)
            INNER JOIN TblMst_UserType UT(NOLOCK)
                ON UD.inUserTypeID = UT.inUserTypeID
                AND UD.btIsActive = 1 AND UT.btIsActive = 1
            WHERE UD.inUserID = @UserId
END
