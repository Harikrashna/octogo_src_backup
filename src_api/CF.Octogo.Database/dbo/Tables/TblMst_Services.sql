CREATE TABLE [dbo].[TblMst_Services] (
    [inServiceID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcServiceName] VARCHAR (100) NOT NULL,
    [vcDescription] VARCHAR (250) NULL,
    [btIsActive]    BIT           CONSTRAINT [DF_TblMst_Services_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]   DATETIME      CONSTRAINT [DF_TblMst_Services_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]   BIGINT        NOT NULL,
    [dtModifiedOn]  DATETIME      NULL,
    [inModifiedBy]  BIGINT        NULL,
    CONSTRAINT [PK_TblMst_Services] PRIMARY KEY CLUSTERED ([inServiceID] ASC)
);

