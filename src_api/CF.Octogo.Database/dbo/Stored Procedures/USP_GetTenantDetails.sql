/*Created By : Karan Kumar
  Created On : 2021-12-21
  Description: To get list of Tenant whose db setup not completed

*/
CREATE Procedure [dbo].[USP_GetTenantDetails]

AS 
BEGIN

SELECT distinct t.ID,t.Name,tspl.inSetUpID,td.vcConnectionStringName,td.vcConnectionString,p.vcProductName FROM TblTrn_TenantSetupProcessLog tspl 
								  INNER JOIN AbpTenants t on t.Id = tspl.inTenantId 
								  INNER JOIN TblTrn_TenantDB td on td.inTenantID = tspl.inTenantId AND td.inProductID=tspl.inProductID
								  INNER JOIN TblMst_Product p On p.inProductID= td.inProductID  
								  WHERE ISNULL(tspl.btIsDBSetup,0) =1 AND ISNULL(tspl.btIsAppURLSetup,0) =0 AND td.inProductID=1 AND ISNULL(td.btisdefault,0)=1 and t.Id=75

SELECT * FROM TblMst_AppSetup WHERE vcSetupSource='GodaddyAPI' AND vcSetupEnvironment ='ngenOCto' AND  ISNULL(btisActive,0) =1


END