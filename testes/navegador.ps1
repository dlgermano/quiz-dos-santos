# Roda os testes de navegador no Edge em modo invisível e tira capturas. Uso: powershell -File testes/navegador.ps1
$raiz = Split-Path -Parent $PSScriptRoot
$edge = @("C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe", "C:\Program Files\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { Write-Output "Edge não encontrado"; exit 2 }
$porta = 8765
$cap = Join-Path $raiz "testes\capturas"
New-Item -ItemType Directory -Force $cap | Out-Null
$perfil = Join-Path $env:TEMP "quiz-santos-edge"
# Perfil novo a cada execução: o cache do navegador já serviu uma cópia antiga do teste.html
if (Test-Path $perfil) { Remove-Item -Recurse -Force $perfil -ErrorAction SilentlyContinue }
$servidor = Start-Process -FilePath "py" -ArgumentList "-m", "http.server", $porta, "--bind", "127.0.0.1", "--directory", "`"$raiz`"" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2
$comum = @("--headless=new", "--disable-gpu", "--hide-scrollbars", "--user-data-dir=`"$perfil`"", "--virtual-time-budget=10000")
$base = "http://127.0.0.1:$porta/testes/teste.html"
$falhou = $false
try {
  foreach ($url in @("$base`?acao=completo", "$base`?acao=resposta&modo=imagem&largura=390", "$base`?acao=cabe&largura=390&altura=844", "$base`?acao=cabe&largura=360&altura=740", "$base`?acao=cabe&largura=320&altura=568", "$base`?acao=cabe&largura=412&altura=915", "$base`?acao=cabe&largura=768&altura=1024", "$base`?acao=cabe&largura=844&altura=390", "$base`?acao=etapa&modo=simbolos", "$base`?acao=etapa&modo=imagem&largura=390&altura=844", "$base`?acao=mapa&largura=320&altura=568")) {
    $saida = Join-Path $cap "dom.txt"
    Start-Process -FilePath $edge -ArgumentList ($comum + @("--window-size=1100,1100", "--dump-dom", "`"$url`"")) -Wait -NoNewWindow -RedirectStandardOutput $saida -RedirectStandardError (Join-Path $cap "erro.txt")
    $t = Get-Content $saida -Raw -Encoding UTF8
    if ($t -match '(?s)RESULTADO\r?\n(.*?)\r?\nFIM') {
      $linhas = $Matches[1] -split "\r?\n"
      $linhas | ForEach-Object { Write-Output $_ }
      if ($linhas | Where-Object { $_ -notmatch 'problemas: nenhum$' }) { $falhou = $true }
    } else { Write-Output "sem resultado para $url"; $falhou = $true }
  }
  $fotos = @(
    @("simbolos-pergunta", "1100,760", "acao=pergunta&modo=simbolos&nivel=facil"),
    @("imagem-resposta", "1100,760", "acao=resposta&modo=imagem&nivel=facil"),
    @("imagem-celular", "700,1400", "acao=resposta&modo=imagem&nivel=facil&largura=390"),
    @("simbolos-celular", "700,1400", "acao=pergunta&modo=simbolos&largura=390"),
    @("cabe-celular", "700,900", "acao=cabe&largura=390&altura=844"),
    @("inicio-mapa-celular", "700,900", "acao=inicio-mapa&largura=390&altura=844"),
    @("mapa-celular", "700,900", "acao=mapa&largura=390&altura=844"))
  foreach ($f in $fotos) {
    Start-Process -FilePath $edge -ArgumentList ($comum + @("--window-size=$($f[1])", "--screenshot=`"$cap\$($f[0]).png`"", "`"$base`?$($f[2])`"")) -Wait
  }
} finally {
  # O "py" abre um python filho: encerra quem estiver ouvindo na porta, além do processo lançado
  Get-NetTCPConnection -LocalPort $porta -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
  Stop-Process -Id $servidor.Id -Force -ErrorAction SilentlyContinue
}
if ($falhou) { Write-Output "FALHOU"; exit 1 } else { Write-Output "PASSOU"; exit 0 }
