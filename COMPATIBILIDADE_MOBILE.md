# JuliomaqOS v5.10 — Compatibilidade Mobile
**iOS (Safari/WKWebView) e Android (Chrome/WebView)**

---

## ✅ FUNCIONA EM AMBAS AS PLATAFORMAS

| Funcionalidade | iOS Safari | Android Chrome | Observações |
|---|---|---|---|
| Navegação entre abas | ✅ | ✅ | Scroll horizontal com `-webkit-overflow-scrolling:touch` |
| Formulários e inputs | ✅ | ✅ | Todos os campos com `touch-action:manipulation` |
| Assinatura digital (canvas) | ✅* | ✅ | *Requer duplo `setTimeout` (120ms+350ms) para medir canvas corretamente |
| Upload de fotos | ✅ | ✅ | Aceita `image/*,.heic,.heif` — iOS nativo captura câmera direto |
| Compressão de imagens | ✅ | ✅ | Arquivos ≥ 500KB comprimidos via canvas; menores enviados raw |
| Calendário da agenda | ✅ | ✅ | Touch events com `{passive:false}` e `preventDefault()` |
| Modais/bottom sheets | ✅ | ✅ | `position:fixed;inset:0` — estável em ambos |
| Toasts e notificações visuais | ✅ | ✅ | |
| Exportar para WhatsApp | ✅ | ✅ | `window.open('https://wa.me/...')` abre app nativo |
| Service Worker (offline) | ✅* | ✅ | *Só registra em `github.io` ou `localhost` — não em preview |
| LocalStorage (offline_v4) | ✅ | ✅ | Limite ~5MB no Safari; limite maior no Chrome |
| Scroll nas listas | ✅ | ✅ | `-webkit-overflow-scrolling:touch` nas abas |
| Vincular OS a eventos (seletor) | ✅ | ✅ | Filtros por mês e cliente funcionam via input/select nativos |

---

## ⚠️ COMPORTAMENTOS DIFERENTES POR PLATAFORMA

### Impressão (printOS / printOrc)
| | iOS Safari | Android Chrome |
|---|---|---|
| `window.print()` | ❌ Não suportado — `win.print()` ignorado | ✅ Abre diálogo de impressão |
| **Solução iOS** | Toast: "Toque em Compartilhar → Imprimir" | Chama `win.print()` automaticamente após 500ms |
| Pop-ups | Deve liberar pop-ups no Safari | Deve liberar pop-ups no Chrome |
| Detecção | `isIOS()` via `navigator.userAgent` | Fallback padrão |

### Assinatura Digital (Canvas)
| | iOS Safari | Android Chrome |
|---|---|---|
| Canvas sizing | ❌ Problema: mede canvas antes do modal renderizar — área útil vira metade | ✅ Funciona normalmente |
| **Solução** | `rdimSig()` chamado 2x: 120ms + 350ms após `openSig()` | Chamado 1x após 60ms (mantido) |
| `setTransform` reset | ✅ Necessário — iOS acumula transforms entre aberturas | Não crítico mas incluído |
| Touch events | `passive:false` + `preventDefault()` obrigatórios | Idem |

### HEIC/HEIF (fotos iPhone)
| | iOS Safari | Android Chrome |
|---|---|---|
| Captura câmera | ✅ Gera HEIC nativamente | ✅ Gera JPEG/WebP |
| Upload HEIC | ✅ Aceito via `accept=".heic,.heif"` | ⚠️ Suporte limitado — maioria dos Android não gera HEIC |
| Compressão HEIC | ⚠️ Canvas não decodifica HEIC — enviado raw (sem compressão) | N/A |
| **Solução** | Detecta por extensão e mime; HEIC vai raw sem comprimir | Comprime normalmente |

### `window.open()` / Pop-ups
| | iOS Safari | Android Chrome |
|---|---|---|
| Pop-ups | Bloqueados por padrão — precisa de interação do usuário | Idem |
| Workaround | Chamada dentro de handler de toque (`onclick`) | Idem |
| Planilha Google | `window.open(...,'_blank')` — abre aba, mas pode ser bloqueado | Idem |

---

## ❌ LIMITAÇÕES CONHECIDAS

