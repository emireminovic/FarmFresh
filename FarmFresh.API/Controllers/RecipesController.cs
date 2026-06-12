using FarmFresh.Application.Features.Recipes;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class RecipesController : ControllerBase
{
    private readonly IMediator _mediator;

    public RecipesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateRecipeCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpGet("{productId}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(Guid productId)
    {
        var result = await _mediator.Send(new GetRecipesQuery(productId));
        return Ok(result);
    }

    [HttpGet]
[AllowAnonymous]
public async Task<IActionResult> GetAll()
{
    var result = await _mediator.Send(new GetRecipesQuery(Guid.Empty));
    return Ok(result);
}



}