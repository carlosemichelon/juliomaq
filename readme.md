# JuliomaqOS v5.17 — Guia Completo de Handoff

> **Prompt de continuidade:**
> "Continuando JuliomaqOS v5.17. Leia o JULIOMAQ_GUIA_v5.17_COMPLETO.md antes de qualquer alteração."

---

## ARQUIVOS DO PROJETO

| Arquivo | Descrição |
|---|---|
| `index_v5_work.html` | Frontend principal (HTML/JS puro) |
| `Code_v5_work.gs` | Backend Google Apps Script |
| `agenda_view.html` | Visualizador público da agenda (standalone) |
| `offline_v4.html` | Versão offline do app |
| `sw_v4.js` | Service Worker principal |
| `sw-offline_v4.js` | Service Worker offline |
| `COMPATIBILIDADE_MOBILE.md` | Documentação iOS/Android |
| `JULIOMAQ_GUIA_v5.17_COMPLETO.md` | Este arquivo |

---

## URLS CRÍTICAS

| Recurso | URL |
|---|---|
| App online | https://carlosemichelon.github.io/juliomaq/ |
| Apps Script (backend) | https://script.google.com/macros/s/AKfycbwtlWfCduBsMBr-omIXjUfuLsqWy1sKVoNnWXDrOjKW14b_GWxO7dqNQSvA8JKjt7hs/exec |
| Planilha Google | https://docs.google.com/spreadsheets/d/1AMwOpaVa2hcpiaVmXDcZvNiE-7rQeyt4vDU42GkLrLc/edit |
| Agenda pública | https://carlosemichelon.github.io/juliomaqagenda/ |
| Repositório agenda | https://github.com/carlosemichelon/juliomaqagenda |

---

## REGRA CRÍTICA DE DEPLOY

**SEMPRE** atualizar implantação EXISTENTE (lápis ✏️ → Nova versão).
**NUNCA** criar nova implantação — isso muda a URL e quebra o app.

---

## PADRÕES DE CÓDIGO

- **NUNCA** usar backticks em JS (SyntaxError em WebViews)
- Validar blocos `<script>` com `node --check` (renomear para .js)
- Fórmulas GAS: usar `;` como separador (Google Sheets pt-BR)
- Reimplantar Code.gs SEMPRE na implantação EXISTENTE
- Strings JS com quebra de linha: usar `\n` escapado
- CSS em JS: usar aspas simples dentro de template strings HTML

---

## MAPEAMENTO DE COLUNAS DA PLANILHA

### Aba "Ordens de Servico"
| Col | Índice (r[]) | Campo JS | Descrição |
|---|---|---|---|
| A | 0 | num | Número OS |
| B | 1 | data | Data |
| C | 2 | cliente | Cliente |
| D | 3 | tipo | Tipo (Cliente/Garantia/Cortesia/Contrato) |
| E | 4 | tecnico | Técnico |
| F | 5 | veiculo | Veículo |
| G | 6 | local | Local |
| H | 7 | km | Km |
| I | 8 | horas | Horas trabalhadas |
| J | 9 | vHora | Valor hora |
| K | 10 | vKm | Valor km |
| L | 11 | vTotal | Valor total |
| M | 12 | status | Status |
| N | 13 | paga | Paga |
| O | 14 | descricao | Descrição |
| P | 15 | os_salesforce | (reservado) |
| Q | 16 | salesforce | Salesforce |
| R | 17 | paga2 | (reservado) |
| S | 18 | numCaso | Número do caso |
| T | 19 | notaCS | Nota CS |
| U | 20 | csStatus | CS Status |
| V | 21 | (reservado) | — |
| W (22) | 21 | eventoAgendaId | ID(s) evento agenda (vírgula separado) |
| X (23) | 22 | orcamentoVinculado | Orçamento vinculado |
| Y (24) | 23 | numNFS | **Nº NFS** (preenchido pelo usuário) |
| AD (30) | — | Memória de Cálculo | Fórmula automática (ARRAYFORMULA) |

### Aba "Usados"
Colunas lidas dinamicamente pelo cabeçalho real (getVendas reescrita v5.16):

