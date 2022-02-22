/*
    CREATED BY: Vishal
    CREATED ON: 04/12/2021
    DESC: 
    DRY RUN:  USP_GetUserType 10,0
*/

	
	CREATE PROCEDURE [dbo].[USP_GetUserType]  
(
@MaxResultCount int,
 @SkipCount int,
 @Sorting varchar(50) =null,
 @filter varchar(50) =null
 )
AS    
    BEGIN    
	DECLARE @Sql VARCHAR(MAX)=''
		IF(@Sorting IS NULL)
		BEGIN
			SET @Sorting = 'vcUserTypeName';
		END
			SET @Sql = @Sql + '
			SELECT inUserTypeID [UserTypeId], vcUserTypeName [UserTypeName]  ,vcDescription [Description]    
            FROM TblMst_UserType (NOLOCK) 
            WHERE btIsActive = 1 AND (vcUserTypeName like ''%'+ISNULL(@filter,'')+'%''or vcDescription like ''%'+ISNULL(@filter,'')+'%'' ) '


			SET @Sql = @Sql + 'ORDER BY '+ @Sorting	
			SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS
									FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'


			EXEC(@Sql)

			SELECT COUNT(inUserTypeID) [totalCount] 
				FROM TblMst_UserType(NOLOCK)
				WHERE btIsActive=1 
		  AND (vcUserTypeName like '%'+ISNULL(@Filter,'')+'%' or vcDescription like '%'+ISNULL(@Filter,'')+'%' )
  
    END
	

