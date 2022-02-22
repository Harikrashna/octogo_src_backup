CREATE TABLE [dbo].[AbpUsers] (
    [Id]                              BIGINT           IDENTITY (1, 1) NOT NULL,
    [AccessFailedCount]               INT              NOT NULL,
    [AuthenticationSource]            NVARCHAR (64)    NULL,
    [ConcurrencyStamp]                NVARCHAR (128)   NULL,
    [CreationTime]                    DATETIME2 (7)    NOT NULL,
    [CreatorUserId]                   BIGINT           NULL,
    [DeleterUserId]                   BIGINT           NULL,
    [DeletionTime]                    DATETIME2 (7)    NULL,
    [EmailAddress]                    NVARCHAR (256)   NOT NULL,
    [EmailConfirmationCode]           NVARCHAR (328)   NULL,
    [IsActive]                        BIT              NOT NULL,
    [IsDeleted]                       BIT              NOT NULL,
    [IsEmailConfirmed]                BIT              NOT NULL,
    [IsLockoutEnabled]                BIT              NOT NULL,
    [IsPhoneNumberConfirmed]          BIT              NOT NULL,
    [IsTwoFactorEnabled]              BIT              NOT NULL,
    [LastModificationTime]            DATETIME2 (7)    NULL,
    [LastModifierUserId]              BIGINT           NULL,
    [LockoutEndDateUtc]               DATETIME2 (7)    NULL,
    [Name]                            NVARCHAR (64)    NOT NULL,
    [NormalizedEmailAddress]          NVARCHAR (256)   NOT NULL,
    [NormalizedUserName]              NVARCHAR (256)   NOT NULL,
    [Password]                        NVARCHAR (128)   NOT NULL,
    [PasswordResetCode]               NVARCHAR (328)   NULL,
    [PhoneNumber]                     NVARCHAR (32)    NULL,
    [ProfilePictureId]                UNIQUEIDENTIFIER NULL,
    [SecurityStamp]                   NVARCHAR (128)   NULL,
    [ShouldChangePasswordOnNextLogin] BIT              NOT NULL,
    [Surname]                         NVARCHAR (64)    NOT NULL,
    [TenantId]                        INT              NULL,
    [UserName]                        NVARCHAR (256)   NOT NULL,
    [SignInToken]                     NVARCHAR (MAX)   NULL,
    [SignInTokenExpireTimeUtc]        DATETIME2 (7)    NULL,
    [GoogleAuthenticatorKey]          NVARCHAR (MAX)   NULL,
    CONSTRAINT [PK_AbpUsers] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AbpUsers_AbpUsers_CreatorUserId] FOREIGN KEY ([CreatorUserId]) REFERENCES [dbo].[AbpUsers] ([Id]),
    CONSTRAINT [FK_AbpUsers_AbpUsers_DeleterUserId] FOREIGN KEY ([DeleterUserId]) REFERENCES [dbo].[AbpUsers] ([Id]),
    CONSTRAINT [FK_AbpUsers_AbpUsers_LastModifierUserId] FOREIGN KEY ([LastModifierUserId]) REFERENCES [dbo].[AbpUsers] ([Id])
);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUsers_CreatorUserId]
    ON [dbo].[AbpUsers]([CreatorUserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUsers_DeleterUserId]
    ON [dbo].[AbpUsers]([DeleterUserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUsers_LastModifierUserId]
    ON [dbo].[AbpUsers]([LastModifierUserId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUsers_TenantId_NormalizedEmailAddress]
    ON [dbo].[AbpUsers]([TenantId] ASC, [NormalizedEmailAddress] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_AbpUsers_TenantId_NormalizedUserName]
    ON [dbo].[AbpUsers]([TenantId] ASC, [NormalizedUserName] ASC);

