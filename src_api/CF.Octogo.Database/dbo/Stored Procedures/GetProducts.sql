	/*  
    CREATED ON : 12 Nov 2021  
    DESC :  This is for Product
    DRY RUN :   
                GetProducts  
*/  
  
CREATE PROCEDURE GetProducts
AS  
    BEGIN  
        SELECT inProductID [Id], vcProductName [ProductName], vcDescription [Description]  
            FROM TblMst_Product (NOLOCK)  
            WHERE btIsActive = 1  
    END
