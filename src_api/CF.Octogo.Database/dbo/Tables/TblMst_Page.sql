﻿CREATE TABLE [dbo].[TblMst_Page] (
    [SNo]                     INT            NOT NULL,
    [PageName]                NVARCHAR (100) NOT NULL,
    [Hyperlink]               VARCHAR (250)  NULL,
    [MenuSNo]                 INT            NULL,
    [DisplayOrder]            INT            NOT NULL,
    [Help]                    VARCHAR (MAX)  NULL,
    [Description]             VARCHAR (250)  NULL,
    [SubMenuSNo]              INT            NULL,
    [IsActive]                BIT            NULL,
    [PageUrl]                 VARCHAR (150)  NULL,
    [Module]                  VARCHAR (200)  NULL,
    [Apps]                    VARCHAR (100)  NULL,
    [FormAction]              VARCHAR (100)  NULL,
    [Target]                  VARCHAR (100)  NULL,
    [CreatedBy]               INT            NOT NULL,
    [CreatedOn]               DATETIME       NOT NULL,
    [UpdatedBy]               INT            NULL,
    [UpdatedOn]               DATETIME       NULL,
    [PageExcelSampleName]     VARCHAR (200)  NULL,
    [IsExcelUpload]           BIT            CONSTRAINT [DF_TblMst_Page_IsExcelUpload] DEFAULT ((0)) NULL,
    [IsReportGenenrateOnBlob] BIT            CONSTRAINT [DF__TblMst_Page__IsReportGe__519EE6B3] DEFAULT ((0)) NOT NULL,
    [IsMobilePage]            BIT            CONSTRAINT [DF__TblMst_Page__IsMobilePa__6D3CDF87] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_TblMst_Page] PRIMARY KEY CLUSTERED ([SNo] ASC)
);

