CREATE TABLE [dbo].[TblTrn_SubModules] (
    [inSubModuleID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcSubModuleName] VARCHAR (100) NOT NULL,
    [vcDescription]   VARCHAR (250) NULL,
    [inModuleID]      INT           NOT NULL,
    [InParantID]      INT           NULL,
    [btIsActive]      BIT           CONSTRAINT [DF_TblTrn_SubModules_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]     DATETIME      CONSTRAINT [DF_TblTrn_SubModules_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]     BIGINT        NOT NULL,
    [dtModifiedOn]    DATETIME      NULL,
    [inModifiedBy]    BIGINT        NULL,
    [InPageModuleId]  INT           DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_TblTrn_SubModules] PRIMARY KEY CLUSTERED ([inSubModuleID] ASC),
    CONSTRAINT [FK_PageSubModules] FOREIGN KEY ([InPageModuleId]) REFERENCES [dbo].[TblMst_Page] ([SNo]),
    CONSTRAINT [FK_TblTrn_SubModules_TblTrn_EditionModules] FOREIGN KEY ([inModuleID]) REFERENCES [dbo].[TblTrn_EditionModules] ([inModuleID]),
    CONSTRAINT [FK_TblTrn_SubModules_TblTrn_SubModules] FOREIGN KEY ([InParantID]) REFERENCES [dbo].[TblTrn_SubModules] ([inSubModuleID])
);

