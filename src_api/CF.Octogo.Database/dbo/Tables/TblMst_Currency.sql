CREATE TABLE [dbo].[TblMst_Currency] (
    [SNo]                 INT           IDENTITY (1, 1) NOT NULL,
    [CurrencyCode]        CHAR (3)      NOT NULL,
    [CurrencyName]        NVARCHAR (50) NOT NULL,
    [CreatedBy]           INT           NOT NULL,
    [CreatedOn]           DATETIME      NOT NULL,
    [UpdatedBy]           INT           NOT NULL,
    [UpdatedOn]           DATETIME      CONSTRAINT [DF_TblMst_Currency_UpdatedOn] DEFAULT (getdate()) NOT NULL,
    [EventType]           INT           NULL,
    [IsCraMasterTransfer] TINYINT       NULL,
    [PrecisionValue]      INT           NULL,
    [RoundOffAmount]      INT           NULL,
    [Basis]               TINYINT       NULL,
    CONSTRAINT [PK_TblMst_Currency] PRIMARY KEY CLUSTERED ([SNo] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'1-Round Off,
2-Round Up,
3-Round Near', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'TblMst_Currency', @level2type = N'COLUMN', @level2name = N'Basis';