| Cabeçalho planilha | Campo JS (normalizado) | Interpretação real |
|---|---|---|
| Data | data | Data do registro |
| Responsavel | responsavel | Responsável |
| Marca | marca | Marca da máquina |
| Modelo | modelo | Modelo |
| Ano | ano | Ano de fabricação |
| Horas | horas | **Número de série / chassi** |
| Preco | preco | Preço real da transação |
| Condicao | condicao | **Preço pedido** (numérico) |
| Obs | obs | **Condição real** (Excelente/Bom/Regular/Ruim) |
| SalvoEm | salvoemm | Data de salvamento |
| LinkAnuncio | linkanuncio | URL do anúncio |
| Status | status | Disponivel / Em negociação / Vendido / Reservado |
| Propostas | propostas | JSON array de propostas |

### Aba "AgendaEventos"
| Col | Campo | Descrição |
|---|---|---|
| A | id | ID único do evento |
| B | titulo | Título |
| C | cliente | Cliente |
| D | data | Data (texto) |
| E | dataISO | Data ISO (yyyy-mm-dd) |
| F | diaInteiro | Sim/Não |
| G | horaInicio | HH:MM |
| H | horaFim | HH:MM |
| I | responsavel | Responsável |
| J | descricao | Descrição |
| K | criadoEm | Timestamp de criação |

### Aba "Gestao de Veiculos"
| Col | Campo | Descrição |
|---|---|---|
| A | num | Número do registro |
| B | data | Data |
| C | veiculo | Veículo |
| D | tipo | Tipo (Abastecimento/Manutenção/etc.) |
| E | tecnico | Técnico |
| F | hodometro | Hodômetro (km) |
| G | valor | Valor |
| H | descricao | Descrição |

### Aba "Cobrancas"
| Campo | Descrição |
|---|---|
| num | Número |
| cliente | Cliente |
| valor | Valor |
| vencimento | Data de vencimento |
| status | Pendente / Pago / Atrasado |
| responsavel | Responsável |
| os | OS vinculada |
| descricao | Descrição da cobrança |
| formaPgto | Forma de pagamento |
| obs | Observações |

---

## FUNCIONALIDADES POR ABA

### 📅 Agenda (aba padrão ao abrir)
- Calendário mensal navegável + Lista
- Filtros: Todos / Próximos / Este mês
- Criar/editar/apagar eventos
- Vincular múltiplas OS a um evento (IDs separados por vírgula)
- Badges de eventos nos cards do Resumo OS
- `_agEventos` carregado na inicialização para exibir badges
- `loadAgEventos()` re-renderiza Resumo OS após carregar

### 📋 Resumo OS
- Cards com todos os campos da OS
- Botão ✏️ Editar → modal azul completo
- Campo Nº NFS inline no card (salvo via blur na col Y/24)
- Badges de eventos agenda vinculados
- `_verOSNoResumo`: limpa filtros + retry 20x/500ms
- Botão 📋 Ver OS navega para Resumo OS e destaca card
- Filtros: tipo, técnico, status

### ➕ Nova OS
- Formulário completo com todos os campos
- Upload de fotos (compressão automática ≥500KB)
- Assinatura digital (canvas, compatível iOS/Android)
- Salva na planilha via `salvarOrdem()`

### 📄 Impressão OS (printOS)
- Layout A4 (210×297mm)
- Seção Referências: Nº NFS, Orçamento vinculado, Datas Agenda
- Layout Assinatura + Fotos: coluna empilhada
  - Assinatura: max-height 33px (flex:nenhum, ocupa pouco)
  - Fotos: 100×100px, até 9 fotos
- Seção Valor: labels 8px, valores 13px, Total 18px
- iOS: toast orienta "Compartilhar → Imprimir"

### 💰 Cobranças
- Filtros: Todas / ⏳ Pendente / 🔴 Atrasado / ✅ Pago
- Filtro mensal (select populado automaticamente)
- Cards: borda colorida, cliente, descrição, valor, dias de atraso
- Badge forma de pagamento com ícone
- Botão "✅ Marcar como Recebida" → `marcarCobrancaPaga()`
- Ordenação: Atrasado > Pendente > Pago

