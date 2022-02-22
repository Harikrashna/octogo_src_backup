CREATE TABLE [dbo].[TblMst_Product] (
    [inProductID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcProductName] VARCHAR (100) NOT NULL,
    [vcDescription] VARCHAR (250) NULL,
    [btIsActive]    BIT           CONSTRAINT [DF_TblMst_Product_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]   DATETIME      CONSTRAINT [DF_TblMst_Product_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]   BIGINT        NOT NULL,
    [dtModifiedOn]  DATETIME      NULL,
    [inModifiedBy]  BIGINT        NULL,
    CONSTRAINT [PK_TblMst_Product] PRIMARY KEY CLUSTERED ([inProductID] ASC)
);

