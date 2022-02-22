/*
    CREATED ON : 24/11/2021
    CREATE BY : Vishal
    DESC : 
    DRY RUN: 
    USP_GetPoductId 1,
*/

CREATE PROCEDURE [dbo].[USP_GetPoductId]
(
    @ProductId INT
)
AS 
BEGIN
    SELECT inProductID, vcProductName , vcDescription 
        FROM TblMst_Product (NOLOCK) 
        WHERE inProductID = @ProductId
            AND btIsActive = 1
END
