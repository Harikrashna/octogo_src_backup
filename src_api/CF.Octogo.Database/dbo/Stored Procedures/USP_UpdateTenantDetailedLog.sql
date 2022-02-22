Create Procedure [dbo].[USP_UpdateTenantDetailedLog]
@inSetUpID bigint,
@ErrorMessage nvarchar(MAX)

AS 
BEGIN

INSERT INTO TblTrn_TenantSetupProcessDetailedLog(insetupID,vcLogMessage,dtCreatedOn,inCreatedBy)
values(@inSetUpID,@ErrorMessage,GETUTCDATE(),1)

SELECT 0;
END