CREATE TABLE [dbo].[TblMst_Department] (
    [inDepartmentID]   INT           IDENTITY (1, 1) NOT NULL,
    [vcDepartmentName] VARCHAR (100) NOT NULL,
    [vcDescription]    VARCHAR (250) NULL,
    [btIsActive]       BIT           DEFAULT ((1)) NOT NULL,
    [dtCreatedOn]      DATETIME      NOT NULL,
    [inCreatedBy]      INT           NOT NULL,
    [dtModifiedOn]     DATETIME      NULL,
    [inModifiedBy]     INT           NULL
);

