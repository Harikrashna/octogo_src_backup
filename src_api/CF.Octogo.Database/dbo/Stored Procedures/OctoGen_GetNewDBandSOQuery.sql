Create   Procedure OctoGen_GetNewDBandSOQuery (@SubscriberChosenURL varchar(100), @Module varchar(10))
as
Begin
Declare @ReturnSQL varchar(2000), @ServiceObjective varchar(1000), @TransactionCount int = 100
If (@Module = '')
Begin
Set @Module = 'Res'
End

--Select EstimatedTransactions from OctogenSubscriptionMaster where SubscriberChosenURL = @SubscriberChosenURL

If(@TransactionCount <= 100)
Begin
Set @ServiceObjective = '(SERVICE_OBJECTIVE = ELASTIC_POOL(name = [ElasticPoolUAT]))'
End

If(@TransactionCount between 101 and 500)
Begin
Set @ServiceObjective = '(SERVICE_OBJECTIVE = ELASTIC_POOL(name = [ElasticPoolUATPremium]))'
End

If(@TransactionCount between 501 and 1000)
Begin
Set @ServiceObjective = '(SERVICE_OBJECTIVE = ''S4'')'
End

If(@TransactionCount > 1000)
Begin
Set @ServiceObjective = '(SERVICE_OBJECTIVE = ''S7'')'
End


Set @ReturnSQL = 'Create Database [' + lower(@SubscriberChosenURL + '_'+ @Module) + '] AS COPY OF [OctogenModel_'+ @Module + '] ' + @ServiceObjective
--Set @ReturnSQL = 'Create Database [' + @SubscriberChosenURL + '] AS COPY OF [OctogenMaster] ' + @ServiceObjective

Select @ReturnSQL as Query

End