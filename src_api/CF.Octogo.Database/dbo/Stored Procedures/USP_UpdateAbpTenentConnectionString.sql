Create Procedure [dbo].[USP_UpdateAbpTenentConnectionString]
@Id bigint,
@ConnectionString nvarchar(100)
AS 
BEGIN
UPDATE AbpTenants SET ConnectionString =@ConnectionString where Id=@Id
SELECT 0;
END