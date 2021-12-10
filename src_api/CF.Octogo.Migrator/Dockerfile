#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["src/CF.Octogo.Migrator/CF.Octogo.Migrator.csproj", "src/CF.Octogo.Migrator/"]
COPY ["src/CF.Octogo.EntityFrameworkCore/CF.Octogo.EntityFrameworkCore.csproj", "src/CF.Octogo.EntityFrameworkCore/"]
COPY ["src/CF.Octogo.Core/CF.Octogo.Core.csproj", "src/CF.Octogo.Core/"]
COPY ["src/CF.Octogo.Core.Shared/CF.Octogo.Core.Shared.csproj", "src/CF.Octogo.Core.Shared/"]
RUN dotnet restore "src/CF.Octogo.Migrator/CF.Octogo.Migrator.csproj"
COPY . .
WORKDIR "/src/src/CF.Octogo.Migrator"
RUN dotnet build "CF.Octogo.Migrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CF.Octogo.Migrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CF.Octogo.Migrator.dll"]
