# GitHub MCP Server Setup Script
# This script helps you configure the GitHub MCP server for Claude Desktop

Write-Host "=== GitHub MCP Server Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Claude config exists
$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
if (-not (Test-Path $configPath)) {
    Write-Host "ERROR: Claude Desktop config not found at $configPath" -ForegroundColor Red
    exit 1
}

Write-Host "Current configuration found!" -ForegroundColor Green
Write-Host ""

# Read current config
$config = Get-Content $configPath | ConvertFrom-Json

# Check if github token is set
$currentToken = $config.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN

if ($currentToken -eq "your_github_token_here" -or [string]::IsNullOrEmpty($currentToken)) {
    Write-Host "GitHub token not configured yet." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To create a GitHub Personal Access Token:" -ForegroundColor Cyan
    Write-Host "1. Visit: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Click 'Generate new token' -> 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "3. Name it 'MCP Server'" -ForegroundColor White
    Write-Host "4. Select these scopes:" -ForegroundColor White
    Write-Host "   - repo (Full control of private repositories)" -ForegroundColor White
    Write-Host "   - read:org (Read organization data)" -ForegroundColor White
    Write-Host "   - read:user (Read user profile data)" -ForegroundColor White
    Write-Host "5. Click 'Generate token' and copy it" -ForegroundColor White
    Write-Host ""
    
    $token = Read-Host "Enter your GitHub Personal Access Token (or press Enter to skip)"
    
    if (-not [string]::IsNullOrEmpty($token)) {
        # Update config with token
        $config.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN = $token
        $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
        Write-Host ""
        Write-Host "✓ GitHub token configured successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "IMPORTANT: Restart Claude Desktop for changes to take effect" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "Setup skipped. Run this script again when you have a token." -ForegroundColor Yellow
    }
} else {
    Write-Host "GitHub token is already configured." -ForegroundColor Green
    Write-Host ""
    Write-Host "Current token: $($currentToken.Substring(0, [Math]::Min(10, $currentToken.Length)))..." -ForegroundColor Gray
    Write-Host ""
    
    $update = Read-Host "Would you like to update the token? (y/N)"
    
    if ($update -eq "y" -or $update -eq "Y") {
        $newToken = Read-Host "Enter new GitHub Personal Access Token"
        if (-not [string]::IsNullOrEmpty($newToken)) {
            $config.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN = $newToken
            $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
            Write-Host ""
            Write-Host "✓ GitHub token updated successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "IMPORTANT: Restart Claude Desktop for changes to take effect" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "=== Testing GitHub MCP Server ===" -ForegroundColor Cyan
Write-Host ""

# Test if the server file exists
$serverPath = "C:\Users\Guacco\AppData\Roaming\npm\node_modules\@modelcontextprotocol\server-github\dist\index.js"
if (Test-Path $serverPath) {
    Write-Host "✓ GitHub MCP server installed at: $serverPath" -ForegroundColor Green
} else {
    Write-Host "✗ GitHub MCP server not found!" -ForegroundColor Red
    Write-Host "  Run: npm install -g @modelcontextprotocol/server-github" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Configuration file location: $configPath" -ForegroundColor Gray
Write-Host ""
Write-Host "After restarting Claude Desktop, you should see GitHub tools available." -ForegroundColor Cyan
