/*
    CREATED ON : 24/11/2021
    CREATE BY : Vishal
    DESC : 
    DRY RUN: 
    USP_CheckDuplicateProduct 1,'name'
*/
CREATE PROCEDURE [dbo].[USP_CheckDuplicateProduct]
(
	@ProductID int = null,
	@ProductName varchar(50)
)
AS
    BEGIN
	    SELECT inProductId, vcProductName, vcDescription 
            FROM TblMst_Product 
            WHERE btIsActive=1
                AND vcProductName=@ProductName 
                AND inProductID <> ISNULL(@ProductID,0)
    END
