CREATE TABLE [dbo].[TblTrn_EditionDependancy] (
    [inDependancyID]       INT      IDENTITY (1, 1) NOT NULL,
    [inEditionID]          INT      NOT NULL,
    [inDependantEditionID] INT      NOT NULL,
    [btIsActive]           BIT      CONSTRAINT [DF_TblTrn_EditionDependancy_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]          DATETIME CONSTRAINT [DF_TblTrn_EditionDependancy_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]          BIGINT   NOT NULL,
    [dtModifiedOn]         DATETIME NULL,
    [inModifiedBy]         BIGINT   NULL,
    CONSTRAINT [PK_TblTrn_EditionDependancy] PRIMARY KEY CLUSTERED ([inDependancyID] ASC),
    CONSTRAINT [FK_TblTrn_EditionDependancy_AbpEditions] FOREIGN KEY ([inEditionID]) REFERENCES [dbo].[AbpEditions] ([Id]),
    CONSTRAINT [FK_TblTrn_EditionDependancy_AbpEditions1] FOREIGN KEY ([inDependantEditionID]) REFERENCES [dbo].[AbpEditions] ([Id])
);

