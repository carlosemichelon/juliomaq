# JuliomaqOS — Guia v5.3 — HANDOFF
**Atualizado:** Maio 2026 | **Modelo:** Claude Sonnet 4.6

## INSTRUÇÃO PARA NOVO CHAT
Cole no início:
"Continuando JuliomaqOS v5.3. Guia em anexo. Arquivos: index_v5.html, Code_v5.gs, offline_v4.html. Me pergunte o que quer fazer."

---

## URLs
- Online: https://carlosemichelon.github.io/juliomaq/
- Offline: https://carlosemichelon.github.io/juliomaq/offline.html
- Apps Script: https://script.google.com/macros/s/AKfycbwtlWfCduBsMBr-omIXjUfuLsqWy1sKVoNnWXDrOjKW14b_GWxO7dqNQSvA8JKjt7hs/exec
- Planilha: https://docs.google.com/spreadsheets/d/1AMwOpaVa2hcpiaVmXDcZvNiE-7rQeyt4vDU42GkLrLc/edit
- GitHub: https://github.com/carlosemichelon/juliomaq

## Arquivos v5.2
index_v5.html → index.html | Code_v5.gs → Apps Script | offline_v4.html → offline.html | sw_v4.js → sw.js | sw-offline_v4.js → sw-offline.js

---

## SENHAS
| Recurso | Senha |
|---------|-------|
| Planilha / Resumo Despesas / Financeiro / Cobranças | 1105 |
| Resumo OS | sem senha |

---

## ABAS ONLINE (17)
```
[Geral]      📅 Agenda | 💰 Despesas | 🚗 Desp. Veículos | ☑️ Checklist | 📊 Resumo Desp.(1105) | 📣 Marketing
[Pós Vendas] ➕ Nova OS | 📋 Resumo OS | ☁️ Salesforce | 🔧 Ferramentas
[Peças]      🎯 Prospecção | 💵 Orçamento | 💳 Cobranças(1105)
[Vendas]     🏁 Concorrência | 👥 Gest. Clientes | 🔄 Usados | 💵 Financeiro(1105)
```

## ABAS OFFLINE (4)
Nova OS · Resumo OS · Desp. Veículos · Despesas

---

## RESPONSÁVEIS
Todos os 8: Carlos · Christiano · Lucas · Sandro · João Acker · Welinton · Everaldo · João Dias
Peças: Everaldo · João Dias | Vendas: Sandro · João Acker · Welinton

## VEÍCULOS
Nova OS: Montana 2018, Montana 2020, Saveiro 2019, Saveiro 2024
Desp. Veículos / Checklist / Ferramentas: + Ka 2017, Mobi 2024

---

## REGRAS DE CÓDIGO (CRÍTICO)
- NUNCA backticks — SyntaxError em WebViews
- Aspas em attrs HTML dentro de strings JS: escapar com \'
- Validar TODOS os blocos script com node --check
- Reimplantar Apps Script SEMPRE que alterar Code_v5.gs
- **DEPLOY: SEMPRE atualizar a implantação EXISTENTE** (lápis ✏️ → Nova versão → Implantar). NUNCA criar nova implantação — a URL muda e o GAS_URL no HTML fica desatualizado, quebrando todas as chamadas ao backend
- Se criar nova implantação por engano: atualizar `GAS_URL` no início do bloco `<script>` do index.html
- CUIDADO com inserção via replace — evitar inserir HTML dentro de blocos <script>
- Strings JS não podem quebrar linha sem \n explícito

## VALIDAÇÃO (copiar e usar sempre)
```python
import re, subprocess, tempfile, os
content = open('index_v5.html').read()
scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
for i, s in enumerate(scripts):
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write(s); fname = f.name
    r = subprocess.run(['node','--check',fname], capture_output=True, text=True)
    print(f"Script {i+1}: {'OK' if r.returncode==0 else r.stderr[:100]}")
    os.unlink(fname)
```

---

## ARQUITETURA DE DADOS

### Cache global (lerTudoPlanilha)
Uma chamada no init retorna 21 coleções. Após salvar: `_recarregarColecao('nomeColecao')`.
`_meta`: { geradoEm, erros[], totalColecoes }

