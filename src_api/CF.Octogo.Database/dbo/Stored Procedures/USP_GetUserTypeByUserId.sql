/*
    CREATED ON : 16 Dec 2021
    DESC : 
    DRY RUN : 
        EXEC USP_GetUserTypeByUserId 78
*/

CREATE PROCEDURE USP_GetUserTypeByUserId
(
    @UserId INT
)AS
BEGIN
    SET NOCOUNT ON;
        SELECT UT.inUserTypeID [UserTypeId], UT.vcUserTypeName [UserTypeName] 
            FROM TblTrn_UserUserTypesMapping UUT(NOLOCK)
            INNER JOIN TblMst_UserType UT(NOLOCK)
                ON UUT.inUserTypeID = UT.inUserTypeID
                AND UUT.btIsActive = 1 AND UT.btIsActive = 1
            WHERE UUT.inUserID = @UserId
END
