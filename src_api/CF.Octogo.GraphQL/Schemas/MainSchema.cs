using Abp.Dependency;
using GraphQL.Types;
using GraphQL.Utilities;
using CF.Octogo.Queries.Container;
using System;

namespace CF.Octogo.Schemas
{
    public class MainSchema : Schema, ITransientDependency
    {
        public MainSchema(IServiceProvider provider) :
            base(provider)
        {
            Query = provider.GetRequiredService<QueryContainer>();
        }
    }
}