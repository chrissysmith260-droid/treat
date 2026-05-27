var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Backend API Routes
app.MapGet("/api/status", () => Results.Ok(new { status = "Treat API is running" }));

// Health check for Azure Deployment and GitHub Actions
app.MapGet("/health", () => Results.Ok("Healthy"));

// SPA Fallback
app.MapFallbackToFile("index.html");

app.Run();