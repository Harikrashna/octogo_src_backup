/*
    CREATED ON : 24/11/2021
    CREATE BY : Vishal
    DESC : 
    DRY RUN: 
    USP_CheckDuplicacy 1,'name'
*/
CREATE PROCEDURE [dbo].[USP_CheckDuplicateServices]
(
	@ServiceID int = null,
	@ServiceName varchar(50)
)
AS
    BEGIN
	    SELECT inServiceID, vcServiceName, vcDescription 
            FROM TblMst_Services 
            WHERE btIsActive=1
                AND vcServiceName=@ServiceName 
                AND inServiceID <> ISNULL(@ServiceID,0)
    END
