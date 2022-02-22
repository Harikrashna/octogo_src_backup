/*
Created by :Merajuddin khan
created on:05 dec 2021
dry run
*/

CREATE PROCEDURE [dbo].[USP_GetDesignationDuplicacyCheck]
(
    @DesignationId INT = NULL,
    @DesignationName varchar(100)
)

AS
    BEGIN
        SELECT  E.vcDesignationName [DesignationName], E.vcDescription [Description]
            FROM TblMst_Designation E (NOLOCK)
           where E.vcDesignationName=@DesignationName
		   AND ISNULL(@DesignationId,0)<>E.inDesignationID AND E.btIsActive=1
    END