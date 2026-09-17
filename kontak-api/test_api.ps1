# Test API Endpoints Script

# Test 1: Register User
Write-Host "=== TEST 1: REGISTER USER ===" -ForegroundColor Green
$registerBody = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$registerResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerBody

Write-Host "Response:" -ForegroundColor Yellow
$registerResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

Write-Host "`n=== TEST 2: LOGIN USER ===" -ForegroundColor Green
$loginBody = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$loginData = $loginResponse.Content | ConvertFrom-Json
Write-Host "Response:" -ForegroundColor Yellow
$loginData | ConvertTo-Json -Depth 10

# Extract token for further requests
$token = $loginData.data.token

Write-Host "`n=== TEST 3: CREATE CONTACT ===" -ForegroundColor Green
$contactBody = @{
    nama = "Budi Santoso"
    alamat = "Denpasar, Bali"
    tanggal_lahir = "2000-01-15"
    phones = @(
        @{
            jenis = "HP"
            nomor_telepon = "08123456789"
        },
        @{
            jenis = "Rumah"
            nomor_telepon = "02158123456"
        }
    )
} | ConvertTo-Json -Depth 10

$contactResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/kontak" `
    -Method POST `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $token" } `
    -Body $contactBody

Write-Host "Response:" -ForegroundColor Yellow
$contactResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

Write-Host "`n=== TEST 4: GET ALL CONTACTS ===" -ForegroundColor Green
$getAllResponse = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/kontak" `
    -Method GET `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $token" }

Write-Host "Response:" -ForegroundColor Yellow
$getAllResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

Write-Host "`n=== API TESTS COMPLETED ===" -ForegroundColor Green
