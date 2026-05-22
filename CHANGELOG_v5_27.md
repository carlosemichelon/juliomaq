# JuliomaqOS — Checkpoint v5.27

## Arquivos
- `Code_v5_work.gs` — Google Apps Script backend
- `index_v5_work.html` — Frontend principal
- `juliomaq-ext/` — Extensão Chrome JuliomaqSF v1.2

## URL de implantação atual
https://script.google.com/macros/s/AKfycbykpm254ow6Gsx2aFOOaw14tIZJ6uGOhTcFbYirfKt1_LUsLhEo1t8wO_S_dureH0A5/exec

## Schema aba Atividades (21 colunas A-U)
A=ID | B=Topico | C=Descricao | D=Data | E=Status | F=ID_Ref | G=Observacao
H=CasoSF | I=EvId | J=CriadoEm | K=SF_TipoRegistro | L=SF_SubTipo
M=SF_Ativo | N=SF_NumSerie | O=Categoria | P=SF_Origem | Q=SF_Conta
R=SF_Contato | S=SF_Assunto | T=SF_Reclamacao | U=SF_DescMaquina

## O que foi resolvido nesta sessão (v5.27)

### Despesas Veículos
- Bug duplo withSuccessHandler causava tela de loading travada — corrigido para handler único

### Atividades — Campos SF completos
- Adicionadas cols P-U (SF_Origem, SF_Conta, SF_Contato, SF_Assunto, SF_Reclamacao, SF_DescMaquina)
- salvarDadosSF() agora grava 10 campos (cols K-N + P-U) em uma só chamada
- getAtividades() retorna todos os campos SF para o card
- Botão ☁️ Caso SF fica VERDE ✅ quando Assunto SF já foi salvo
- Ao reabrir o modal, todos os dados SF salvos são restaurados automaticamente
- Dropdowns (Tipo, Sub Tipo, Origem) restauram a seleção salva
- Banner verde "✅ Caso já preparado anteriormente" ao reabrir

### Extensão Chrome JuliomaqSF v1.2
- URL corrigida: script.google.com → carlosemichelon.github.io/juliomaq
- Popup com bloco de texto formatado + botão Copiar Tudo
- Botão "✏️ Preencher SF": detecta aba do SF aberta ou abre nova
- Digitação letra a letra (digitarDevagar) para campos lookup do LWC
- Polling com esperarOpcoes() para comboboxes
- Banner de resultado: ✅ campos preenchidos / ⚠️ verificar

### Organização do Code.gs
- 14 funções de diagnóstico/manutenção movidas para o final do arquivo
- Documentação da estrutura do backend inserida no topo (seções 1-18)
- removerAbasObsoletas() — deleta Eventos e Leads no onOpen automaticamente

### Deploy
- Para deploy: sempre Gerenciar implantações → ✏️ → Nova versão
- Rodar corrigirCabecalhoAtividades() após deploy (adiciona cols P-U)
