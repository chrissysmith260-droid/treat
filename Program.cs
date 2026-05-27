var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();

// In .NET 8, you must register the SPA static files service if using SpaServices.Extensions
builder.Services.AddSpaStaticFiles(configuration => {
    configuration.RootPath = "wwwroot";
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Backend API Routes
app.MapGet("/api/status", () => Results.Ok(new { status = "Treat API is running" }));

// Health check for Azure Deployment and GitHub Actions
app.MapGet("/health", () => Results.Ok("Healthy"));

// Secure AI Proxy Endpoint
app.MapPost("/api/ai/generate-report", async (HttpContext context, IConfiguration config, IHttpClientFactory clientFactory) => 
{
    var apiKey = config["GOOGLE_API_KEY"];
    if (string.IsNullOrEmpty(apiKey)) 
    {
        return Results.Problem("Google API Key is not configured in the backend.");
    }

    var client = clientFactory.CreateClient();
    var targetUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={apiKey}";

    using var requestContent = new StreamContent(context.Request.Body);
    requestContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

    var response = await client.PostAsync(targetUrl, requestContent);
    var result = await response.Content.ReadAsStringAsync();
    return Results.Content(result, "application/json");
});

app.UseSpaStaticFiles();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "src";
    if (app.Environment.IsDevelopment())
    {
        spa.UseProxyToSpaDevelopmentServer("http://127.0.0.1:3000");
    }
});

app.Run();