$body = '{"prompt":"¿Cuál es el sentido de la vida?"}'
Invoke-WebRequest -Uri "http://localhost:3001/api/gemini" -Method POST -Headers @{ "Content-Type" = "application/json" } -Body $body | Select-Object -ExpandProperty Content
