CREATE TABLE [dbo].[TblMst_UserType] (
    [inUserTypeID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcUserTypeName] VARCHAR (100) NOT NULL,
    [vcDescription]  VARCHAR (250) NULL,
    [btIsActive]     BIT           CONSTRAINT [DF_TblMst_UserType_btIsActive] DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]    DATETIME      CONSTRAINT [DF_TblMst_UserType_dtCreatedOn] DEFAULT (getdate()) NOT NULL,
    [inCreatedBy]    BIGINT        NOT NULL,
    [dtModifiedOn]   DATETIME      NULL,
    [inModifiedBy]   BIGINT        NULL,
    CONSTRAINT [PK_TblMst_UserType] PRIMARY KEY CLUSTERED ([inUserTypeID] ASC)
);

