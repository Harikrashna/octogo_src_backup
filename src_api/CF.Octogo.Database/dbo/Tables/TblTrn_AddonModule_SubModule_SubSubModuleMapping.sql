CREATE TABLE [dbo].[TblTrn_AddonModule_SubModule_SubSubModuleMapping] (
    [inModuleMappingID] INT           IDENTITY (1, 1) NOT NULL,
    [inAddonId]         INT           NOT NULL,
    [inModuleId]        INT           NOT NULL,
    [inParentModuleId]  INT           NULL,
    [btIsActive]        BIT           DEFAULT ((1)) NULL,
    [dtCreatedOn]       DATETIME      DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]       BIGINT        NOT NULL,
    [dtModifiedOn]      DATETIME      NULL,
    [inModifiedBy]      BIGINT        NULL,
    [vcModuleName]      VARCHAR (100) NOT NULL,
    PRIMARY KEY CLUSTERED ([inModuleMappingID] ASC),
    FOREIGN KEY ([inAddonId]) REFERENCES [dbo].[TblTrn_AddOn] ([inAddOnID]),
    FOREIGN KEY ([inCreatedBy]) REFERENCES [dbo].[AbpUsers] ([Id]),
    FOREIGN KEY ([inModifiedBy]) REFERENCES [dbo].[AbpUsers] ([Id]),
    FOREIGN KEY ([inModuleId]) REFERENCES [dbo].[TblMst_Page] ([SNo]),
    FOREIGN KEY ([inParentModuleId]) REFERENCES [dbo].[TblTrn_AddonModule_SubModule_SubSubModuleMapping] ([inModuleMappingID])
);