### iOS (Safari/WKWebView)
1. **`win.print()` não funciona** — exibir instrução "Compartilhar → Imprimir"
2. **Canvas assinatura area reduzida** — corrigido com duplo `setTimeout` (v5.10)
3. **Zoom automático em inputs** — mitigado com `font-size:16px` nos campos `<input>`; se menor que 16px o iOS dá zoom
4. **`position:fixed` dentro de overflow:scroll** — evitado; modais usam `position:fixed` no `body`
5. **HEIC sem compressão** — canvas não lê HEIC; arquivos enviados inteiros (potencialmente grandes)
6. **Service Worker** — registrado apenas em `github.io`/`localhost` para evitar erro 404 em outros domínios
7. **`localStorage` limite ~5MB** — limitação do Safari; exceder pode silenciosamente falhar
8. **`window.open` no iOS WebView** — pode ser bloqueado se não chamado em handler síncrono de toque

### Android (Chrome/WebView)
1. **Câmera em WebView corporativo** — alguns WebViews Android bloqueiam `accept="image/*"` — usuário vê picker vazio
2. **Pop-ups** — mesmo comportamento do iOS: precisam de interação do usuário
3. **`localStorage` em modo incógnito** — pode falhar silenciosamente

---

## 🔧 PADRÕES IMPLEMENTADOS PARA COMPATIBILIDADE

### CSS
```css
/* Todos os botões interativos */
touch-action: manipulation;          /* evita delay de 300ms no iOS */
-webkit-appearance: none;            /* remove estilo nativo iOS */
-webkit-tap-highlight-color: transparent; /* remove flash azul no toque */

/* Scroll horizontal nas abas */
-webkit-overflow-scrolling: touch;

/* Canvas de assinatura */
touch-action: none;                  /* impede scroll durante assinatura */
```

### JavaScript
```javascript
// Detecção iOS
function isIOS(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Touch events no canvas — sempre com passive:false
canvas.addEventListener('touchstart', handler, {passive:false});
canvas.addEventListener('touchmove', handler, {passive:false});

// Impressão segura
if(isIOS()){
  toast('iOS: no Safari, toque em Compartilhar → Imprimir','ok',6000);
} else {
  setTimeout(function(){ win.focus(); win.print(); }, 500);
}

// Assinatura — duplo redimensionamento para iOS
setTimeout(rdimSig, 120);
setTimeout(rdimSig, 350);

// Canvas reset completo (evita acúmulo de transforms no iOS)
sigCtx.setTransform(1,0,0,1,0,0);
sigCtx.scale(devicePixelRatio, devicePixelRatio);

// Upload de fotos — sem compressão abaixo de 500KB
if(file.size < 500*1024){
  // envia raw — HEIC e arquivos pequenos
} else {
  // comprime via canvas para JPEG 80% max 1200px
}
```

### HTML
```html
<!-- Inputs com font-size mínimo 16px para evitar zoom iOS -->
<input style="font-size:16px">   <!-- ou via .fi { font-size:16px } -->

<!-- File input aceita HEIC -->
<input type="file" accept="image/*,.heic,.heif">

<!-- Service Worker só em produção -->
var host = window.location.hostname;
if(host.indexOf('github.io')>=0 || host==='localhost'){
  navigator.serviceWorker.register('./sw-offline.js');
}
```

---

## 📋 CHECKLIST DE TESTE MOBILE

### iOS Safari
- [ ] Login/abertura do app sem erros
- [ ] Formulário OS: preencher e salvar
- [ ] Assinatura: desenhar em toda a largura da tela
- [ ] Upload de foto: câmera e galeria
- [ ] Upload HEIC: arquivo enviado sem erro (sem compressão)
- [ ] Impressão OS: toast orienta "Compartilhar → Imprimir"
- [ ] WhatsApp: abre app com mensagem
- [ ] Agenda: arrastar/rolar sem conflito de scroll
- [ ] Modais: abrem e fecham sem travar scroll do body

### Android Chrome
- [ ] Login/abertura do app sem erros
- [ ] Formulário OS: preencher e salvar
- [ ] Assinatura: desenhar sem offset
- [ ] Upload de foto: câmera e galeria
- [ ] Impressão OS: diálogo de impressão abre
- [ ] WhatsApp: abre app com mensagem
- [ ] Agenda: navegação no calendário

---

## 🔮 MELHORIAS FUTURAS RECOMENDADAS

| Item | Prioridade | Descrição |
|---|---|---|
| `font-size:16px` em todos os `<input>` | Alta | Previne zoom automático do iOS |
| HEIC → JPEG server-side | Média | Converter HEIC no Apps Script para reduzir tamanho |
| PWA manifest | Média | Adicionar `manifest.json` para "Adicionar à tela inicial" |
| Vibração em ações | Baixa | `navigator.vibrate(50)` como feedback tátil nos botões |
| Share API nativa | Baixa | `navigator.share()` para substituir `window.open(wa.me)` |
