using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmFresh.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UploadsController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public UploadsController(IWebHostEnvironment env)
    {
        _env = env;
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

        var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "products");
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var url = $"/uploads/products/{fileName}";
        return Ok(new { url });
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

    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "farms");
    Directory.CreateDirectory(uploadsFolder);

    var fileName = $"{Guid.NewGuid()}{ext}";
    var filePath = Path.Combine(uploadsFolder, fileName);

    using var stream = new FileStream(filePath, FileMode.Create);
    await file.CopyToAsync(stream);

    var url = $"/uploads/farms/{fileName}";
    return Ok(new { url });
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

    var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "reviews");
    Directory.CreateDirectory(uploadsFolder);

    var fileName = $"{Guid.NewGuid()}{ext}";
    var filePath = Path.Combine(uploadsFolder, fileName);

    using var stream = new FileStream(filePath, FileMode.Create);
    await file.CopyToAsync(stream);

    return Ok(new { url = $"/uploads/reviews/{fileName}" });
}
}