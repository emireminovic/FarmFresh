# FarmFresh API

Platforma za direktnu prodaju od poljoprivrednika do potrošača.

## Pokretanje

### Preduslovi
- .NET 9 SDK
- PostgreSQL (port 5432, user: postgres, password: postgres)

### Pokretanje API-ja
```bash
dotnet run --project FarmFresh.API
```

API je dostupan na: `http://localhost:5223`

OpenAPI dokumentacija: `http://localhost:5223/openapi/v1.json`

## Arhitektura

Clean Architecture sa 4 sloja:

- **FarmFresh.Domain** — entiteti i domenski modeli
- **FarmFresh.Application** — CQRS handleri (MediatR), validacija (FluentValidation), interfejsi
- **FarmFresh.Infrastructure** — EF Core, PostgreSQL, Repository pattern, Unit of Work
- **FarmFresh.API** — kontroleri, middleware, JWT autentifikacija, Serilog

## Tehnički zahtevi

- Patterns: Repository pattern, Unit of Work, AutoMapper
- Arhitektura: Clean Architecture
- CQRS: MediatR (Commands i Queries)
- Autentifikacija: JWT access token + Refresh token
- Validacija: FluentValidation
- Logovanje: Serilog
- Exception handler: RFC 7807 Problem Details
- Swagger/OpenAPI dokumentacija
- Custom middleware: Currency & Unit Conversion

## API Endpointi

### Auth
- `POST /api/v1/auth/register` — registracija
- `POST /api/v1/auth/login` — prijava, vraća JWT token

### Products
- `GET /api/v1/products` — lista proizvoda
- `POST /api/v1/products` — kreiranje proizvoda (Farmer)

### Orders
- `POST /api/v1/orders` — kreiranje porudžbine

## ER Dijagram

Users (Id, Email, PasswordHash, Role)
├── FarmerProfiles (Id, UserId, FarmName, Location, ...)
│     ├── Products (Id, FarmerProfileId, Name, Price, Unit, ...)
│     ├── DeliverySlots (Id, FarmerProfileId, Type, SlotTime, ...)
│     ├── OpenFarmEvents (Id, FarmerProfileId, Title, EventDate, ...)
│     └── CsaSubscriptions (Id, FarmerProfileId, CustomerProfileId, ...)
└── CustomerProfiles (Id, UserId, FullName, PreferredCurrency, ...)
├── Addresses (Id, CustomerProfileId, Street, City, ...)
├── Orders (Id, CustomerProfileId, TotalAmount, ...)
│     └── SubOrders (Id, OrderId, FarmerProfileId, ...)
│           └── OrderItems (Id, SubOrderId, ProductId, ...)
├── CsaSubscriptions
├── EventRegistrations (Id, OpenFarmEventId, CustomerProfileId)
├── Reviews (Id, CustomerProfileId, ProductId, Rating, ...)
└── Recipes (Id, CustomerProfileId, ProductId, Title, ...)
RefreshTokens (Id, UserId, Token, ExpiresAt, IsRevoked)

## Custom Middleware

**CurrencyUnitMiddleware** — čita preferiranu valutu iz JWT claim-a ili X-Currency headera.
Pri serializaciji odgovora konvertuje polja sa cijenama u korisnikovu valutu koristeći cached kursne liste.
Originalna vrijednost ostaje u dodatnom polju (`priceOriginal`, `currencyOriginal`).