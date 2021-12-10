namespace CF.Octogo.Debugging
{
    public static class DebugHelper
    {
        public static bool IsDebug
        {
            get
            {
#pragma warning disable
#if DEBUG
                return false;
#endif
                return false;
#pragma warning restore
            }
        }
    }
}
