# JuliomaqOS — Guia v5.0 — HANDOFF
**Atualizado:** Maio 2026 | **Modelo:** Claude Sonnet 4.6

## INSTRUÇÃO PARA NOVO CHAT
Cole no início: "Continuando JuliomaqOS v5.0. Guia em anexo. Arquivos: index_v5.html, Code_v5.gs. Me pergunte o que quer fazer."

---

## URLs
- Online: https://carlosemichelon.github.io/juliomaq/
- Offline: https://carlosemichelon.github.io/juliomaq/offline.html
- Apps Script: https://script.google.com/macros/s/AKfycbxfVbgo5pjM1jAUHCseWTwME2F2UvBHfLQrwJtsdAd3kpAa88LkmtImkQ_DTK98BOGG/exec
- Planilha: https://docs.google.com/spreadsheets/d/1AMwOpaVa2hcpiaVmXDcZvNiE-7rQeyt4vDU42GkLrLc/edit
- GitHub: https://github.com/carlosemichelon/juliomaq

## Arquivos v5.0
index_v5.html → index.html | Code_v5.gs → Apps Script | offline_v4.html → offline.html | sw_v4.js → sw.js | sw-offline_v4.js → sw-offline.js

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
- Reimplantar Apps Script SEMPRE que alterar Code_v5.gs

## VALIDAÇÃO
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

## MANUTENÇÃO
- Online: subir index_v5.html como index.html no GitHub
- Apps Script: Implantar → Gerenciar → editar → Nova versão → Implantar
- Offline: subir offline.html + incrementar sw-offline.js + subir

---

## O QUE TEM NA v5.0 (base testada e funcional)
- Parque de Máquinas (👥 Gestão de Clientes) — funcional
- Calendário mensal com toggle Lista/Calendário + modal detalhe + modal dia
- Importação .ics em batch
- Resumo Despesas com pills de filtro + stats
- Checklist com coluna Batidas/Arranhões/Amassados
- Atividades Salesforce com campo Pendente + fix datas
- Cobranças com layout redesenhado
- Fotos da OS no PDF de impressão
- Marketing carregando ao abrir aba
- Barra de progresso universal ao salvar
- Fix vendas (Concorrência/Usados/Gestão carregando ao abrir)
- Financeiro sem "Pagamento Máquina"
- +N mais no calendário clicável (modal do dia)

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
- Usados: salvar fotos no Drive (Code.gs precisa tratar campo `fotos`)
- Checklist_Log: adicionar col N manualmente na planilha (Dano)
