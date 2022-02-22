CREATE TABLE [dbo].[TblTrn_EditionModules] (
    [inModuleID]     INT           IDENTITY (1, 1) NOT NULL,
    [vcModuleName]   VARCHAR (100) NOT NULL,
    [vcDescription]  VARCHAR (250) NULL,
    [inEditionID]    INT           NOT NULL,
    [btIsActive]     BIT           CONSTRAINT [DF_TblTrn_EditionModules_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]    DATETIME      CONSTRAINT [DF_TblTrn_EditionModules_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]    BIGINT        NOT NULL,
    [dtModifiedOn]   DATETIME      NULL,
    [inModifiedBy]   BIGINT        NULL,
    [InPageModuleId] INT           DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_TblTrn_EditionModules] PRIMARY KEY CLUSTERED ([inModuleID] ASC),
    CONSTRAINT [FK_PageModules] FOREIGN KEY ([InPageModuleId]) REFERENCES [dbo].[TblMst_Page] ([SNo]),
    CONSTRAINT [FK_TblTrn_EditionModules_AbpEditions] FOREIGN KEY ([inEditionID]) REFERENCES [dbo].[AbpEditions] ([Id])
);