### Agenda — AgendaEventos (planilha)
11 colunas: ID | Titulo | Cliente | Data | DataISO | DiaInteiro | HoraInicio | HoraFim | Responsavel | Descricao | CriadoEm
IDs: AG-100001... (importados) | AG-[timestamp] (novos)
`_garantirHeaderAgenda()` garante header correto automaticamente.
`salvarAgendaEvento(dados)`: id presente = EDITAR | id ausente = CRIAR

---

## ALTERAÇÕES v5.3 (esta sessão)

### index_v5.html — aba 📅 Agenda
- **Bug fix apagar evento**: função `apagarEventoAgenda` estava faltando no HTML — adicionada. Chama `apagarAgendaEvento(ev.id)` no backend, remove do cache local e atualiza lista + calendário sem recarregar
- **Calendário — visual**: fontes e tamanhos aumentados para melhor leitura: dia da semana 10→12px, número do dia 11→14px, hoje círculo 20→26px, pills de evento 8→10px, altura da célula 62→84px
- **GAS_URL atualizada**: nova URL de implantação do Apps Script

### Code_v5.gs
- Sem alterações nesta sessão (mesma versão v5.2)

---

## ALTERAÇÕES v5.2 (sessão anterior)

### index_v5.html — aba 📅 Agenda
- **Editar evento**: botão ✏️ no modal de detalhe → modal de edição pré-preenchido
- **Apagar evento**: botão 🗑️ no modal de detalhe com confirmação → remove linha da planilha e do cache local
- **GCal no modal**: botão 📅 GCal no header do modal de detalhe (removido da lista)
- **GCal após salvar**: checkbox "Abrir no Google Calendar após salvar" no formulário
- **Cores dos pills**: passado → 🟢 verde (#1A6B2A) | futuro → 🟠 laranja (#E85A0C)
- **Z-index corrigido**: #load=99999, agEvModal=9010, agEditModal=9020, agDiaModal=9001
- **Scroll**: window.scrollTo(0,0) ao abrir qualquer modal
- **+N mais**: clicável → abre modal com lista dos eventos do dia; ao clicar num evento fecha o modal do dia primeiro
- **Bug fix**: string JS quebrada em linha (`html+='` + newline) corrigida para `html+='\n...'`

### Code_v5.gs
- **apagarAgendaEvento(id)**: deleta linha por ID, adicionada ao whitelist
- **lerTudoPlanilha()**: retorna 21 coleções em 1 chamada
- **salvarAgendaEvento()**: unificada (cria OU edita por dados.id)
- **Reorganização**: seções na ordem das abas do HTML

---

## MODAIS DA AGENDA (HTML — sempre fora de <script>)
```
agDiaModal    z-index:9001  — lista eventos do dia
agEditModal   z-index:9020  — editar evento
agEvModal     z-index:9010  — detalhe do evento
  Botões: 📅 GCal | ✏️ Editar | 🗑️ | ✕
```

---

## PENDÊNCIAS
- Dashboard inicial
- Badge alerta Prospecção
- Status de OS
- Relatório mensal PDF
- Modo escuro
- Importar despesas offline → online
- Offline: Prospecção, Orçamentos, Checklist
- Múltiplas assinaturas por OS
- Calendário: botão Agendar na Nova OS
- PWA manifest.json + ícone
- Usados: salvar fotos no Drive
- Checklist_Log: col N = Dano (adicionar manualmente na planilha)

---

## MAPA DE ASSINATURAS E FOTOS

### ONDE CADA COISA É SALVA

#### 📋 ORDENS DE SERVIÇO (aba "Ordens de Servico")
| Dado | Como é salvo | Coluna na planilha | Drive |
|---|---|---|---|
| **Assinatura do cliente** | base64 texto na célula | Col N | Drive folder `Juliomaq_Assinaturas/` — URL gravada na Col T como `=IMAGE()` |
| **Fotos da OS** | links Drive separados por vírgula | Col O (texto) | Drive folder `Juliomaq_Fotos/` — primeira foto gravada na Col U como `=IMAGE()` |

**Fluxo assinatura OS:**
1. HTML captura base64 no canvas de assinatura
2. `salvarOrdem()` grava base64 bruto na Col N (para o HTML ler via `getAssinaturas()`)
3. `uploadSignatureToDrive()` faz upload para `Juliomaq_Assinaturas/` e grava `=IMAGE(url)` na Col T (visual na planilha)
4. HTML busca assinaturas via `getAssinaturas(nums)` que lê Col N e retorna base64

**Fluxo fotos OS:**
1. HTML comprime para JPEG 80% max 1200px (exceto HEIC que vai raw)
2. `salvarMidia()` faz upload para `Juliomaq_Fotos/` e grava URL pública em Col O (append com vírgula)
3. Primeira foto gravada como `=IMAGE()` na Col U para visualização na planilha
4. HTML monta thumbs via `drive.google.com/thumbnail?id=FILE_ID&sz=w200`

---

#### 🚗 DESPESAS DE VEÍCULOS (aba "Gestao de Veiculos")
| Dado | Como é salvo | Coluna na planilha | Drive |
|---|---|---|---|
| **Assinatura do técnico** | base64 texto na célula | Col I | Drive folder `Juliomaq_Assinaturas/` — URL gravada na Col K como `=IMAGE()` |

**Nota:** Sem fotos nesta aba. Assinatura segue o mesmo fluxo da OS.
HTML carrega assinaturas via `getAssinaturaVei(nums)` que lê Col I.

---

#### 💰 DESPESAS GERAIS (aba "Despesas")
| Dado | Como é salvo | Coluna na planilha | Drive |
|---|---|---|---|
| **Foto da nota fiscal** | URL Drive | Col J | Drive **pasta raiz** do usuário — URL `/view` |
| **Assinatura do comprador** | URL Drive | Col L | Drive folder `Juliomaq_Assinaturas/` |
| **Foto visual (planilha)** | `=IMAGE()` | Col M | mesma URL da Col J |
| **Assinatura visual (planilha)** | `=IMAGE()` | Col N | mesma URL da Col L |

**Atenção:** Foto da nota fiscal vai para a **pasta raiz do Drive** (não para uma subpasta). Isso é diferente das fotos de OS e veículos.

---

#### 🔄 USADOS (aba "Usados")
| Dado | Como é salvo | Coluna na planilha | Drive |
|---|---|---|---|
| **Fotos do usado** | ⚠️ **NÃO salvo no Drive** | — | Fotos são enviadas pelo HTML mas o `salvarVendas()` **não faz upload** — campo `fotos` (JSON base64) é ignorado pelo backend |

**Bug conhecido:** A aba Usados aceita fotos na interface mas o Code.gs não as salva. Pendência para implementar.

---

### PASTAS NO GOOGLE DRIVE
| Pasta | O que guarda |
|---|---|
| `Juliomaq_Assinaturas/` | Assinaturas de OS, Veículos e Despesas |
| `Juliomaq_Fotos/` | Fotos de OS (upload direto e importação offline) |
| Pasta raiz do Drive | Fotos de nota fiscal das Despesas |

### FUNÇÕES DE UPLOAD NO CODE.GS
| Função | O que faz |
|---|---|
| `uploadSignatureToDrive(b64, num)` | Converte base64 → JPEG → Drive `Juliomaq_Assinaturas/` → retorna URL pública |
| `salvarMidia(dados)` | Upload foto OS base64 → Drive `Juliomaq_Fotos/` → grava URL na Col O da OS |
| `uploadFotoImport(b64, mime, numOS, nome)` | Upload foto do offline (import JSON) → Drive `Juliomaq_Fotos/` → retorna URL |
| `adicionarFotoOS(numOS, url)` | Append URL na Col O de uma OS existente (usado após importação) |

### LIMITAÇÕES CONHECIDAS
- Base64 com mais de 400.000 chars é rejeitado silenciosamente (assinatura muito grande)
- HEIC: sem preview no HTML, enviado raw ao Drive (o Drive converte automaticamente)
- Fotos de Usados: interface aceita mas backend não salva (pendência)
- Fotos de Despesas: vão para pasta raiz, não para subpasta organizada
