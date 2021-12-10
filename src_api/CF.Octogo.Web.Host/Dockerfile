#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["src/CF.Octogo.Web.Host/CF.Octogo.Web.Host.csproj", "src/CF.Octogo.Web.Host/"]
COPY ["src/CF.Octogo.Web.Core/CF.Octogo.Web.Core.csproj", "src/CF.Octogo.Web.Core/"]
COPY ["src/CF.Octogo.Application/CF.Octogo.Application.csproj", "src/CF.Octogo.Application/"]
COPY ["src/CF.Octogo.Application.Shared/CF.Octogo.Application.Shared.csproj", "src/CF.Octogo.Application.Shared/"]
COPY ["src/CF.Octogo.Core.Shared/CF.Octogo.Core.Shared.csproj", "src/CF.Octogo.Core.Shared/"]
COPY ["src/CF.Octogo.Core/CF.Octogo.Core.csproj", "src/CF.Octogo.Core/"]
COPY ["src/CF.Octogo.EntityFrameworkCore/CF.Octogo.EntityFrameworkCore.csproj", "src/CF.Octogo.EntityFrameworkCore/"]
COPY ["src/CF.Octogo.GraphQL/CF.Octogo.GraphQL.csproj", "src/CF.Octogo.GraphQL/"]
RUN dotnet restore "src/CF.Octogo.Web.Host/CF.Octogo.Web.Host.csproj"
COPY . .
WORKDIR "/src/src/CF.Octogo.Web.Host"
RUN dotnet build "CF.Octogo.Web.Host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CF.Octogo.Web.Host.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CF.Octogo.Web.Host.dll"]
