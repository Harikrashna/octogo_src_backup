CREATE TABLE [dbo].[TblMst_CountryOld] (
    [SNo]                 INT           IDENTITY (1, 1) NOT NULL,
    [CountryCode]         CHAR (2)      NULL,
    [CountryName]         NVARCHAR (50) NOT NULL,
    [CurrencySNo]         INT           NULL,
    [CurrencyCode]        VARCHAR (3)   NULL,
    [Continent]           NVARCHAR (50) NULL,
    [IATAAreaCode]        NVARCHAR (50) NULL,
    [ISDCode]             INT           NULL,
    [CreatedOn]           DATETIME      NOT NULL,
    [CreatedBy]           INT           NOT NULL,
    [UpdatedOn]           DATETIME      NOT NULL,
    [UpdatedBy]           INT           NOT NULL,
    [EventType]           INT           NULL,
    [IsCraMasterTransfer] TINYINT       NULL,
    [DiscountOnTactRate]  BIT           NULL,
    [Nationality]         VARCHAR (250) NULL,
    [IsTaxExemption]      BIT           NULL,
    CONSTRAINT [PK_TblMst_CountryOld] PRIMARY KEY CLUSTERED ([SNo] ASC)
);

