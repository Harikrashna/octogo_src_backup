Create   Procedure OctogenAutoDBCreate_GetList
AS
Select TenancyName, vcProductName 
From (
SELECT t.ID,t.TenancyName,tspl.inSetUpID,p.vcProductName FROM TblTrn_TenantSetupProcessLog tspl  
  INNER JOIN AbpTenants t on t.Id = tspl.inTenantId  
  INNER JOIN TblMst_Product p On p.inProductID= tspl.inProductID
  WHERE ISNULL(tspl.dtDBSetupComplete,0) = 0 AND ISNULL(tspl.dtAPPURLSetupComplete,0) = 0 AND p.inProductID=1 ) A
