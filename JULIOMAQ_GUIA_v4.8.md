# JuliomaqOS — Guia v4.8 — HANDOFF
**Atualizado:** Abril 2026 | **Modelo:** Claude Sonnet 4.6

## INSTRUÇÃO PARA NOVO CHAT
Cole no início: "Continuando JuliomaqOS v4.8. Guia em anexo. Arquivos: Index_v4.html, offline_v4.html, Code_v4.gs. Me pergunte o que quer fazer."

---

## URLs
- Online: https://carlosemichelon.github.io/juliomaq/
- Offline: https://carlosemichelon.github.io/juliomaq/offline.html
- Apps Script: https://script.google.com/macros/s/AKfycbxfVbgo5pjM1jAUHCseWTwME2F2UvBHfLQrwJtsdAd3kpAa88LkmtImkQ_DTK98BOGG/exec
- Planilha: https://docs.google.com/spreadsheets/d/1AMwOpaVa2hcpiaVmXDcZvNiE-7rQeyt4vDU42GkLrLc/edit
- GitHub: https://github.com/carlosemichelon/juliomaq

## Arquivos v4.8
Index_v4.html → index.html | offline_v4.html → offline.html | Code_v4.gs → Apps Script | sw_v4.js → sw.js | sw-offline_v4.js → sw-offline.js

---

## SENHAS
| Recurso | Senha |
|---------|-------|
| Planilha / Resumo Despesas / Financeiro / Cobranças | 1105 |
| Resumo OS | sem senha |

---

## ABAS ONLINE (17) — 4 grupos
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
- Reimplantar Apps Script SEMPRE que alterar Code_v4.gs

## VALIDAÇÃO
```python
import re, subprocess, tempfile, os
content = open('Index_v4.html').read()
scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
for i, s in enumerate(scripts):
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write(s); fname = f.name
    r = subprocess.run(['node','--check',fname], capture_output=True, text=True)
    print(f"Script {i+1}: {'OK' if r.returncode==0 else r.stderr[:100]}")
    os.unlink(fname)
```

---

## ALTERAÇÕES v4.8 (esta sessão)

### Index_v4.html

**📅 Agenda**
- Bug fix: datas vindas do backend como string bruta de Date agora são parseadas corretamente em todo o código da Agenda (_parseAgDate helper)
- Evento no calendário: ao clicar no pill, abre modal com detalhes (título, data, cliente, responsável, descrição, botão GCal)
- Filtros, stats e lista de eventos também corrigidos para o novo parser

**🚗 Desp. Veículos**
- Removidos stats (Registros / Este Mês / Total Gasto) e bloco Resumo por Tipo

**💰 Despesas**
- Autocomplete Fornecedor: preenche CNPJ e Categoria automaticamente

**📊 Resumo Despesas**
- Pills de filtro (Por Categoria + Por Responsável) em ambos os painéis
- Stats adicionados: Despesas (Total/A Pagar/Nº) e Veículos (Total/Registros/Este Mês)

**📣 Marketing**
- Removido: seção Leads
- Campanhas → "Posts e Campanhas" com toggle 📸 Post / 📢 Campanha (campanha tem Data Início/Fim)

**☁️ Salesforce — Atividades**
- Campo "Pendente" adicionado (o que falta para finalizar)
- Data exibida em dd/mm/aa (fix bug de string bruta de Date)

**☑️ Checklist Veículos**
- Coluna "Batidas / Arranhões / Amassados" adicionada na tabela

**💳 Cobranças / 💵 Financeiro**
- Conteúdo agora usa wrapper dbody (max-width:600px centralizado) — fix layout maximizado

### Code_v4.gs
- **Checklist**: salvarChecklistSemanal — coluna Dano (Batidas/Arranhões/Amassados) adicionada (col 14); getHistoricoChecklist — range 13→14 cols, dano incluído nos itens, índice salvEM corrigido
- **Atividades**: salvarAtividade — coluna Pendente adicionada (col 9); getAtividades — helper fmtD/safeStr que formata dates corretamente, range 8→9 cols, campo pendente retornado

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
