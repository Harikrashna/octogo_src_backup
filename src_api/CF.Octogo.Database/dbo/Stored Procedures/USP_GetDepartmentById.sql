/*
	CREATE BY: Vishal
	CREATED ON: 04/12/2021
	DESC:
*/

CREATE PROCEDURE [dbo].[USP_GetDepartmentById]
@DepartmentId int
AS
BEGIN
	SELECT 
	inDepartmentID,
	vcDepartmentName,
	vcDescription
	from 
	TblMst_Department(NOLOCK)
	WHERE
	inDepartmentID = @DepartmentId
end
