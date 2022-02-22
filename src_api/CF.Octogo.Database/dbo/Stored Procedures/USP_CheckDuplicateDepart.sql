/*
	CREATE BY: Vishal
	CREATED ON: 04/12/2021
	DESC:
*/

CREATE PROCEDURE [dbo].[USP_CheckDuplicateDepart]
	@DepartmentID int = null,
	@DepartmentName varchar(50)
AS
BEGIN

SET NOCOUNT ON;  

			SELECT  vcDepartmentName , vcDescription 
			FROM TblMst_Department(NOLOCK)
				WHERE vcDepartmentName = @DepartmentName AND btIsActive=1 
					AND inDepartmentID <> ISNULL(@DepartmentID,0) 
		
END