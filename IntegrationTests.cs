using Xunit;

namespace treat.Tests;

public class IntegrationTests
{
    [Fact]
    [Trait("Category", "IntegrationTests")]
    public async Task VerifyStagingSiteIsUp()
    {
        // The STAGING_URL is provided by the GitHub Actions workflow environment
        var stagingUrl = Environment.GetEnvironmentVariable("STAGING_URL");
        
        Assert.False(string.IsNullOrWhiteSpace(stagingUrl), "STAGING_URL environment variable is not set.");

        using var client = new HttpClient();
        // This hits the /health endpoint defined in your Program.cs
        var response = await client.GetAsync($"{stagingUrl.TrimEnd('/')}/health");

        Assert.True(response.IsSuccessStatusCode, $"Staging site at {stagingUrl} returned {response.StatusCode}");
        var content = await response.Content.ReadAsStringAsync();
        Assert.Equal("Healthy", content);
    }
}