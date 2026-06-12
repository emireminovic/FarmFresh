using AutoMapper;
using FarmFresh.Application.DTOs;
using FarmFresh.Application.Features.CSA;
using FarmFresh.Domain.Entities;

namespace FarmFresh.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<FarmerProfile, FarmerProfileDto>();
        CreateMap<CustomerProfile, CustomerProfileDto>();
        CreateMap<Product, ProductDto>();
        CreateMap<OpenFarmEvent, OpenFarmEventDto>();
        CreateMap<CsaSubscription, CsaSubscriptionDto>();
        CreateMap<CsaWeeklyBox, CsaWeeklyBoxDto>();
        CreateMap<CsaWeeklyBoxItem, CsaWeeklyBoxItemDtoModel>();
        CreateMap<CsaBoxTemplate, CsaBoxTemplateDto>();
        CreateMap<CsaBoxTemplateItem, CsaBoxTemplateItemDtoModel>();
        CreateMap<Recipe, RecipeDto>();
        CreateMap<Review, ReviewDto>();
        CreateMap<Order, OrderDto>();
    }
}