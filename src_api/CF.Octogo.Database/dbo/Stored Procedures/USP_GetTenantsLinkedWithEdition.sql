/*
*************************************************************************************
Procedure Name	:	USP_GetTenantsLinkedWithEdition 101
Purpose		    :	
Company		    :   CargoFlash InfoTech. 
Scope			:	 
Author			:	Hari Krashna
Created On		:   24 Jan 2022
Modified By (On):	
Description		:	Get All Tenants linked with given edition or Addon
*************************************************************************************
*/
CREATE PROCEDURE [dbo].[USP_GetTenantsLinkedWithEdition]
(
   @EditionId INT,
   @AddonId INT = NULL 
)
AS 
  BEGIN
   BEGIN TRY
    SET NOCOUNT ON;
        SELECT inTenantID [TenantId]
            FROM TblTrn_TenantEditionAddOnMapping (NOLOCK)
            WHERE inEditionID = @EditionId
            AND btIsActive = 1
            AND ISNULL(inAddOnID,0) = ISNULL(@AddonId, ISNULL(inAddOnID,0))
   END TRY
   BEGIN CATCH	  
		DECLARE @ERRMSG NVARCHAR(4000), @ERRSEVERITY INT
		SELECT @ERRMSG = ERROR_MESSAGE(), @ERRSEVERITY = ERROR_SEVERITY()
		RAISERROR(@ERRMSG, @ERRSEVERITY, 1)
   END CATCH
  END 