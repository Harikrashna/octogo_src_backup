/*
	CREATE BY: Vishal
	CREATED ON: 04/12/2021
	DESC:
*/
	
CREATE PROCEDURE [dbo].[USP_GetDepartment]  
(
 @MaxResultCount int,  
    @SkipCount int,  
    @Sort VARCHAR(30) = NULL,
    @Filter VARCHAR(30) = NULL
 )
AS    
    BEGIN    
	DECLARE @Sql VARCHAR(MAX)=''
		IF(ISNULL(@Sort,'')='')
		BEGIN
			SET @Sort = 'vcDepartmentName';
		END
			SET @Sql = @Sql + '
			SELECT inDepartmentID [DepartmentId], vcDepartmentName [DepartmentName]  ,vcDescription [Description]    
            FROM TblMst_Department (NOLOCK) 
            WHERE btIsActive = 1 AND (vcDepartmentName like ''%'+ISNULL(@Filter,'')+'%''or vcDescription like ''%'+ISNULL(@Filter,'')+'%'' ) '
			SET @Sql = @Sql + 'ORDER BY '+ @Sort	
				SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS
									FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'

			EXEC(@Sql)

			SELECT COUNT(inDepartmentID) [totalCount] 
				FROM TblMst_Department(NOLOCK)
				WHERE btIsActive=1 AND (vcDepartmentName like '%' +ISNULL(@Filter,'')+'%' or vcDescription like '%'+ISNULL(@Filter,'')+'%' )
		
  
    END
	


	 

	 