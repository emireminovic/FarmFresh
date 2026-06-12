FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY FarmFresh.Domain/FarmFresh.Domain.csproj FarmFresh.Domain/
COPY FarmFresh.Application/FarmFresh.Application.csproj FarmFresh.Application/
COPY FarmFresh.Infrastructure/FarmFresh.Infrastructure.csproj FarmFresh.Infrastructure/
COPY FarmFresh.API/FarmFresh.API.csproj FarmFresh.API/

RUN dotnet restore FarmFresh.API/FarmFresh.API.csproj

COPY . .

RUN dotnet publish FarmFresh.API/FarmFresh.API.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "FarmFresh.API.dll"]
