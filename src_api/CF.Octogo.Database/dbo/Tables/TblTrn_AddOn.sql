CREATE TABLE [dbo].[TblTrn_AddOn] (
    [inAddOnID]      INT           IDENTITY (1, 1) NOT NULL,
    [inEditionID]    INT           NOT NULL,
    [btIsStandAlone] BIT           CONSTRAINT [DF_TblTrn_AddOn_btIsStandAlone] DEFAULT ((0)) NOT NULL,
    [btIsActive]     BIT           CONSTRAINT [DF_TblTrn_AddOn_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]    DATETIME      CONSTRAINT [DF_TblTrn_AddOn_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]    BIGINT        NOT NULL,
    [dtModifiedOn]   DATETIME      NULL,
    [inModifiedBy]   BIGINT        NULL,
    [vcAddOnName]    VARCHAR (100) NOT NULL,
    [vcDescription]  VARCHAR (250) NULL,
    CONSTRAINT [PK_TblTrn_AddOn] PRIMARY KEY CLUSTERED ([inAddOnID] ASC),
    CONSTRAINT [FK_TblTrn_AddOn_AbpEditions] FOREIGN KEY ([inEditionID]) REFERENCES [dbo].[AbpEditions] ([Id])
);

