/*
*************************************************************************************
Procedure Name	:	USP_EditionNameAndProductByUserId 311 
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Merajuddin
Created On		:   24 Jan 2022
Modified By (On):	
Description		:	
*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_EditionNameAndProductByUserId]
(
    @UserId INT
)AS
BEGIN
    SET NOCOUNT ON;
    SELECT DISTINCT PEM.inProductID [ProductId], product.vcProductName ProductName,
        TSP.vcAppURL [ProductUrl], AE.ID [EditionId],AE.DisplayName [EditionName],ListModule=null
	  FROM AbpUsers AU(NOLOCK)
	  INNER JOIN AbpTenants AS ATTS(NOLOCK) 
	      ON ATTS.Id=AU.TenantId 
	      AND AU.IsDeleted = 0 AND AU.IsActive = 1
		  AND ATTS.IsActive = 1 AND ATTS.IsDeleted=0
	  INNER JOIN AbpEditions AE(NOLOCK)
		  ON ATTS.EditionId=AE.ID
		  AND AE.IsDeleted = 0 
	  INNER JOIN TblTrn_ProductEditionMapping As PEM(NOLOCK)
		  ON PEM.inEditionID=AE.Id 
		  AND PEM.btIsActive=1
	  INNER JOIN  TblMst_Product AS product(NOLOCK)
		  ON product.inProductID= PEM.inProductID
		  AND product.btIsActive=1
	  LEFT JOIN TblTrn_TenantSetupProcessLog AS TSP(NOLOCK)
	      ON TSP.inTenantID=AU.TenantId 
          AND TSP.inProductID = product.inProductID
	      AND TSP.btIsActive=1
	  WHERE AU.ID=@UserId
END