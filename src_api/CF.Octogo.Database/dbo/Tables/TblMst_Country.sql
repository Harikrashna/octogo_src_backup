CREATE TABLE [dbo].[TblMst_Country] (
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
    [UpdatedOn]           DATETIME      NULL,
    [UpdatedBy]           INT           NULL,
    [EventType]           INT           NULL,
    [IsCraMasterTransfer] TINYINT       NULL,
    [DiscountOnTactRate]  BIT           NULL,
    [Nationality]         VARCHAR (250) NULL,
    [IsTaxExemption]      BIT           NULL,
    [IsActive]            BIT           DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_TblMst_Country] PRIMARY KEY CLUSTERED ([SNo] ASC),
    CONSTRAINT [FK_TblMst_Country_CurrencySNo_TblMst_Currency_SNo] FOREIGN KEY ([CurrencySNo]) REFERENCES [dbo].[TblMst_Currency] ([SNo])
);

