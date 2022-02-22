CREATE Procedure [dbo].[USP_UpdateAbpTenentStatus]
@inSetUpID bigint,
@Status nvarchar(100),
@WebsiteName nvarchar(200)
AS 
BEGIN

IF(@Status ='dtAppURLSetupComplete')
BEGIN
UPDATE TblTrn_TenantSetupProcessLog SET btIsAppURLSetup=1, dtAppURLSetupComplete=GETUTCDATE() WHERE ISNULL(inSetUPID,0)=@inSetUpID

END
ELSE IF(@Status ='dtApplicationHostCompleted')
BEGIN
UPDATE TblTrn_TenantSetupProcessLog SET btIsApplicationHost=1, dtApplicationHostCompleted=GETUTCDATE() WHERE ISNULL(inSetUPID,0)=@inSetUpID

END
ELSE IF(@Status ='dtWSSetupComplete')
BEGIN
UPDATE TblTrn_TenantSetupProcessLog SET btIsWSSetup=1, dtWSSetupComplete=GETUTCDATE(),btIsAPIURLSetup=1,dtAPIURLSetupComplete=GETUTCDATE(),
vcAPIURL='NA' WHERE ISNULL(inSetUPID,0)=@inSetUpID

END 
ELSE IF(@Status ='btIsSetupProcessComplete')
BEGIN
set @WebsiteName= 'https://'+@WebsiteName+'/Account/Login.cshtml?t=';
UPDATE TblTrn_TenantSetupProcessLog SET btIsSetupProcessComplete=1,dtModifiedBy=1,dtModifiedOn = GETUTCDATE(),vcAppURL=@WebsiteName WHERE ISNULL(inSetUPID,0)=@inSetUpID

END

SELECT 0;
END