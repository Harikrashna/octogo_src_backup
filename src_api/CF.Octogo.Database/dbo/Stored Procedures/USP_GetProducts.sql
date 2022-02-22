/*
    CREATED ON : 24/11/2021
    CREATE BY : Vishal
    DESC : 
    DRY RUN: 
    USP_GetProducts
*/
CREATE PROCEDURE [dbo].[USP_GetProducts]  
(
    @MaxResultCount INT,
    @SkipCount INT,
    @Sorting VARCHAR(50) = NULL,
    @filter VARCHAR(50) = NULL
 )
AS    
    BEGIN    
	DECLARE @Sql VARCHAR(MAX)=''
		IF(ISNULL(@Sorting,'')='')
	        BEGIN
		        SET @Sorting = 'vcProductName';
			END
		SET @Sql = @Sql + '
            SELECT inProductID [ProductId], vcProductName [ProductName], vcDescription [Description]    
                FROM TblMst_Product (NOLOCK) 
                WHERE btIsActive = 1 
                AND (vcProductName like ''%'+ISNULL(@filter,'')+'%''or vcDescription like ''%'+ISNULL(@filter,'')+'%'' ) '
		SET @Sql = @Sql + 'ORDER BY '+ @Sorting	
			SET @Sql = @Sql + ' OFFSET ('+CAST(@SkipCount AS VARCHAR)+') ROWS
								FETCH NEXT '+CAST(@MaxResultCount AS VARCHAR)+' ROWS ONLY'
		EXEC(@Sql)

		SELECT COUNT(inProductID) [totalCount] 
			FROM TblMst_Product(NOLOCK)
			WHERE btIsActive = 1 
            AND (vcProductName like '%'+ISNULL(@filter,'')+'%' OR vcDescription like '%'+ISNULL(@filter,'')+'%' )
	
  
    END
	