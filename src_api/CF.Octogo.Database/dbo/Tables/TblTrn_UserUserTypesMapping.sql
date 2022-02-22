CREATE TABLE [dbo].[TblTrn_UserUserTypesMapping] (
    [inUserTypemappingID] INT      IDENTITY (1, 1) NOT NULL,
    [inUserID]            BIGINT   NOT NULL,
    [inUserTypeID]        INT      NOT NULL,
    [btIsActive]          BIT      DEFAULT ((1)) NULL,
    [dtCreatedOn]         DATETIME NOT NULL,
    [inCreatedBy]         INT      NOT NULL,
    [dtModifiedOn]        DATETIME NULL,
    [inModifiedBy]        INT      NULL,
    PRIMARY KEY CLUSTERED ([inUserTypemappingID] ASC),
    FOREIGN KEY ([inUserID]) REFERENCES [dbo].[AbpUsers] ([Id]),
    FOREIGN KEY ([inUserTypeID]) REFERENCES [dbo].[TblMst_UserType] ([inUserTypeID])
);

