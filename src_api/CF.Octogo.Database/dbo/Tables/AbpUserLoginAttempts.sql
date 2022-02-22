CREATE TABLE [dbo].[AbpUserLoginAttempts] (
    [Id]                     BIGINT         IDENTITY (1, 1) NOT NULL,
    [BrowserInfo]            NVARCHAR (512) NULL,
    [ClientIpAddress]        NVARCHAR (64)  NULL,
    [ClientName]             NVARCHAR (128) NULL,
    [CreationTime]           DATETIME2 (7)  NOT NULL,
    [Result]                 TINYINT        NOT NULL,
    [TenancyName]            NVARCHAR (64)  NULL,
    [TenantId]               INT            NULL,
    [UserId]                 BIGINT         NULL,
    [UserNameOrEmailAddress] NVARCHAR (256) NULL,
    CONSTRAINT [PK_AbpUserLoginAttempts] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserLoginAttempts_TenancyName_UserNameOrEmailAddress_Result]
    ON [dbo].[AbpUserLoginAttempts]([TenancyName] ASC, [UserNameOrEmailAddress] ASC, [Result] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserLoginAttempts_UserId_TenantId]
    ON [dbo].[AbpUserLoginAttempts]([UserId] ASC, [TenantId] ASC);

