/*
    CREATED BY: Vishal
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  USP_GetServiceById

*/
CREATE PROCEDURE [dbo].[USP_GetServiceById]
@ServiceId int
AS
BEGIN
	SELECT inServiceID, vcServiceName, vcDescription
		FROM 
		TblMst_Services(NOLOCK)
		WHERE
		inServiceID = @ServiceId
		AND btIsActive = 1
end
