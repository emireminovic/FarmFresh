using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UploadsController : ControllerBase
{
    private readonly Cloudinary _cloudinary;

    public UploadsController(IConfiguration configuration)
{
    var cloudName = configuration["Cloudinary__CloudName"] ?? Environment.GetEnvironmentVariable("Cloudinary__CloudName");
    var apiKey = configuration["Cloudinary__ApiKey"] ?? Environment.GetEnvironmentVariable("Cloudinary__ApiKey");
    var apiSecret = configuration["Cloudinary__ApiSecret"] ?? Environment.GetEnvironmentVariable("Cloudinary__ApiSecret");
    
    var account = new Account(cloudName, apiKey, apiSecret);
    _cloudinary = new Cloudinary(account);
}

    [HttpPost("product-image")]
    [Authorize(Roles = "Farmer")]
    public async Task<IActionResult> UploadProductImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "Fajl nije priložen." });

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(new { error = "Dozvoljeni formati: jpg, jpeg, png, webp." });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { error = "Maksimalna veličina fajla je 5MB." });

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "farmfresh/products"
        };
        var result = await _cloudinary.UploadAsync(uploadParams);
        return Ok(new { url = result.SecureUrl.ToString() });
    }

    [HttpPost("farm-photo")]
    [Authorize(Roles = "Farmer")]
    public async Task<IActionResult> UploadFarmPhoto(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "Fajl nije priložen." });

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(new { error = "Dozvoljeni formati: jpg, jpeg, png, webp." });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { error = "Maksimalna veličina fajla je 5MB." });

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "farmfresh/farms"
        };
        var result = await _cloudinary.UploadAsync(uploadParams);
        return Ok(new { url = result.SecureUrl.ToString() });
    }

    [HttpPost("event-review-photo")]
    [Authorize]
    public async Task<IActionResult> UploadEventReviewPhoto(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "Fajl nije priložen." });

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(new { error = "Dozvoljeni formati: jpg, jpeg, png, webp." });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { error = "Maksimalna veličina fajla je 5MB." });

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "farmfresh/reviews"
        };
        var result = await _cloudinary.UploadAsync(uploadParams);
        return Ok(new { url = result.SecureUrl.ToString() });
    }
}