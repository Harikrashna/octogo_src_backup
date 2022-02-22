

/*
*************************************************************************************
Procedure Name	:	[USP_GetProductWiseEditions]
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Merajuddin khan
Created On		:   06/02/2022
Modified By (On):	
Description		:	
*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_GetProductWiseEditions]

AS
    BEGIN
        BEGIN TRY
          SELECT inProductId [ProductId], vcProductName [ProductName],
	          (
                 SELECT DISTINCT E.Id, E.DisplayName [EditionName]
                          FROM AbpEditions E(NOLOCK)
                          INNER JOIN TblTrn_ProductEditionMapping PEM(NOLOCK)
                              ON E.Id = PEM.inEditionId and PEM.btIsActive =1 
              			WHERE PEM.inProductID = P.inProductID
              			FOR JSON PATH
              ) Editions
		 FROM TblMst_Product P(NOLOCK)
			WHERE btIsActive = 1
			ORDER BY vcProductName
        END TRY
	    BEGIN CATCH
	        DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
    	    SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
    	    RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
        END CATCH
    END