### 🔄 Usados
- Cards sempre abertos
- Borda colorida pela condição real (campo Obs)
- Badge 💰 preço pedido (campo Condicao)
- Badge 🔢 número de série (campo Horas)
- Badge de status: Disponível / Em negociação / Vendido / Reservado
- Link do anúncio clicável (🔗)
- Seção Propostas: lista + botão "+ Proposta" → modal
- Modal proposta: cliente, valor, status, obs
- `salvarPropostaUsado()` → adiciona JSON na col Propostas

### 🏢 Concorrência
- Cards: borda vermelha, marca+modelo+ano, cliente, concorrente badge
- Resumo no topo: registros perdidos, valor total, marca top, concorrente top, breakdown

### 🚜 Parque de Máquinas
- Cards: data formatada, responsável, área (ha), culturas
- Cada máquina: mini-card com condição colorida
- Detecta dois formatos de linha automaticamente

### 👥 Resumo Clientes
- Cards expansíveis com avatar colorido
- Grid métricas: OS Total · Faturado · Ticket Médio · Orçamentos
- Breakdown de tipos com badges
- Mini timeline de OS
- Orçamentos e prospecções listados

### 🚗 Despesas Veículos
- Botão ✏️ Editar → modal → `editarManutencao()`
- Veículos: Montana 2018/2020, Saveiro 2019/2024, Ka 2017, Mobi 2024, MB 1318, VW 24280

### 💸 Despesas Gerais
- Botão ✏️ Editar → modal → `editarDespesa()`
- Auto-preenche "Juliomaq Pagou" quando comprador = Juliomaq

---

## AGENDA_VIEW.HTML — VISUALIZADOR PÚBLICO

### Descrição
Página HTML standalone para visualização pública da agenda sem necessidade de login.

### URL de produção
`https://carlosemichelon.github.io/juliomaqagenda/`
(arquivo `index.html` no repositório `carlosemichelon/juliomaqagenda`)

### Funcionalidades
- Calendário mensal navegável (← →)
- Filtros: Todos / Próximos / Este mês
- Stats: Total de eventos · Este mês · Próximos
- Clicar no dia → modal com lista de eventos
- Clicar no evento → detalhe completo (somente leitura)
- Atualização automática a cada 5 minutos
- Sem autenticação — acesso livre pelo link

### Comunicação com backend
Usa `fetch` POST para o Apps Script:
```javascript
fetch(BACKEND, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({fn: 'getAgendaEventosSalvos', args: []})
})
```

### Requisito CORS
A implantação do Apps Script deve ter acesso: **"Qualquer pessoa, mesmo anônima"**

---

## CODE.GS — FUNÇÕES PRINCIPAIS

### doPost (whitelist completa)
```
getNextOSNum, salvarOrdem, getOrdens, marcarOSPaga, atualizarCampoOS,
getAssinaturas, adicionarFotoOS, salvarMidia, uploadFotoImport,
salvarManutencao, getManutencoes, getAssinaturaVei, getNextVeiNum,
salvarFerramenta, getFerramentas, apagarFerramenta,
salvarOrcamento, getOrcamentos, getNextOrcNum,
salvarProspeccao, getProspeccoes, atualizarProspeccao, getNextProspNum,
getGarantias, atualizarCampoGarantia,
getItensSemanal, salvarChecklistSemanal, getHistoricoChecklist,
exportarTudo,
salvarDespesa, getDespesas, getNextDespNum,
salvarGarantia,
salvarAtividade, getAtividades, atualizarStatusAtividade,
salvarVendas, getVendas,
salvarCobranca, getCobrancas,
salvarMarketing, getMarketing,
salvarFinanceiro, getFinanceiro,
editarDespesa, editarOS, editarManutencao,
salvarPropostaUsado, marcarCobrancaPaga,
getAgendaEventos, marcarReembolso,
vincularOSEvento, desvincularOSEvento, getOrdensEmAberto, getOSVinculadasEvento,
vincularOrcamentoOS, desvincularOrcamentoOS,
lerTudoPlanilha, salvarAgendaEvento, salvarAgendaEventosBatch,
editarAgendaEvento, apagarAgendaEvento, getAgendaEventosSalvos,
salvarParqueMaquinas, getParqueMaquinas, importarEventosGoogleCalendar
```

