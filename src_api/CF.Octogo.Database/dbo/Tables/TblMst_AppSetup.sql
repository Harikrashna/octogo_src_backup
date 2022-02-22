CREATE TABLE [dbo].[TblMst_AppSetup] (
    [InSetupId]          INT            IDENTITY (1, 1) NOT NULL,
    [vcSetupSource]      NVARCHAR (100) NULL,
    [vcSetupEnvironment] NVARCHAR (100) NULL,
    [vcAuthorizationKey] NVARCHAR (100) NULL,
    [vcServerUrl]        NVARCHAR (100) NULL,
    [vcType]             NVARCHAR (50)  NULL,
    [vcServerData]       NVARCHAR (100) NULL,
    [InTenantId]         INT            NULL,
    [vcPublishFilePath]  NVARCHAR (100) NULL,
    [vcHostFileLocation] NVARCHAR (100) NULL,
    [vcWebsiteSufix]     NVARCHAR (50)  NULL,
    [btIsActive]         BIT            NULL,
    [dtCreatedOn]        DATETIME       CONSTRAINT [DF_TblMst_AppSetup_dtCreatedOn] DEFAULT (getdate()) NULL,
    [inCreatedBy]        INT            CONSTRAINT [DF_TblMst_AppSetup_inCreatedBy] DEFAULT ((1)) NULL,
    [dtModifiedOn]       DATETIME       CONSTRAINT [DF_TblMst_AppSetup_dtModifiedOn] DEFAULT (getdate()) NULL,
    [dtModifiedBy]       INT            NULL,
    CONSTRAINT [PK_TblMst_AppSetup] PRIMARY KEY CLUSTERED ([InSetupId] ASC)
);

