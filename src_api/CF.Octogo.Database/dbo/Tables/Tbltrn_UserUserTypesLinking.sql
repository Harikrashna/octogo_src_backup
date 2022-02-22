CREATE TABLE [dbo].[Tbltrn_UserUserTypesLinking] (
    [inUserTypeLinkId] INT      IDENTITY (1, 1) NOT NULL,
    [inUserId]         BIGINT   NOT NULL,
    [inUserTypeId]     INT      NOT NULL,
    [btIsActive]       BIT      DEFAULT ((1)) NULL,
    [dtCreatedOn]      DATETIME NOT NULL,
    [inCreatedBy]      INT      NOT NULL,
    PRIMARY KEY CLUSTERED ([inUserTypeLinkId] ASC),
    FOREIGN KEY ([inUserId]) REFERENCES [dbo].[AbpUsers] ([Id]),
    FOREIGN KEY ([inUserTypeId]) REFERENCES [dbo].[TblMst_UserType] ([inUserTypeID])
);

