CREATE TABLE [dbo].[AbpUserTokens] (
    [Id]            BIGINT         IDENTITY (1, 1) NOT NULL,
    [LoginProvider] NVARCHAR (128) NULL,
    [Name]          NVARCHAR (128) NULL,
    [TenantId]      INT            NULL,
    [UserId]        BIGINT         NOT NULL,
    [Value]         NVARCHAR (512) NULL,
    [ExpireDate]    DATETIME2 (7)  NULL,
    CONSTRAINT [PK_AbpUserTokens] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpUserTokens_AbpUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AbpUsers] ([Id]) ON DELETE CASCADE
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserTokens_TenantId_UserId]
    ON [dbo].[AbpUserTokens]([TenantId] ASC, [UserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUserTokens_UserId]
    ON [dbo].[AbpUserTokens]([UserId] ASC);