### Funções de edição
| Função | Aba | Busca por |
|---|---|---|
| `editarOS(dados)` | Ordens de Servico | num (col A) |
| `editarDespesa(dados)` | Despesas | num (col A) |
| `editarManutencao(dados)` | Gestao de Veiculos | num (col A) |
| `marcarCobrancaPaga(num)` | Cobrancas | num (col A), col Status dinâmica |
| `salvarPropostaUsado(numUsad, prop)` | Usados | num (linha), col M (JSON) |

### getVendas(tab) — v5.16
Lê cabeçalho real da linha 1. Normaliza nomes (lowercase, sem acentos, sem espaços).
Funciona para: `usad`, `conc`, `parq`.
Retorna `num` = número da linha para edições.

### _vendaSheets (definição de abas)
```javascript
conc: { nome:'Concorrencias', cab:[...], ids:[...] }
parq: { nome:'ParqueMaquinas', cab:[...], ids:[...] }
usad: { nome:'Usados', cab:['Data','Responsavel','Marca','Modelo','Ano',
        'Horas','Preco','Condicao','Obs','SalvoEm',
        'LinkAnuncio','Status','Propostas'], ids:[...] }
```

### setupFormulas / _setupFormulasOS
- Roda automaticamente via `onOpen()`
- Col X (24) = Nº NFS — limpa automaticamente se encontrar "Memória" no cabeçalho
- Col AD (30) = Memória de Cálculo (ARRAYFORMULA, separador `;`)
- Cols Z-AH: SUMIF por tipo (Cliente/Garantia/Cortesia/Contrato)

### Menu ⚙ Juliomaq
- 📁 Abrir Pasta Fotos/Assinaturas/Vendas → cria aba "Links Juliomaq" (tab laranja), navega e seleciona célula
- ✅ Registrar backup / 🕐 Ver último backup → toast
- Não usa `showModalDialog` (não precisa de permissão `container.ui`)

### getParqueMaquinas()
Detecta dois formatos de linha:
- **Formato simples** (salvarParqueM): col A = Cliente, col B = Maquinas JSON
- **Formato _vendaSheets.parq** (salvarParq): col A = Data, col B = Cliente

---

## COMPATIBILIDADE MOBILE

### iOS (correções implementadas)
- `rdimSig()`: `setTransform(1,0,0,1,0,0)` antes de escalar (evita acúmulo de transforms)
- `openSig()`: duplo `setTimeout` (120ms + 350ms) para aguardar modal renderizar
- Impressão: toast orienta "Compartilhar → Imprimir" (win.print() ignorado no iOS)
- HEIC: enviado sem compressão (canvas não decodifica HEIC)
- SW: registrado apenas em `github.io` / `localhost`

### CSS Mobile
```css
touch-action: manipulation;          /* evita delay 300ms */
-webkit-overflow-scrolling: touch;   /* scroll suave */
button.cact, label.cact { ... }     /* ícone Fotos alinhado no grid */
```

### Regra dos inputs
`font-size: 16px` em todos os `<input>` → previne zoom automático do iOS

---

## AGENDA PÚBLICA — PASSOS PARA PUBLICAR

1. Criar repositório `juliomaqagenda` no GitHub (público)
2. Upload do `agenda_view.html` renomeado para **`index.html`**
3. Settings → Pages → Branch: `main` → `/root`
4. Aguardar deploy (~2 min)
5. Acessar: `https://carlosemichelon.github.io/juliomaqagenda/`

**Verificar:** implantação Apps Script com acesso "Qualquer pessoa, mesmo anônima"

---

## HISTÓRICO DE VERSÕES (resumo)

| Versão | Principais mudanças |
|---|---|
| v5.1–v5.9 | Base do sistema, modais, impressão, agenda |
| v5.10 | `_agEventos` na inicialização, badges OS, fix iOS assinatura |
| v5.11 | Fix assinatura iOS (duplo timeout), cards Resumo Clientes |
| v5.12 | Layout impressão (assinatura+fotos empilhado), fix CORS menus |
| v5.13 | Aba padrão = Agenda, fix label.cact, fontes seção Valor |
| v5.14 | Cards Usados completos, propostas, status, link anúncio |
| v5.15 | Cards Cobranças, filtro mensal, dias atraso, marcar paga |
| v5.16 | `getVendas` lê cabeçalho real, fix campos Usados, versão na status bar |
| v5.17 | `agenda_view.html` — visualizador público standalone |
