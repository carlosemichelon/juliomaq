// ════════════════════════════════════════════════════════════════
// JULIOMAQ OS — Code.gs v14
// Planilha: Juliomaq_OS
// ════════════════════════════════════════════════════════════════
// "Ordens de Servico"  GID: 1979764838
// "Orcamentos"         GID: 953364154
// "Gestao de Veiculos" GID: 1754490404
// "Ferramentas"        GID: 595908974
// "Prospeccao"         GID: 940023173

// ════════════════════════════════════════════════════════════════
// MENU — aparece automaticamente ao abrir a planilha
// ════════════════════════════════════════════════════════════════
function onOpen(){
  try{
    var ui=SpreadsheetApp.getUi();
    ui.createMenu('⚙ Juliomaq')
      .addItem('📁 Abrir Pasta Fotos', 'abrirPastaFotos')
      .addItem('✍️ Abrir Pasta Assinaturas', 'abrirPastaAssinaturas')
      .addItem('📦 Abrir Pasta Vendas', 'abrirPastaVendas')
      .addSeparator()
      .addItem('📋 Ver cabeçalhos de todas as abas', 'verCabecalhosPlanilha')
      .addItem('📊 Atualizar fórmulas de resumo', 'setupFormulas')
      .addSeparator()
      .addItem('🕐 Ver data do último backup', 'verUltimoBackup')
      .addItem('✅ Registrar backup agora', 'registrarBackup')
      .addToUi();
    // Atualiza indicativo de backup na planilha
    _atualizarIndicativoBackup();
  }catch(e){ Logger.log('onOpen err: '+e); }
  try{ setupFormulas(); }catch(e){ Logger.log('onOpen/setupFormulas: '+e); }
}

function abrirPastaFotos(){
  var f=DriveApp.getFoldersByName('Juliomaq_Fotos');
  if(f.hasNext()){
    var url='https://drive.google.com/drive/folders/'+f.next().getId();
    _abrirUrlNaCelula('Juliomaq_Fotos', url);
  } else {
    SpreadsheetApp.getActive().toast('Pasta Juliomaq_Fotos não encontrada. Será criada na próxima OS com foto.','⚠️ Aviso',6);
  }
}

function abrirPastaAssinaturas(){
  var f=DriveApp.getFoldersByName('Juliomaq_Assinaturas');
  if(f.hasNext()){
    var url='https://drive.google.com/drive/folders/'+f.next().getId();
    _abrirUrlNaCelula('Juliomaq_Assinaturas', url);
  } else {
    SpreadsheetApp.getActive().toast('Pasta Juliomaq_Assinaturas não encontrada.','⚠️ Aviso',5);
  }
}

function abrirPastaVendas(){
  var f=DriveApp.getFoldersByName('Juliomaq_Vendas');
  if(f.hasNext()){
    var url='https://drive.google.com/drive/folders/'+f.next().getId();
    _abrirUrlNaCelula('Juliomaq_Vendas', url);
  } else {
    SpreadsheetApp.getActive().toast('Pasta Juliomaq_Vendas não encontrada.','⚠️ Aviso',5);
  }
}

function _abrirUrlNaCelula(nome, url){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  // Cria ou obtém aba dedicada "Links Juliomaq"
  var sh=ss.getSheetByName('Links Juliomaq');
  if(!sh){
    sh=ss.insertSheet('Links Juliomaq');
    sh.setTabColor('#e65100');
    sh.getRange('A1').setValue('Pasta').setFontWeight('bold');
    sh.getRange('B1').setValue('Link').setFontWeight('bold');
  }
  // Encontra próxima linha vazia ou linha existente para este nome
  var data=sh.getDataRange().getValues();
  var targetRow=-1;
  for(var i=1;i<data.length;i++){ if(data[i][0]===nome){targetRow=i+1;break;} }
  if(targetRow<0) targetRow=data.length+1;
  sh.getRange(targetRow,1).setValue(nome);
  sh.getRange(targetRow,2).setFormula('=HYPERLINK("'+url+'","📁 Clique aqui para abrir "+'+'"'+nome+'"');
  sh.getRange(targetRow,2).setFontColor('#1a4a7a').setFontWeight('bold').setFontSize(12);
  sh.setColumnWidth(2,300);
  // Navega para a aba de links
  ss.setActiveSheet(sh);
  sh.setActiveRange(sh.getRange(targetRow,2));
  SpreadsheetApp.getActive().toast('Clique na célula destacada para abrir a pasta no Drive.','📁 '+nome,10);
}

function registrarBackup(){
  var now=new Date();
  var dataStr=now.toLocaleString('pt-BR');
  PropertiesService.getScriptProperties().setProperty('ultimo_backup', dataStr);
  _atualizarIndicativoBackup();
  SpreadsheetApp.getActive().toast('Backup registrado em: '+dataStr,'✅ Backup',5);
}

function verUltimoBackup(){
  var data=PropertiesService.getScriptProperties().getProperty('ultimo_backup')||'Nenhum backup registrado';
  SpreadsheetApp.getActive().toast('Último backup: '+data,'🕐 Backup',8);
}

function _atualizarIndicativoBackup(){
  try{
    var data=PropertiesService.getScriptProperties().getProperty('ultimo_backup')||'Nunca';
    var ss=SpreadsheetApp.getActiveSpreadsheet();
    // Mostra na célula A1 da aba ativa como nota ou em aba dedicada
    // Usa named range ou célula fixa na primeira aba
    var sh=ss.getSheets()[0];
    var cell=sh.getRange('A1');
    var note='⚙ JuliomaqOS\n📅 Backup: '+data+'\n🔗 App: carlosemichelon.github.io/juliomaq';
    cell.setNote(note);
  }catch(e){ Logger.log('_atualizarIndicativoBackup: '+e); }
}
// "Garantia"           GID: 8877451
// "Revisão Checklist"  GID: 2138218736
// ════════════════════════════════════════════════════════════════

// ── Helper: get sheet by name ─────────────────────────────────
function getSheet(name){
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}
function getOrCreateSheet(name){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name)||ss.insertSheet(name);
}
function getSheetByGid(gid){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var sheets=ss.getSheets();
  for(var i=0;i<sheets.length;i++){
    if(String(sheets[i].getSheetId())===String(gid)) return sheets[i];
  }
  return null;
}

// ── Serve app ─────────────────────────────────────────────────
function doGet(){
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Juliomaq OS')
    .addMetaTag('viewport','width=device-width,initial-scale=1');
}

// ── API JSON para hospedagem externa (Netlify / GitHub Pages) ──────────────
// Permite que o Index.html hospedado fora do Apps Script chame as funções
// via fetch() POST → { fn: 'nomeDaFuncao', args: [...] }
function doPost(e){
  var WHITELIST = [
    'getNextOSNum','salvarOrdem','getOrdens','marcarOSPaga','atualizarCampoOS',
    'getAssinaturas','adicionarFotoOS','salvarMidia','uploadFotoImport',
    'salvarManutencao','getManutencoes','getAssinaturaVei','getNextVeiNum',
    'salvarFerramenta','getFerramentas','apagarFerramenta',
    'salvarOrcamento','getOrcamentos','getNextOrcNum',
    'salvarProspeccao','getProspeccoes','atualizarProspeccao','getNextProspNum',
    'getGarantias','atualizarCampoGarantia',
    'getItensSemanal','salvarChecklistSemanal','getHistoricoChecklist',
    'exportarTudo',
    'salvarDespesa','getDespesas','getNextDespNum',
    'salvarGarantia',
    'salvarAtividade','getAtividades','atualizarStatusAtividade',
    'salvarVendas','getVendas',
    'salvarVenda','getVendas2','marcarParcelaRecebida','salvarMidiaVenda','salvarAssinaturaVenda','salvarUsadosVenda',
    'salvarCobranca','getCobrancas',
    'salvarMarketing','getMarketing',
    'salvarFinanceiro','getFinanceiro','editarDespesa','editarOS','editarManutencao','salvarPropostaUsado','marcarCobrancaPaga',
    'getAgendaEventos',
    'marcarReembolso',
    'vincularOSEvento','desvincularOSEvento','getOrdensEmAberto','getOSVinculadasEvento',
    'vincularOrcamentoOS','desvincularOrcamentoOS',
    'lerTudoPlanilha','salvarAgendaEvento','salvarAgendaEventosBatch','editarAgendaEvento','apagarAgendaEvento','getAgendaEventosSalvos','salvarParqueMaquinas','getParqueMaquinas','importarEventosGoogleCalendar'
  ];
  try {
    var req  = JSON.parse(e.postData.contents);
    var fn   = req.fn;
    var args = req.args || [];
    if (WHITELIST.indexOf(fn) < 0) throw new Error('Função não permitida: ' + fn);
    // eval seguro: fn está na whitelist acima
    var result = eval('(' + fn + ').apply(null, args)');
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, result: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// 📅 AGENDA — AgendaEventos + importação iCal
// ════════════════════════════════════════════════════════════════
function getAgendaEventos(){
  try{
    var url = 'https://calendar.google.com/calendar/ical/carlosemichelon%40gmail.com/public/basic.ics';
    var response = UrlFetchApp.fetch(url, {muteHttpExceptions:true});
    if(response.getResponseCode()!==200) return [];
    var ical = response.getContentText();
    var eventos = [];
    var lines = ical.replace(/\r\n[ \t]/g,' ').split(/\r\n|\n|\r/);
    var ev = null;
    var hoje = new Date(); hoje.setHours(0,0,0,0);
    var limite = new Date(hoje); limite.setMonth(hoje.getMonth()+3); // próximos 3 meses
    lines.forEach(function(line){
      if(line==='BEGIN:VEVENT'){ ev={titulo:'',inicio:null}; }
      else if(line==='END:VEVENT'){
        if(ev&&ev.titulo&&ev.inicio&&ev.inicio>=hoje&&ev.inicio<=limite){
          eventos.push({titulo:ev.titulo, inicio:ev.inicio.toISOString()});
        }
        ev=null;
      } else if(ev){
        if(line.match(/^SUMMARY/)){
          ev.titulo=line.replace(/^SUMMARY[^:]*:/,'').replace(/\\,/g,',').replace(/\\n/g,' ').trim();
        } else if(line.match(/^DTSTART/)){
          var val=line.replace(/^DTSTART[^:]*:/,'').trim();
          var dt;
          if(val.length===8){
            // All-day event: YYYYMMDD
            dt=new Date(val.substring(0,4)+'-'+val.substring(4,6)+'-'+val.substring(6,8)+'T00:00:00');
          } else {
            // Datetime: YYYYMMDDTHHmmssZ
            dt=new Date(val.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,'$1-$2-$3T$4:$5:$6'));
          }
          if(!isNaN(dt)) ev.inicio=dt;
        }
      }
    });
    // Ordenar por data
    eventos.sort(function(a,b){return new Date(a.inicio)-new Date(b.inicio);});
    return eventos.slice(0,30); // máximo 30 eventos
  }catch(e){Logger.log('getAgendaEventos err: '+e);return[];}
}

// ════════════════════════════════════════════════════════════════

// Aba: AgendaEventos | Cols: ID|Titulo|Cliente|Data|DataISO|DiaInteiro|HoraInicio|HoraFim|Responsavel|Descricao|CriadoEm
// ════════════════════════════════════════════════════════════════
// ── Diagnóstico agenda (chamar do Apps Script Editor para testar) ──
function diagnosticoAgenda(){
  try{
    var sheet=getOrCreateSheet('AgendaEventos');
    Logger.log('Sheet OK. Linhas: '+sheet.getLastRow());
    Logger.log('Célula A1: '+sheet.getRange(1,1).getValue());
    var r=salvarAgendaEvento({titulo:'TESTE DIAG',cliente:'',data:'04/05/2026',dataISO:'2026-05-04',diaInteiro:'Sim',horaInicio:'',horaFim:'',responsavel:'',descricao:'Diagnóstico automático',criadoEm:new Date().toLocaleString('pt-BR')});
    Logger.log('salvarAgendaEvento: '+JSON.stringify(r));
  }catch(e){Logger.log('ERRO diagnóstico: '+e);}
}

function _garantirHeaderAgenda(sheet){
  // Garante que a primeira linha seja o cabeçalho correto
  var hdr=['ID','Titulo','Cliente','Data','DataISO','DiaInteiro','HoraInicio','HoraFim','Responsavel','Descricao','CriadoEm'];
  if(sheet.getLastRow()===0){
    sheet.appendRow(hdr);
    sheet.getRange(1,1,1,hdr.length).setBackground('#1a4a7a').setFontColor('#fff').setFontWeight('bold').setFontSize(9);
    return;
  }
  // Se col A linha 1 não for exatamente 'ID', é um dado — inserir header antes
  var firstCell=String(sheet.getRange(1,1).getValue()||'').trim();
  if(firstCell!=='ID'){
    sheet.insertRowBefore(1);
    sheet.getRange(1,1,1,hdr.length).setValues([hdr]);
    sheet.getRange(1,1,1,hdr.length).setBackground('#1a4a7a').setFontColor('#fff').setFontWeight('bold').setFontSize(9);
    Logger.log('Header inserido na aba AgendaEventos — primeira linha era: '+firstCell);
  }
}

function apagarAgendaEvento(id){
  try{
    if(!id) return {success:false,error:'ID não informado'};
    var sheet=getOrCreateSheet('AgendaEventos');
    if(sheet.getLastRow()<2) return {success:false,error:'Nenhum evento encontrado'};
    var ids=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    var row=-1;
    for(var i=0;i<ids.length;i++){if(String(ids[i][0])===String(id)){row=i+2;break;}}
    if(row<0) return {success:false,error:'Evento não encontrado: '+id};
    sheet.deleteRow(row);
    SpreadsheetApp.flush();
    Logger.log('Evento apagado: '+id);
    return {success:true};
  }catch(e){Logger.log('apagarAgendaEvento err: '+e);return{success:false,error:e.toString()};}
}


function salvarAgendaEvento(dados){
  // Se dados.id existir → editar evento existente. Senão → criar novo.
  try{
    if(!dados||typeof dados!=='object') return {success:false,error:'Argumento inválido: '+JSON.stringify(dados)};
    var sheet=getOrCreateSheet('AgendaEventos');
    _garantirHeaderAgenda(sheet);

    if(dados.id){
      // EDITAR: buscar linha pelo ID
      var lastRow=sheet.getLastRow();
      if(lastRow<2) return {success:false,error:'Nenhum evento encontrado'};
      var ids=sheet.getRange(2,1,lastRow-1,1).getValues();
      var row=-1;
      for(var i=0;i<ids.length;i++){if(String(ids[i][0])===String(dados.id)){row=i+2;break;}}
      if(row<0) return {success:false,error:'Evento não encontrado: '+dados.id};
      sheet.getRange(row,2).setValue(dados.titulo||'');
      sheet.getRange(row,3).setValue(dados.cliente||'');
      sheet.getRange(row,4).setValue(dados.data||'');
      sheet.getRange(row,5).setValue(dados.dataISO||'');
      sheet.getRange(row,6).setValue(dados.diaInteiro||'Sim');
      sheet.getRange(row,7).setValue(dados.horaInicio||'');
      sheet.getRange(row,8).setValue(dados.horaFim||'');
      sheet.getRange(row,9).setValue(dados.responsavel||'');
      sheet.getRange(row,10).setValue(dados.descricao||'');
      SpreadsheetApp.flush();
      return {success:true,id:dados.id,editado:true};
    }

    // CRIAR NOVO
    var id='AG-'+new Date().getTime();
    sheet.appendRow([id,dados.titulo||'',dados.cliente||'',dados.data||'',dados.dataISO||'',dados.diaInteiro||'Não',dados.horaInicio||'',dados.horaFim||'',dados.responsavel||'',dados.descricao||'',dados.criadoEm||new Date().toLocaleString('pt-BR')]);
    SpreadsheetApp.flush();
    return {success:true,id:id};
  }catch(e){Logger.log('salvarAgendaEvento err: '+e);return{success:false,error:e.toString()};}
}

function salvarAgendaEventosBatch(lista){
  // Salva uma lista de eventos de uma vez — usado pela importação .ics
  try{
    if(!lista||!Array.isArray(lista)) return {success:false,salvos:0,erros:0,error:'Lista inválida: '+JSON.stringify(lista)};
    var sheet=getOrCreateSheet('AgendaEventos');
    _garantirHeaderAgenda(sheet);
    var salvos=0,erros=0;
    lista.forEach(function(dados){
      try{
        var id='AG-'+new Date().getTime()+'-'+Math.floor(Math.random()*9999);
        sheet.appendRow([id,dados.titulo||'',dados.cliente||'',dados.data||'',dados.dataISO||'',dados.diaInteiro||'Não',dados.horaInicio||'',dados.horaFim||'',dados.responsavel||'',dados.descricao||'',dados.criadoEm||new Date().toLocaleString('pt-BR')]);
        salvos++;
      }catch(e){erros++;}
    });
    SpreadsheetApp.flush();
    return {success:true,salvos:salvos,erros:erros};
  }catch(e){return{success:false,salvos:0,erros:lista.length,error:e.toString()};}
}


function editarAgendaEvento(dados){
  // dados = {id, titulo, cliente, data, dataISO, diaInteiro, horaInicio, horaFim, responsavel, descricao}
  try{
    if(!dados||typeof dados!=='object') return {success:false,error:'Argumento inválido: '+JSON.stringify(dados)};
    var sheet=getOrCreateSheet('AgendaEventos');
    if(sheet.getLastRow()<2) return {success:false,error:'Nenhum evento encontrado'};
    var ids=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    var row=-1;
    // Tentar por ID na coluna A
    for(var i=0;i<ids.length;i++){if(String(ids[i][0])===String(dados.id)){row=i+2;break;}}
    // Fallback: se ID é AG-ROW-N, usar o número da linha diretamente
    if(row<0 && String(dados.id).indexOf('AG-ROW-')===0){
      var rowNum=parseInt(String(dados.id).replace('AG-ROW-',''));
      if(rowNum>=2 && rowNum<=sheet.getLastRow()) row=rowNum;
    }
    if(row<0) return {success:false,error:'Evento não encontrado: '+dados.id};
    // Se linha não tem ID na col A, gravar o ID para futuras edições
    if(!sheet.getRange(row,1).getValue()){
      var newId='AG-'+new Date().getTime();
      sheet.getRange(row,1).setValue(newId);
    }
    sheet.getRange(row,2).setValue(dados.titulo||'');
    sheet.getRange(row,3).setValue(dados.cliente||'');
    sheet.getRange(row,4).setValue(dados.data||'');
    sheet.getRange(row,5).setValue(dados.dataISO||'');
    sheet.getRange(row,6).setValue(dados.diaInteiro||'Sim');
    sheet.getRange(row,7).setValue(dados.horaInicio||'');
    sheet.getRange(row,8).setValue(dados.horaFim||'');
    sheet.getRange(row,9).setValue(dados.responsavel||'');
    sheet.getRange(row,10).setValue(dados.descricao||'');
    SpreadsheetApp.flush();
    return {success:true};
  }catch(e){Logger.log('editarAgendaEvento err: '+e);return{success:false,error:e.toString()};}
}


function getAgendaEventosSalvos(){
  try{
    var sheet=getOrCreateSheet('AgendaEventos');
    if(sheet.getLastRow()<2) return [];
    var rows=sheet.getRange(2,1,sheet.getLastRow()-1,11).getValues();
    return rows.filter(function(r){return r[1]||r[0];}).map(function(r,i){
      // Se não tem ID (linha importada do GCal), gera um baseado no índice
      var rowId = r[0] ? String(r[0]) : ('AG-ROW-'+(i+2));
      return {id:rowId,titulo:String(r[1]||r[0]),cliente:String(r[2]||''),data:String(r[3]||''),dataISO:String(r[4]||''),diaInteiro:String(r[5]||'Sim'),horaInicio:String(r[6]||''),horaFim:String(r[7]||''),responsavel:String(r[8]||''),descricao:String(r[9]||''),criadoEm:String(r[10]||'')};
    }).sort(function(a,b){return a.dataISO<b.dataISO?-1:1;}).reverse();
  }catch(e){Logger.log('getAgendaEventosSalvos err: '+e);return[];}
}

// ════════════════════════════════════════════════════════════════
// IMPORTAR EVENTOS DO GOOGLE CALENDAR
// Usa CalendarApp nativo do Apps Script
// ════════════════════════════════════════════════════════════════
function importarEventosGoogleCalendar(dataIniStr, dataFimStr){
  try{
    var cal = CalendarApp.getCalendarById('carlosemichelon@gmail.com') ||
              CalendarApp.getDefaultCalendar();
    if(!cal) return {success:false, error:'Calendário não encontrado. Verifique as permissões do Apps Script.'};

    var ini = new Date(dataIniStr + 'T00:00:00');
    var fim = new Date(dataFimStr + 'T23:59:59');
    var eventos = cal.getEvents(ini, fim);

    var sheet = getOrCreateSheet('AgendaEventos');
    if(sheet.getLastRow()===0){
      sheet.appendRow(['ID','Titulo','Cliente','Data','DataISO','DiaInteiro','HoraInicio','HoraFim','Responsavel','Descricao','CriadoEm']);
    }

    // IDs existentes para evitar duplicatas
    var idsExistentes = {};
    if(sheet.getLastRow()>1){
      var ids = sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
      ids.forEach(function(r){ idsExistentes[String(r[0])] = true; });
    }

    var importados=0, duplicados=0;
    eventos.forEach(function(ev){
      var uid = 'GCAL-'+ev.getId().replace(/[^a-zA-Z0-9]/g,'').substring(0,20);
      if(idsExistentes[uid]){ duplicados++; return; }

      var diaInt = ev.isAllDayEvent();
      var dtIso = Utilities.formatDate(ev.getStartTime(), 'America/Sao_Paulo', 'yyyy-MM-dd');
      var dtLocal = Utilities.formatDate(ev.getStartTime(), 'America/Sao_Paulo', 'dd/MM/yyyy');
      var hrIni = diaInt ? '' : Utilities.formatDate(ev.getStartTime(), 'America/Sao_Paulo', 'HH:mm');
      var hrFim = diaInt ? '' : Utilities.formatDate(ev.getEndTime(), 'America/Sao_Paulo', 'HH:mm');

      sheet.appendRow([
        uid,
        ev.getTitle()||'',
        '', // cliente — não disponível no GCal
        dtLocal,
        dtIso,
        diaInt ? 'Sim' : 'Não',
        hrIni,
        hrFim,
        '', // responsável
        ev.getDescription()||'',
        new Date().toLocaleString('pt-BR')
      ]);
      idsExistentes[uid] = true;
      importados++;
    });

    SpreadsheetApp.flush();
    return {success:true, importados:importados, duplicados:duplicados};
  }catch(e){
    Logger.log('importarEventosGoogleCalendar err: '+e);
    return {success:false, error:e.toString()};
  }
}

// ════════════════════════════════════════════════════════════════
// 💰 DESPESAS GERAIS — salvar / ler / reembolso
// Cols: No | Data | Comprador | CNPJ | Fornecedor | Descricao |
//       Categoria | Valor | FormaPgto | Foto | SalvoEm | FotoVisual
// ════════════════════════════════════════════════════════════════
function getNextDespNum(){
  var sheet = getOrCreateSheet('Despesas');
  var last = sheet.getLastRow();
  if(last < 2) return 'DESP-001';
  var nums = sheet.getRange(2,1,last-1,1).getValues()
    .map(function(r){return parseInt((r[0]||'').toString().replace('DESP-',''))||0;});
  return 'DESP-' + String(Math.max.apply(null,nums)+1).padStart(3,'0');
}

function salvarDespesa(dados){
  try{
    var sheet = getOrCreateSheet('Despesas');
    // Criar cabeçalho se necessário
    if(sheet.getLastRow()===0){
      sheet.appendRow(['No','Data','Comprador','CNPJ','Fornecedor','Descricao',
                       'Categoria','Valor','FormaPgto','Foto','SalvoEm','Assinatura','FotoVisual','AssinaturaVisual','Reembolsado']);
    }
    var num = getNextDespNum();
    var fotoUrl = '';
    // Upload foto se houver (aceita base64 puro ou data URL completo)
    if(dados.fotoB64 && dados.fotoB64.length > 10){
      var b64Foto = dados.fotoB64.indexOf('data:')===0 ? dados.fotoB64.split(',')[1] : dados.fotoB64;
      var mime  = dados.fotoMime || 'image/jpeg';
      // Forçar jpeg para compatibilidade de visualização no Drive
      if(mime==='image/heic'||mime==='image/heif') mime='image/jpeg';
      var bytes = Utilities.base64Decode(b64Foto);
      var blob  = Utilities.newBlob(bytes, mime, num+'_nota.jpg');
      var folder = DriveApp.getRootFolder();
      var file  = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      // Usar URL de visualização que abre no browser (não faz download)
      fotoUrl = 'https://drive.google.com/file/d/' + file.getId() + '/view';
    }
    // Upload assinatura se houver
    var sigUrl = '';
    if(dados.assinatura && dados.assinatura.length > 10){
      var b64Sig = dados.assinatura.indexOf('data:')===0 ? dados.assinatura.split(',')[1] : dados.assinatura;
      sigUrl = uploadSignatureToDrive('data:image/jpeg;base64,'+b64Sig, num);
    }
    var assinaturaUrl = sigUrl;
    var now = new Date().toLocaleString('pt-BR');
    var row = [
      num, dados.data||'', dados.comprador||'', dados.cnpj||'',
      dados.fornecedor||'', dados.descricao||'', dados.categoria||'',
      parseFloat(dados.valor)||0, dados.formaPgto||'',
      fotoUrl, now, assinaturaUrl,
      fotoUrl ? '=IMAGE("'+fotoUrl+'")' : '',
      assinaturaUrl ? '=IMAGE("'+assinaturaUrl+'")' : '',
      'Não' // Reembolsado
    ];
    sheet.appendRow(row);
    return {success:true, num:num};
  }catch(e){
    Logger.log('salvarDespesa err: '+e);
    return {success:false, error:e.toString()};
  }
}

// ════════════════════════════════════════════════════════════════
// ATIVIDADES SALESFORCE

// GET DESPESAS — retorna lista de despesas da planilha
// ════════════════════════════════════════════════════════════════
function getDespesas(){
  try{
    var sheet=getOrCreateSheet('Despesas');
    if(sheet.getLastRow()<2) return [];
    var ncols=Math.min(sheet.getLastColumn(),15);
    var rows=sheet.getRange(2,1,sheet.getLastRow()-1,ncols).getValues();
    return rows.filter(function(r){return r[0];}).map(function(r){
      return {
        num:String(r[0]),data:String(r[1]),comprador:String(r[2]),
        cnpj:String(r[3]),fornecedor:String(r[4]),descricao:String(r[5]),
        categoria:String(r[6]),valor:parseFloat(r[7])||0,
        formaPgto:String(r[8]),fotoUrl:String(r[9]),salvoEm:String(r[10]),
        assinaturaUrl:r[11]?String(r[11]):'',
        reembolsado:r[14]?String(r[14]):'Não'
      };
    }).reverse();
  }catch(e){Logger.log('getDespesas err: '+e);return[];}
}

// ════════════════════════════════════════════════════════════════
// MARCAR REEMBOLSO — atualiza col 15 (Reembolsado) na aba Despesas

// ════════════════════════════════════════════════════════════════
function marcarReembolso(num, status){
  try{
    var sheet=getOrCreateSheet('Despesas');
    if(sheet.getLastRow()<2) return {success:false,error:'Sem dados'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(num)){
        sheet.getRange(i+2,15).setValue(status||'Não');
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'Despesa não encontrada'};
  }catch(e){Logger.log('marcarReembolso err: '+e);return{success:false,error:e.toString()};}
}

// ════════════════════════════════════════════════════════════════
// AGENDA INTERNA

// ════════════════════════════════════════════════════════════════
// 🚗 DESP. VEÍCULOS — Gestao de Veiculos
// VEÍCULOS  ("Gestao de Veiculos")
// ════════════════════════════════════════════════════════════════
function getNextVeiNum(){
  var sheet=getSheet('Gestao de Veiculos');
  if(!sheet) return 'VM-001';
  var last=sheet.getLastRow();
  if(last<2) return 'VM-001';
  var nums=sheet.getRange(2,1,last-1,1).getValues();
  var maxN=0;
  nums.forEach(function(r){var m=String(r[0]||'').match(/\d+/);if(m)maxN=Math.max(maxN,parseInt(m[0]));});
  return 'VM-'+String(maxN+1).padStart(3,'0');
}

function salvarManutencao(dados){
  try{
    var sheet=getOrCreateSheet('Gestao de Veiculos');
    var num=getNextVeiNum();
    // Ordem das colunas: No | Data | Veiculo | Tipo | Tecnico | Hodometro | Valor | Descricao | Assinatura | Salvo em
    var sigB64=dados.assinatura&&dados.assinatura.indexOf('data:')===0?dados.assinatura:'';
    if(sigB64.length>400000){sigB64='';}
    var newRow=sheet.getLastRow()+1;
    sheet.appendRow([
      num, dados.data||'', dados.veiculo||'', dados.tipo||'',
      dados.tecnico||'', parseFloat(dados.hodometro)||0,
      parseFloat(dados.valor)||0, dados.descricao||'',
      sigB64,                              // Assinatura (base64 texto)
      new Date().toLocaleString('pt-BR')   // Salvo em
    ]);
    // Col K (11) = =IMAGE() visual para a planilha
    if(sigB64){
      var driveUrl=uploadSignatureToDrive(sigB64,num);
      if(driveUrl) sheet.getRange(newRow,11).setFormula('=IMAGE("'+driveUrl+'")');
    }
    SpreadsheetApp.flush();
    return {success:true,num:num};
  }catch(e){return{success:false,error:e.toString()};}
}

function getManutencoes(){
  try{
    var sheet=getSheet('Gestao de Veiculos');
    if(!sheet||sheet.getLastRow()<2) return [];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,10).getValues();
    return data.filter(function(r){return r[0];}).map(function(r){
      var fmtD=function(d){return d instanceof Date?Utilities.formatDate(d,'America/Sao_Paulo','dd/MM/yyyy'):String(d||'');};
      // Ordem colunas: No | Data | Veiculo | Tipo | Tecnico | Hodometro | Valor | Descricao | Assinatura | Salvo em
      var sig=String(r[8]||'');
      var sigUrl='';
      if(sig.indexOf('data:image')===0){
        sigUrl='HAS_SIG'; // base64 na célula — carregado por getAssinaturaVei()
      } else if(sig.indexOf('http')===0||sig.indexOf('=IMAGE')===0){
        sigUrl=sig;       // URL Drive (visual) ou legado
      }
      return {num:String(r[0]),data:fmtD(r[1]),veiculo:String(r[2]||''),
        tipo:String(r[3]||''),tecnico:String(r[4]||''),
        hodometro:parseFloat(r[5])||0,valor:parseFloat(r[6])||0,descricao:String(r[7]||''),
        sigUrl:sigUrl};
    });
  }catch(e){return [];}
}

// ── Retorna mapa {numVM: base64} para assinaturas de veículos ─────────────────
function getAssinaturaVei(nums){
  try{
    var sheet=getSheet('Gestao de Veiculos');
    if(!sheet||sheet.getLastRow()<2) return {};
    var arr=Array.isArray(nums)?nums:[nums];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,9).getValues(); // cols A-I
    var result={};
    data.forEach(function(r){
      var n=String(r[0]||'');
      if(arr.indexOf(n)<0) return;
      var sig=String(r[8]||'');
      if(sig.indexOf('data:image')===0||sig.indexOf('http')===0) result[n]=sig;
    });
    return result;
  }catch(e){Logger.log('getAssinaturaVei err: '+e);return {};}
}

// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// ☑️ CHECKLIST SEMANAL DE VEÍCULOS
function getItensSemanal(){
  try{
    var sheet=getSheet('Veiculos Semanal');
    if(!sheet||sheet.getLastRow()<3) return [];

    var lastCol=sheet.getLastColumn();
    var lastRow=sheet.getLastRow();

    // Linha 2 = cabeçalhos reais (linha 1 é título mesclado)
    var headers=sheet.getRange(2,1,1,lastCol).getValues()[0].map(function(h){
      return String(h||'').trim();
    });

    // Linhas 3+ = itens template
    var data=sheet.getRange(3,1,lastRow-2,lastCol).getValues();

    // Mapa dinâmico: acha índice da coluna pelo nome (sem acento, case-insensitive)
    function norm(s){ return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }
    function colIdx(nome){
      var n=norm(nome);
      for(var i=0;i<headers.length;i++){
        var h=norm(headers[i]);
        if(h===n||h.indexOf(n)===0||n.indexOf(h)===0) return i;
      }
      return -1;
    }

    var iNum=colIdx('#');
    var iSist=colIdx('sistema');
    var iItem=colIdx('item');
    var iAcao=colIdx('acao');
    var iVei=colIdx('veiculo');
    var iData=colIdx('data');
    var iKm=colIdx('km');
    var iTec=colIdx('tecnico');
    var iStatus=colIdx('status');
    var iOk=colIdx('ok');
    var iProb=colIdx('problema');
    var iObs=colIdx('observa');

    Logger.log('Headers detectados: '+JSON.stringify(headers));
    Logger.log('Indices: #='+iNum+' Sist='+iSist+' Item='+iItem+' Acao='+iAcao+
               ' Vei='+iVei+' Data='+iData+' KM='+iKm+' Tec='+iTec+
               ' Status='+iStatus+' OK='+iOk+' Prob='+iProb+' Obs='+iObs);

    function fmtD(v){
      if(!v) return '';
      if(v instanceof Date) return Utilities.formatDate(v,'America/Sao_Paulo','dd/MM/yyyy');
      return String(v);
    }
    function get(r,i){ return i>=0?String(r[i]||'').trim():''; }

    // Usa índice 0,1,2,3 como fallback se cabeçalhos não forem detectados
    var n0=iNum>=0?iNum:0, n1=iSist>=0?iSist:1, n2=iItem>=0?iItem:2, n3=iAcao>=0?iAcao:3;

    return data
      .filter(function(r){ return r[n0]||r[n1]||r[n2]; })
      .map(function(r){
        return {
          num     : get(r,n0),
          sistema : get(r,n1),
          item    : get(r,n2),
          acao    : get(r,n3),
          veiculo : get(r,iVei),
          data    : fmtD(iData>=0?r[iData]:''),
          km      : iKm>=0?parseFloat(r[iKm])||0:0,
          tecnico : get(r,iTec),
          status  : get(r,iStatus),
          ok      : get(r,iOk),
          problema: get(r,iProb),
          obs     : get(r,iObs)
        };
      });
  }catch(e){Logger.log('getItensSemanal err: '+e);return [];}
}

function salvarChecklistSemanal(dados){
  // dados = {veiculo, data, km, tecnico, itens:[{num,sistema,item,acao,ok,problema,obs,dano}]}
  try{
    var sheet=getOrCreateSheet('Checklist_Log');
    if(sheet.getLastRow()<1){
      var hdr=['#','Sistema','Item de Verificacao','Acao','Veiculo','Data','KM Atual',
               'Tecnico','Status','OK','Problema','Observacao',
               'Dano (Batidas/Arranhoes/Amassados)','Salvo em'];
      sheet.appendRow(hdr);
      sheet.getRange(1,1,1,hdr.length)
        .setBackground('#1A6B2A').setFontColor('#fff').setFontWeight('bold').setFontSize(9);
    }
    var savedAt=new Date().toLocaleString('pt-BR');
    dados.itens.forEach(function(it){
      sheet.appendRow([
        it.num, it.sistema, it.item, it.acao,
        dados.veiculo||'', dados.data||'',
        parseFloat(dados.km)||0, dados.tecnico||'',
        it.ok?'OK':'Problema',
        it.ok?'✓':'✗',
        it.problema||'', it.obs||'',
        it.dano||'',
        savedAt
      ]);
    });
    SpreadsheetApp.flush();
    return {success:true};
  }catch(e){return{success:false,error:e.toString()};}
}

function getHistoricoChecklist(veiculo){
  // Retorna as últimas sessões do log (agrupado por Salvo em + Veiculo)
  try{
    var sheet=getSheet('Checklist_Log');
    if(!sheet||sheet.getLastRow()<2) return [];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,17).getValues();
    // filtra por veículo se informado
    if(veiculo) data=data.filter(function(r){return String(r[4]||'')=== veiculo;});
    // agrupa por Salvo em (col 13 = índice 12) + Veiculo (col 5 = índice 4)
    var sessions={};
    data.forEach(function(r){
      var key=String(r[13]||'')+'__'+String(r[4]||'');
      if(!sessions[key]){
        sessions[key]={salvEM:String(r[13]||''),veiculo:String(r[4]||''),data:String(r[5]||''),
          km:parseFloat(r[6])||0,tecnico:String(r[7]||''),
          ok:0,prob:0,itens:[]};
      }
      sessions[key].itens.push({num:r[0],sistema:r[1],item:r[2],status:r[8],obs:r[11]||'',dano:String(r[12]||'')});
      if(String(r[8])==='OK') sessions[key].ok++; else sessions[key].prob++;
    });
    return Object.values(sessions).sort(function(a,b){return b.salvEM.localeCompare(a.salvEM);}).slice(0,20);
  }catch(e){Logger.log('getHistoricoChecklist: '+e);return [];}
}

// ════════════════════════════════════════════════════════════════
// AGENDA — agendamentos vão direto para o Google Calendar via URL.
// Aba "Agenda" não é mais criada nem usada.
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// DIAGNÓSTICO — rode UMA VEZ no editor para descobrir colunas
// Selecione diagnosticarVeiculosSemanal → ▶ Executar → ver Logs
// ════════════════════════════════════════════════════════════════
function diagnosticarVeiculosSemanal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Veiculos Semanal');
  if (!sheet) { Logger.log('ABA NAO ENCONTRADA: Veiculos Semanal'); return; }

  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  Logger.log('=== Veiculos Semanal ===');
  Logger.log('Colunas (' + lastCol + '): ' + JSON.stringify(headers));
  Logger.log('Total de linhas de dados: ' + (lastRow - 1));

  if (lastRow >= 2) {
    var sample = sheet.getRange(2, 1, Math.min(2, lastRow - 1), lastCol).getValues();
    Logger.log('Exemplo linha 1: ' + JSON.stringify(sample[0]));
    if (sample[1]) Logger.log('Exemplo linha 2: ' + JSON.stringify(sample[1]));
  }
}

// ════════════════════════════════════════════════════════════════
// EXPORTAR TUDO — chamado pelo HTML online via google.script.run

// ════════════════════════════════════════════════════════════════
// 📣 MARKETING E EVENTOS
// Abas: Eventos | Campanhas | Leads
// ════════════════════════════════════════════════════════════════
var _mktSheets = {
  eventos:   {nome:'Eventos',   cab:['Data','Nome','Local','Publico','Responsavel','Resultado','Obs','CriadoEm']},
  campanhas: {nome:'Campanhas', cab:['Nome','Canal','Orcamento','Status','Responsavel','Obs','CriadoEm']},
  leads:     {nome:'Leads',     cab:['Nome','Telefone','Interesse','Status','Responsavel','Obs','CriadoEm']},
  links:     {nome:'LinksInspiracao', cab:['URL','Descricao','Categoria','Fonte','Obs','CriadoEm']}
};

function salvarMarketing(sec, dados){
  try{
    var cfg=_mktSheets[sec];
    if(!cfg) return {success:false,error:'Secao desconhecida: '+sec};
    var sheet=getOrCreateSheet(cfg.nome);
    if(sheet.getLastRow()===0) sheet.appendRow(cfg.cab);
    var row=cfg.cab.slice(0,-1).map(function(c){ return dados[c.toLowerCase().replace(/[^a-z]/g,'')]||dados[c.toLowerCase()]||''; });
    row.push(dados.criadoEm||new Date().toLocaleString('pt-BR'));
    sheet.appendRow(row);
    return {success:true};
  }catch(e){Logger.log('salvarMarketing err: '+e);return{success:false,error:e.toString()};}
}

function getMarketing(sec){
  try{
    var cfg=_mktSheets[sec];
    if(!cfg) return [];
    var sheet=getOrCreateSheet(cfg.nome);
    if(sheet.getLastRow()<2) return [];
    var rows=sheet.getRange(2,1,sheet.getLastRow()-1,cfg.cab.length).getValues();
    return rows.filter(function(r){return r[0];}).map(function(r){
      var obj={};
      cfg.cab.forEach(function(c,i){ obj[c.toLowerCase().replace(/[^a-z]/g,'')]=String(r[i]||''); });
      return obj;
    });
  }catch(e){Logger.log('getMarketing err: '+e);return[];}
}

// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// ➕ NOVA OS — Ordens de Servico
// ORDENS DE SERVIÇO  ("Ordens de Servico")
// Cols: No,Data,Cliente,Tecnico,Veiculo,Km Veiculo,Km Percorrida,
//       Horas,Tipo,Mao de Obra,Deslocamento,Total,Descricao,
//       Assinatura,Fotos,Salvo em,Paga,Numero do Caso,Numero Nota CS,
//       AssinaturaVisual(=IMAGE),FotoVisual(=IMAGE)
// ════════════════════════════════════════════════════════════════
function getNextOSNum(){
  var sheet=getSheet('Ordens de Servico');
  if(!sheet) return 'OS-001';
  var last=sheet.getLastRow();
  if(last<2) return 'OS-001';
  var nums=sheet.getRange(2,1,last-1,1).getValues();
  var maxN=0;
  nums.forEach(function(r){
    var m=String(r[0]||'').match(/\d+/);
    if(m) maxN=Math.max(maxN,parseInt(m[0]));
  });
  return 'OS-'+String(maxN+1).padStart(3,'0');
}

function salvarOrdem(dados){
  try{
    var sheet=getOrCreateSheet('Ordens de Servico');
    var num=getNextOSNum();
    var rates={Garantia:{vh:90,vk:1.9},Cliente:{vh:220,vk:3.1},'Cortesia/Comercial':{vh:120,vk:0},'Contrato Fechado':{vh:220,vk:3.1}};
    var r=rates[dados.tipo]||rates.Cliente;
    var h=parseFloat(dados.horas)||0, km=parseFloat(dados.quilometragem)||0;
    var mo=Math.round(h*r.vh*100)/100, desl=Math.round(km*r.vk*100)/100;
    var total=mo+desl;

    // Col N = base64 como texto (para o HTML ler via getAssinaturas)
    var sigB64=dados.assinatura&&dados.assinatura.indexOf('data:')===0?dados.assinatura:'';
    // Limita tamanho (Sheets suporta até ~50k chars por célula)
    if(sigB64.length>400000){Logger.log('Sig muito grande, rejeitada');sigB64='';}

    var newRow=sheet.getLastRow()+1;
    sheet.appendRow([
      num,                    // A No
      dados.data||'',         // B Data
      dados.cliente||'',      // C Cliente
      dados.tecnico||'',      // D Tecnico
      dados.veiculo||'',      // E Veiculo
      dados.kmVeiculo||'',    // F Km Veiculo
      km,                     // G Km Percorrida
      h,                      // H Horas
      dados.tipo||'',         // I Tipo
      mo,                     // J Mao de Obra
      desl,                   // K Deslocamento
      total,                  // L Total
      dados.descricao||'',    // M Descricao
      sigB64,                 // N Assinatura (base64 texto — HTML lê aqui)
      dados.fotos||'',        // O Fotos (links texto)
      new Date().toLocaleString('pt-BR'), // P Salvo em
      false,                  // Q Paga
      dados.numCaso||dados.salesforce||'', // R Numero do Caso
      dados.notaCS||'',       // S Numero Nota CS
      '',                      // T AssinaturaVisual (=IMAGE() preenchido abaixo)
      '',                     // U PrimeiraFotoVisual
      '',                     // V EventoAgendaID
      ''                      // W OrcamentoVinculado
    ]);

    // Col T (20) = =IMAGE("url") assinatura visual na planilha (não usada pelo HTML)
    if(sigB64){
      var driveUrl=uploadSignatureToDrive(sigB64,num);
      if(driveUrl){
        sheet.getRange(newRow,20).setFormula('=IMAGE("'+driveUrl+'")');
        sheet.setRowHeight(newRow,80);
        // Col U (21) = =IMAGE() da primeira foto (se houver)
        var primeiraFoto=normalizarPrimeiraFoto(dados.fotos||'');
        if(primeiraFoto) sheet.getRange(newRow,21).setFormula('=IMAGE("'+primeiraFoto+'")');
      }
    }

    SpreadsheetApp.flush();
    return {success:true,num:num};
  }catch(e){return{success:false,error:e.toString()};}
}

// ── Upload assinatura para o Drive — retorna URL pública para =IMAGE() ───────
function uploadSignatureToDrive(b64,num){
  try{
    var matches=b64.match(/^data:([^;]+);base64,(.+)$/);
    if(!matches) return '';
    var mime=matches[1];
    var bytes=Utilities.base64Decode(matches[2]);
    var blob=Utilities.newBlob(bytes,mime,'sig_'+num+'.jpg');
    var folders=DriveApp.getFoldersByName('Juliomaq_Assinaturas');
    var folder=folders.hasNext()?folders.next():DriveApp.createFolder('Juliomaq_Assinaturas');
    var file=folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
    return 'https://drive.google.com/uc?export=view&id='+file.getId();
  }catch(e){Logger.log('uploadSignatureToDrive: '+e);return '';}
}

// ── Normaliza primeira foto para formato compatível com =IMAGE() ─────────────
function normalizarPrimeiraFoto(fotos){
  if(!fotos) return '';
  var links=fotos.split(',').map(function(l){return l.trim();}).filter(Boolean);
  if(!links.length) return '';
  var link=links[0];
  var m=link.match(/\/file\/d\/([^\/]+)\//);
  if(m) return 'https://drive.google.com/uc?export=view&id='+m[1];
  if(link.indexOf('uc?')>=0) return link;
  return link;
}

// ── Upload foto base64 do offline para Drive (usado no import) ───────────────
function uploadFotoImport(b64,mimeType,numOS,nome){
  try{
    var matches=b64.match(/^data:([^;]+);base64,(.+)$/);
    var mime=matches?matches[1]:(mimeType||'image/jpeg');
    var raw=matches?matches[2]:b64;
    var bytes=Utilities.base64Decode(raw);
    var blob=Utilities.newBlob(bytes,mime,nome||('foto_'+numOS+'.jpg'));
    var folders=DriveApp.getFoldersByName('Juliomaq_Fotos');
    var folder=folders.hasNext()?folders.next():DriveApp.createFolder('Juliomaq_Fotos');
    var file=folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
    return {success:true,url:'https://drive.google.com/uc?export=view&id='+file.getId()};
  }catch(e){Logger.log('uploadFotoImport: '+e);return {success:false,error:e.toString()};}
}

// ── Adiciona URL de foto na col O de uma OS (e atualiza visual col U) ────────
function adicionarFotoOS(numOS,url){
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet||sheet.getLastRow()<2) return {success:false};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(numOS)){
        var fotoCell=sheet.getRange(i+2,15); // col O
        var existing=String(fotoCell.getValue()||'').replace(/\n/g,',').trim();
        var newVal=existing?existing+','+url:url;
        fotoCell.setValue(newVal);
        // Atualiza col U (21) com imagem visual da primeira foto
        var first=newVal.split(',')[0].trim();
        if(first) sheet.getRange(i+2,21).setFormula('=IMAGE("'+first+'")');
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'OS nao encontrada: '+numOS};
  }catch(e){return {success:false,error:e.toString()};}
}

// ── Recebe base64 do HTML, faz upload ao Drive e grava link na OS ────────────
// dados = { numOS, nome, tipo, dados } — "dados" é base64 puro (sem data:... prefixo)
function salvarMidia(dados){
  try{
    if(!dados||!dados.dados) return {success:false,error:'Dados ausentes'};
    var mime  = dados.tipo||'image/jpeg';
    var nome  = dados.nome||('foto_'+dados.numOS+'_'+Date.now()+'.jpg');
    var bytes = Utilities.base64Decode(dados.dados);
    var blob  = Utilities.newBlob(bytes,mime,nome);

    var folders=DriveApp.getFoldersByName('Juliomaq_Fotos');
    var folder =folders.hasNext()?folders.next():DriveApp.createFolder('Juliomaq_Fotos');
    var file   =folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);

    var url='https://drive.google.com/uc?export=view&id='+file.getId();
    Logger.log('salvarMidia: '+nome+' → '+url);
    return adicionarFotoOS(dados.numOS,url);
  }catch(e){
    Logger.log('salvarMidia err: '+e);
    return {success:false,error:e.toString()};
  }
}

// ── Retorna mapa {numOS: base64} — leitura simples de col N (sem getFormulas) ─
function getAssinaturas(nums){
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet||sheet.getLastRow()<2) return {};
    var arr=Array.isArray(nums)?nums:[nums];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,14).getValues();
    var result={};
    data.forEach(function(r){
      var n=String(r[0]||'');
      if(arr.indexOf(n)<0) return;
      var sig=String(r[13]||'');
      // Aceita base64 (novo) e URLs http (legado Drive)
      if(sig.indexOf('data:image')===0||sig.indexOf('http')===0) result[n]=sig;
    });
    return result;
  }catch(e){Logger.log('getAssinaturas err: '+e);return {};}
}

function getOrdens(){
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet||sheet.getLastRow()<2) return [];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,25).getValues();
    // Sem getFormulas() — col N armazena base64/URL como texto simples
    var fmtD=function(d){
      if(!d) return '';
      if(d instanceof Date) return Utilities.formatDate(d,'America/Sao_Paulo','dd/MM/yyyy');
      var s=String(d);
      var iso=s.match(/(\d{4}-\d{2}-\d{2})/);
      if(iso){var p=iso[1].split('-');return p[2]+'/'+p[1]+'/'+p[0];}
      var br=s.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if(br) return br[0];
      return s.length>10?s.substring(0,10):s;
    };
    var result=[];
    for(var i=0;i<data.length;i++){
      var r=data[i];
      if(!r[0]) continue;
      var rawSig=String(r[13]||'');
      var sigUrl='';
      if(rawSig.indexOf('data:image')===0){
        sigUrl='HAS_SIG'; // base64 na célula — carregado por getAssinaturas()
      } else if(rawSig.indexOf('http')===0){
        sigUrl=rawSig;    // URL Drive legado — usa diretamente
      }
      result.push({
        num:String(r[0]),data:fmtD(r[1]),cliente:String(r[2]||''),
        tecnico:String(r[3]||''),veiculo:String(r[4]||''),kmVeiculo:String(r[5]||''),
        km:parseFloat(r[6])||0,horas:parseFloat(r[7])||0,tipo:String(r[8]||''),
        vHora:parseFloat(r[9])||0,vKm:parseFloat(r[10])||0,vTotal:parseFloat(r[11])||0,
        descricao:String(r[12]||''),sigUrl:sigUrl,fotos:String(r[14]||''),
        salvo:String(r[15]||''),paga:!!r[16],
        salesforce:String(r[17]||''),notaCS:String(r[18]||''),numCaso:String(r[17]||''),eventoAgendaId:String(r[21]||''),orcamentoVinculado:String(r[22]||''),numNFS:String(r[23]||'')
      });
    }
    return result;
  }catch(e){Logger.log('getOrdens err: '+e);return [];}
}

function marcarOSPaga(num){
  try{
    var s=getSheet('Ordens de Servico');
    if(!s) return {success:false};
    var rows=s.getRange(2,1,s.getLastRow()-1,17).getValues();
    for(var i=0;i<rows.length;i++){
      if(String(rows[i][0])===String(num)){
        s.getRange(i+2,17).setValue(!rows[i][16]);
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false};
  }catch(e){return{success:false};}
}

function atualizarCampoOS(num,campo,valor){
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet) return {success:false};
    var colMap={salesforce:18,numCaso:18,notaCS:19,csStatus:20,paga:17,numNFS:24};
    var last=sheet.getLastRow();
    var nums=sheet.getRange(2,1,last-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(num)){
        var col=colMap[campo];
        if(!col) return {success:false,error:'Campo desconhecido: '+campo};
        sheet.getRange(i+2,col).setValue(valor||'');
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'OS não encontrada: '+num};
  }catch(e){return{success:false,error:e.toString()};}
}

// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// 📋 RESUMO OS — utilitários de leitura de cabeçalhos
// PLANO DE VENDAS — escreve na aba "Prospeccao" (GID 940023173)
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// LEITURA DE CABEÇALHOS — lê dinamicamente todas as abas
// Substitui as antigas atualizarCabecalho* (que escreviam cabeçalhos fixos).
// Retorna objeto { nomeAba: { headers:[], lastRow:N, lastCol:N, gid:N } }
// Chamável pelo menu ⚙ Juliomaq → Ver Cabeçalhos, ou via google.script.run
// ════════════════════════════════════════════════════════════════
function lerTodosCabecalhos(){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  var sheets=ss.getSheets();
  var result={};

  sheets.forEach(function(sheet){
    var name=sheet.getName();
    var lastRow=sheet.getLastRow();
    var lastCol=sheet.getLastColumn();
    var headers=[];
    if(lastRow>=1&&lastCol>=1){
      headers=sheet.getRange(1,1,1,lastCol).getValues()[0].map(function(h){
        return String(h||'').trim();
      });
    }
    result[name]={
      headers    : headers,
      lastRow    : lastRow,
      lastCol    : lastCol,
      gid        : sheet.getSheetId(),
      linhasDados: Math.max(0,lastRow-1)
    };
  });

  // Log resumido para o editor
  Object.keys(result).forEach(function(name){
    var s=result[name];
    Logger.log('['+name+'] cols='+s.lastCol+' linhas='+s.linhasDados+
               ' | '+JSON.stringify(s.headers));
  });

  // Toast ao rodar pelo menu
  try{
    ss.toast(Object.keys(result).length+' abas lidas. Veja os Logs para detalhes.','Juliomaq ✓',5);
  }catch(e){}

  return result;
}

// Alias para o menu
function verCabecalhosPlanilha(){ return lerTodosCabecalhos(); }

// ════════════════════════════════════════════════════════════════
// ATUALIZAR PLANILHA COMPLETA — recria abas de gestão/calendário
// Execute via menu ⚙ Juliomaq → Atualizar TUDO
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// CHECKLIST SEMANAL DE VEÍCULOS  ("Veiculos Semanal" → log em "Checklist_Log")
// Linha 1 = título mesclado, Linha 2 = cabeçalhos, Linhas 3+ = itens template
// Cols: # | Sistema | Item de Verificação | Ação | Veiculo | Data | KM Atual
//       | Técnico | Status | OK | Problema | Observação
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// ☁️ SALESFORCE — Garantia + Atividades
// GARANTIA  ("Garantia")
// Leitura dinâmica — não depende da ordem das colunas na planilha
// ════════════════════════════════════════════════════════════════

// ── Helper: normaliza string para comparação (sem acento, minúsculo) ──
function _normCol(s){
  return String(s||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]/g,' ').replace(/\s+/g,' ').trim();
}

// ── Lê cabeçalhos da linha 1 e retorna mapa {chave: índice_0based} ──
function _garColMap(sheet){
  var lastCol=sheet.getLastColumn();
  var raw=sheet.getRange(1,1,1,lastCol).getValues()[0];
  var map={};
  raw.forEach(function(h,i){ if(h) map[_normCol(h)]=i; });
  return {map:map, headers:raw, count:lastCol};
}

// ── Busca índice pelo nome (parcial) ──
function _garIdx(map,termo){
  var t=_normCol(termo);
  // Exato
  if(map[t]!==undefined) return map[t];
  // Começa com
  var keys=Object.keys(map);
  for(var i=0;i<keys.length;i++){
    if(keys[i].indexOf(t)===0||t.indexOf(keys[i])===0) return map[keys[i]];
  }
  return -1;
}

function diagnosticarGarantia(){
  var sheet=getSheet('Garantia');
  if(!sheet){Logger.log('ABA NAO ENCONTRADA: Garantia');return;}
  var info=_garColMap(sheet);
  Logger.log('=== Aba Garantia ===');
  Logger.log('Total colunas: '+info.count);
  Logger.log('Cabecalhos: '+JSON.stringify(info.headers));
  Logger.log('Total linhas de dados: '+(sheet.getLastRow()-1));
  if(sheet.getLastRow()>=2){
    var s2=sheet.getRange(2,1,Math.min(2,sheet.getLastRow()-1),info.count).getValues();
    Logger.log('Linha 2: '+JSON.stringify(s2[0]));
    if(s2[1]) Logger.log('Linha 3: '+JSON.stringify(s2[1]));
  }
  // Mostra índice de cada campo esperado
  var m=info.map;
  var campos=['cliente','numero de serie','nota cs','nota cs sap','descricao',
              'data abertura','situacao','data tpr','nota cs tpr','o que falta','status','obs'];
  campos.forEach(function(c){
    Logger.log('  "'+c+'" → col '+(_garIdx(m,c)+1)+' (idx '+_garIdx(m,c)+')');
  });
}

function getGarantias(){
  try{
    var sheet=getSheet('Garantia');
    if(!sheet||sheet.getLastRow()<2) return [];

    var info=_garColMap(sheet);
    var m=info.map;

    // Índices com os nomes reais da planilha (diagnóstico 2026-04)
    var iDataPeca  = _garIdx(m,'data cs peca');      if(iDataPeca<0)  iDataPeca=0;
    var iCli       = _garIdx(m,'cliente');            if(iCli<0)       iCli=1;
    var iNSerie    = _garIdx(m,'n serie');            if(iNSerie<0)    iNSerie=2;
    var iOT        = _garIdx(m,'ordem de trabalho'); if(iOT<0)        iOT=3;
    var iCS        = _garIdx(m,'nota cs');            if(iCS<0)        iCS=4;
    var iSAP       = _garIdx(m,'nota cs sap');        if(iSAP<0)       iSAP=5;
    var iDesc      = _garIdx(m,'descricao');          if(iDesc<0)      iDesc=6;
    var iPeca      = _garIdx(m,'peca');               if(iPeca<0)      iPeca=7;
    var iSitPeca   = _garIdx(m,'situacao cs peca');   if(iSitPeca<0)   iSitPeca=8;
    var iDataServ  = _garIdx(m,'data cs servico');    if(iDataServ<0)  iDataServ=9;
    var iCSServ    = _garIdx(m,'nota cs servico');    if(iCSServ<0)    iCSServ=10;
    var iSitServ   = _garIdx(m,'situacao nota cs');   if(iSitServ<0)   iSitServ=11;
    var iValor     = _garIdx(m,'valor recebido');     if(iValor<0)     iValor=12;
    var iStatus    = _garIdx(m,'status');             if(iStatus<0)    iStatus=13;
    var iObs       = _garIdx(m,'obs');                if(iObs<0)       iObs=14;
    var iOTVerif   = _garIdx(m,'ot a verificar');     if(iOTVerif<0)   iOTVerif=16;

    Logger.log('Garantia indices: dataPeca='+iDataPeca+' cli='+iCli+' nSerie='+iNSerie+
               ' ot='+iOT+' cs='+iCS+' sap='+iSAP+' desc='+iDesc+' peca='+iPeca+
               ' sitPeca='+iSitPeca+' dataServ='+iDataServ+' csServ='+iCSServ+
               ' sitServ='+iSitServ+' valor='+iValor+' status='+iStatus+' obs='+iObs);

    var data=sheet.getRange(2,1,sheet.getLastRow()-1,info.count).getValues();
    var fmt=function(d){
      if(!d) return '';
      if(d instanceof Date) return Utilities.formatDate(d,'America/Sao_Paulo','dd/MM/yyyy');
      var s=String(d);
      var iso=s.match(/(\d{4}-\d{2}-\d{2})/);
      if(iso){var p=iso[1].split('-');return p[2]+'/'+p[1]+'/'+p[0];}
      return s;
    };
    function get(r,i){ return i>=0?String(r[i]||'').trim():''; }
    function num(r,i){ return i>=0?parseFloat(r[i])||0:0; }

    return data.filter(function(r){return r[iCli]||r[iCS];}).map(function(r){
      return {
        dataCSPeca   : fmt(r[iDataPeca]),
        cliente      : get(r,iCli),
        nSerie       : get(r,iNSerie),
        ordemTrabalho: get(r,iOT),
        notaCS       : get(r,iCS),
        notaCS_SAP   : get(r,iSAP),
        descricao    : get(r,iDesc),
        peca         : get(r,iPeca),
        sitCSPeca    : get(r,iSitPeca),
        dataCSServico: fmt(r[iDataServ]),
        notaCSServico: get(r,iCSServ),
        sitCSServico : get(r,iSitServ),
        valorRecebido: num(r,iValor),
        status       : get(r,iStatus),
        obs          : get(r,iObs),
        otVerificar  : get(r,iOTVerif),
        // compat
        num:get(r,iCS)||get(r,iCli), data:fmt(r[iDataPeca]), vTotal:0, horas:0, km:0,
        // aliases para o renderGarantias legado
        maquina:get(r,iNSerie), notaCS_TPR:get(r,iCSServ),
        situacao:get(r,iSitPeca), dataInicio:fmt(r[iDataPeca]), dataTpr:fmt(r[iDataServ]),
        oQFalta:'', csStatus:'', notaCS_SAPval:get(r,iSAP)
      };
    });
  }catch(e){Logger.log('getGarantias err: '+e);return [];}
}

function atualizarCampoGarantia(notaCS,campo,valor){
  try{
    var sheet=getSheet('Garantia');
    if(!sheet) return {success:false,error:'Aba Garantia nao encontrada'};

    var info=_garColMap(sheet);
    var m=info.map;

    // Mapa campo (usado pelo HTML) → trecho do nome real do cabeçalho
    var campoParaHeader={
      status       :'status',
      obs          :'obs',
      situacao     :'situacao cs peca',
      sitCSPeca    :'situacao cs peca',
      sitCSServico :'situacao nota cs',
      notaCS_SAP   :'nota cs sap',
      notaCSServico:'nota cs servico',
      oQFalta      :'obs'   // fallback: salva em obs se não houver coluna específica
    };

    var headerNome=campoParaHeader[campo];
    if(!headerNome) return {success:false,error:'Campo desconhecido: '+campo};

    var colIdx=_garIdx(m,headerNome);
    if(colIdx<0) return {success:false,error:'Coluna "'+headerNome+'" nao encontrada'};
    var colNum=colIdx+1;

    // Busca linha pela Nota CS (col "nota cs")
    var csIdx=_garIdx(m,'nota cs'); if(csIdx<0) csIdx=4;
    var last=sheet.getLastRow();
    var keys=sheet.getRange(2,csIdx+1,last-1,1).getValues();
    for(var i=0;i<keys.length;i++){
      if(String(keys[i][0]).trim()===String(notaCS).trim()){
        sheet.getRange(i+2,colNum).setValue(valor||'');
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'Nota CS nao encontrada: '+notaCS};
  }catch(e){return{success:false,error:e.toString()};}
}


// ════════════════════════════════════════════════════════════════

// Cols: ID | Descricao | Data | Status | Responsavel | Obs | CriadoEm
// ════════════════════════════════════════════════════════════════
function salvarAtividade(dados){
  try{
    var sheet = getOrCreateSheet('Atividades');
    if(sheet.getLastRow()===0){
      sheet.appendRow(['ID','Descricao','Data','Status','Responsavel','Obs','Aguardando','CriadoEm','Pendente']);
    }
    var id = 'ATIV-'+new Date().getTime();
    sheet.appendRow([id,dados.descricao||'',dados.data||'',dados.status||'Pendente',dados.responsavel||'',dados.obs||'',dados.aguardando||'',dados.criadoEm||new Date().toLocaleString('pt-BR'),dados.pendente||'']);
    return {success:true,id:id};
  }catch(e){Logger.log('salvarAtividade err: '+e);return{success:false,error:e.toString()};}
}

function getAtividades(){
  try{
    var sheet=getOrCreateSheet('Atividades');
    if(sheet.getLastRow()<2) return [];
    var rows=sheet.getRange(2,1,sheet.getLastRow()-1,9).getValues();
    function fmtD(v){
      if(!v) return '';
      if(v instanceof Date) return Utilities.formatDate(v,'America/Sao_Paulo','dd/MM/yyyy');
      var s=String(v).trim();
      // se vier como Date.toString() ex: "Sat Apr 25 2026..."
      var d=new Date(s);
      if(!isNaN(d.getTime())&&s.length>10&&s.indexOf('/')===- 1) return Utilities.formatDate(d,'America/Sao_Paulo','dd/MM/yyyy');
      return s;
    }
    function safeStr(v){
      if(!v) return '';
      if(v instanceof Date) return Utilities.formatDate(v,'America/Sao_Paulo','dd/MM/yyyy HH:mm');
      return String(v).trim();
    }
    return rows.filter(function(r){return r[0];}).map(function(r){
      return {
        id:String(r[0]),descricao:String(r[1]),
        data:fmtD(r[2]),status:String(r[3]),
        responsavel:String(r[4]),obs:safeStr(r[5]),
        aguardando:safeStr(r[6]),criadoEm:safeStr(r[7]),
        pendente:safeStr(r[8])
      };
    }).reverse();
  }catch(e){Logger.log('getAtividades err: '+e);return[];}
}

function atualizarStatusAtividade(id,novoStatus){
  try{
    var sheet=getOrCreateSheet('Atividades');
    if(sheet.getLastRow()<2) return {success:false,error:'Aba vazia'};
    var ids=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<ids.length;i++){
      if(String(ids[i][0])===String(id)){
        sheet.getRange(i+2,4).setValue(novoStatus);
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'ID não encontrado'};
  }catch(e){Logger.log('atualizarStatusAtividade err: '+e);return{success:false,error:e.toString()};}
}

// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// 🔧 FERRAMENTAS
// FERRAMENTAS  ("Ferramentas")
// Cols: Veiculo | Ferramenta | Qtd | Estado | Responsavel | Obs | AdicionadoEm
// ════════════════════════════════════════════════════════════════
function salvarFerramenta(dados){
  try{
    var sheet=getOrCreateSheet('Ferramentas');
    sheet.appendRow([
      dados.veiculo||'',           // A Veiculo
      dados.ferramenta||dados.nome||'', // B Ferramenta
      parseInt(dados.qtd)||1,      // C Qtd
      dados.estado||'Bom',         // D Estado
      dados.responsavel||dados.tecnico||'', // E Responsavel
      dados.obs||dados.desc||'',   // F Obs
      new Date().toLocaleString('pt-BR') // G AdicionadoEm
    ]);
    SpreadsheetApp.flush();
    return {success:true};
  }catch(e){return{success:false,error:e.toString()};}
}

function getFerramentas(){
  try{
    var sheet=getSheet('Ferramentas');
    if(!sheet||sheet.getLastRow()<2) return [];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,7).getValues();
    return data.filter(function(r){return r[0]||r[1];}).map(function(r){
      // Suporte ao formato legado (col A = FE-xxx num): detecta pelo padrão
      var isLegado=String(r[0]||'').match(/^FE-\d+$/);
      if(isLegado){
        // Formato legado: Num | Nome | Desc | Local | Tecnico | Qtd | Timestamp
        return {veiculo:String(r[3]||''),ferramenta:String(r[1]||''),
          qtd:parseInt(r[5])||1,estado:String(r[2]||''),
          responsavel:String(r[4]||''),obs:''};
      }
      // Formato correto: Veiculo | Ferramenta | Qtd | Estado | Responsavel | Obs | AdicionadoEm
      return {veiculo:String(r[0]||''),ferramenta:String(r[1]||''),
        qtd:parseInt(r[2])||1,estado:String(r[3]||'Bom'),
        responsavel:String(r[4]||''),obs:String(r[5]||'')};
    });
  }catch(e){Logger.log('getFerramentas err: '+e);return [];}
}

// Apaga por (veiculo, ferramenta) — chave composta
function apagarFerramenta(veiculo,ferramenta){
  try{
    var sheet=getSheet('Ferramentas');
    if(!sheet||sheet.getLastRow()<2) return {success:false};
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,2).getValues();
    for(var i=data.length-1;i>=0;i--){
      var rowVei=String(data[i][0]||''), rowFerr=String(data[i][1]||'');
      // Suporte legado: se col A é FE-xxx, col B é o nome da ferramenta
      var match=(rowVei===String(veiculo)&&rowFerr===String(ferramenta))
              ||(rowFerr===String(ferramenta)&&rowVei===String(veiculo));
      if(match){sheet.deleteRow(i+2);SpreadsheetApp.flush();return {success:true};}
    }
    return {success:false,error:'Nao encontrado'};
  }catch(e){return{success:false,error:e.toString()};}
}

// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// 🎯 PROSPECÇÃO
// PROSPECÇÃO  ("Prospeccao")
// ════════════════════════════════════════════════════════════════
function getNextProspNum(){
  var sheet=getSheet('Prospeccao');
  if(!sheet) return 'PR-001';
  var last=sheet.getLastRow();
  if(last<2) return 'PR-001';
  var nums=sheet.getRange(2,1,last-1,1).getValues();
  var maxN=0;
  nums.forEach(function(r){var m=String(r[0]||'').match(/\d+/);if(m)maxN=Math.max(maxN,parseInt(m[0]));});
  return 'PR-'+String(maxN+1).padStart(3,'0');
}

function salvarProspeccao(dados){
  try{
    var sheet=getOrCreateSheet('Prospeccao');
    var num=getNextProspNum();
    sheet.appendRow([
      num,dados.data||'',dados.cliente||'',dados.telefone||'',
      dados.servico||'',parseFloat(dados.valor)||0,dados.status||'Novo',
      dados.etapa||'Contato',dados.ultimoContato||dados.data||'',
      dados.objecao||'',dados.prazo||'',dados.pagamento||'',
      dados.notas||'',dados.responsavel||dados.tecnico||'',
      new Date().toLocaleString('pt-BR')
    ]);
    SpreadsheetApp.flush();
    return {success:true,num:num};
  }catch(e){return{success:false,error:e.toString()};}
}

function getProspeccoes(){
  try{
    var sheet=getSheet('Prospeccao');
    if(!sheet||sheet.getLastRow()<2) return [];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,15).getValues();
    return data.filter(function(r){return r[0];}).map(function(r){
      return {num:String(r[0]),data:String(r[1]||''),cliente:String(r[2]||''),
        telefone:String(r[3]||''),servico:String(r[4]||''),valor:parseFloat(r[5])||0,
        status:String(r[6]||''),etapa:String(r[7]||''),ultimoContato:String(r[8]||''),
        objecao:String(r[9]||''),prazo:String(r[10]||''),pagamento:String(r[11]||''),
        notas:String(r[12]||''),responsavel:String(r[13]||'')};
    });
  }catch(e){return [];}
}

function atualizarProspeccao(num,campo,valor){
  try{
    var sheet=getSheet('Prospeccao');
    if(!sheet) return {success:false};
    var colMap={status:7,etapa:8,ultimoContato:9,notas:13,responsavel:14};
    var last=sheet.getLastRow();
    var nums=sheet.getRange(2,1,last-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(num)){
        var col=colMap[campo];
        if(col) sheet.getRange(i+2,col).setValue(valor||'');
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false};
  }catch(e){return{success:false,error:e.toString()};}
}


// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// 💵 ORÇAMENTOS
// ORÇAMENTOS  ("Orcamentos")
// Cols: No,Data,Cliente,Equipamento,Servico,Descricao Pecas,
//       Valor Pecas,Valor MO,Desconto,Total,Responsavel,Obs,Salvo em
// ════════════════════════════════════════════════════════════════
function getNextOrcNum(){
  var sheet=getSheet('Orcamentos');
  if(!sheet) return 'ORC-0001';
  var last=sheet.getLastRow();
  if(last<2) return 'ORC-0001';
  var nums=sheet.getRange(2,1,last-1,1).getValues();
  var maxN=0;
  nums.forEach(function(r){var m=String(r[0]||'').match(/\d+/);if(m)maxN=Math.max(maxN,parseInt(m[0]));});
  return 'ORC-'+String(maxN+1).padStart(4,'0');
}

function salvarOrcamento(dados){
  try{
    var sheet=getOrCreateSheet('Orcamentos');
    var num=dados.num||getNextOrcNum();
    sheet.appendRow([
      num, dados.data||'', dados.cliente||'', dados.equip||'',
      dados.servico||'', dados.pecas||'',
      parseFloat(dados.valorPecas||0), parseFloat(dados.moDeObra||0),
      parseFloat(dados.desconto||0), parseFloat(dados.total||0),
      dados.responsavel||'', dados.obs||'',
      new Date().toLocaleString('pt-BR')
    ]);
    SpreadsheetApp.flush();

    // ── Gera CSV das peças e salva no Drive ──────────────────────
    var csvUrl = '';
    try{
      var items = dados.items || [];
      if(items.length > 0){
        // Monta CSV: Codigo,Descricao,Qtd,Valor Unitario,Total
        var csv = 'Codigo,Descricao,Qtd,Valor Unitario,Total\n';
        var totalPecas = 0;
        items.forEach(function(it){
          var tot = (parseFloat(it.qtd)||1) * (parseFloat(it.unit)||0);
          totalPecas += tot;
          csv += [
            '"'+(it.cod||'')  +'"',
            '"'+(it.desc||'') +'"',
            (it.qtd||1),
            (parseFloat(it.unit)||0).toFixed(2),
            tot.toFixed(2)
          ].join(',') + '\n';
        });
        csv += ',,,,\n';
        csv += '"TOTAL PECAS","","","",'+totalPecas.toFixed(2)+'\n';
        csv += '"MO","","","",'+parseFloat(dados.moDeObra||0).toFixed(2)+'\n';
        csv += '"DESCONTO","","","",'+parseFloat(dados.desconto||0).toFixed(2)+'\n';
        csv += '"TOTAL GERAL","","","",'+parseFloat(dados.total||0).toFixed(2)+'\n';

        // Localiza ou cria pasta Juliomaq/Orcamentos no Drive
        var rootFolders = DriveApp.getFoldersByName('Juliomaq');
        var juliomaqFolder = rootFolders.hasNext() ? rootFolders.next() : DriveApp.createFolder('Juliomaq');
        var orcFolders = juliomaqFolder.getFoldersByName('Orcamentos');
        var orcFolder = orcFolders.hasNext() ? orcFolders.next() : juliomaqFolder.createFolder('Orcamentos');

        // Cria arquivo CSV: ORC-001_NomeCliente_Data.csv
        var fileName = num+'_'+dados.cliente.replace(/[^a-zA-Z0-9\u00C0-\u00FF\s]/g,'').trim().substring(0,20)+'_'+new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')+'.csv';
        var blob = Utilities.newBlob(csv, 'text/csv', fileName);
        var file = orcFolder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        csvUrl = 'https://drive.google.com/uc?export=view&id=' + file.getId();
        Logger.log('CSV salvo: ' + csvUrl);
      }
    }catch(csvErr){
      Logger.log('Erro ao gerar CSV: '+csvErr);
    }
    // ─────────────────────────────────────────────────────────────

    return {success:true, num:num, csvUrl:csvUrl};
  }catch(e){return{success:false,error:e.toString()};}
}

function getOrcamentos(){
  try{
    var sheet=getSheet('Orcamentos');
    if(!sheet||sheet.getLastRow()<2) return [];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,14).getValues();
    var fmtD=function(d){
      if(!d) return '';
      if(d instanceof Date) return Utilities.formatDate(d,'America/Sao_Paulo','dd/MM/yyyy');
      var s=String(d);
      var iso=s.match(/(\d{4}-\d{2}-\d{2})/);
      if(iso){var p=iso[1].split('-');return p[2]+'/'+p[1]+'/'+p[0];}
      return s.length>10?s.substring(0,10):s;
    };
    return data.filter(function(r){return r[0];}).map(function(r){
      return {
        num:String(r[0]),
        data:fmtD(r[1]),
        cli:String(r[2]||''),
        equip:String(r[3]||''),
        desc:String(r[4]||''),
        pecas:String(r[5]||''),
        totPecas:parseFloat(r[6])||0,
        totMO:parseFloat(r[7])||0,
        desconto:parseFloat(r[8])||0,
        total:parseFloat(r[9])||0,
        responsavel:String(r[10]||''),
        obs:String(r[11]||''),
        salvoEm:String(r[12]||''),
        fromSheets:true
      };
    });
  }catch(e){Logger.log('getOrcamentos err: '+e);return [];}
}

// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// 💳 COBRANÇAS
// Aba: Cobrancas | Cols: ID | Cliente | Valor | Vencimento | Status | Responsavel | Obs | CriadoEm
// ════════════════════════════════════════════════════════════════
function salvarCobranca(dados){
  try{
    var sheet=getOrCreateSheet('Cobrancas');
    if(sheet.getLastRow()===0) sheet.appendRow(['ID','OS','Cliente','Valor','Vencimento','Status','Responsavel','Obs','CriadoEm']);
    var id='COBR-'+new Date().getTime();
    sheet.appendRow([id,dados.os||'',dados.cliente||'',parseFloat(dados.valor)||0,dados.vencimento||'',dados.status||'Pendente',dados.responsavel||'',dados.obs||'',dados.criadoEm||new Date().toLocaleString('pt-BR')]);
    return {success:true,id:id};
  }catch(e){Logger.log('salvarCobranca err: '+e);return{success:false,error:e.toString()};}
}

function getCobrancas(){
  try{
    var sheet=getOrCreateSheet('Cobrancas');
    if(sheet.getLastRow()<2) return [];
    var rows=sheet.getRange(2,1,sheet.getLastRow()-1,9).getValues();
    return rows.filter(function(r){return r[0];}).map(function(r){
      return {id:String(r[0]),os:String(r[1]),cliente:String(r[2]),valor:parseFloat(r[3])||0,vencimento:String(r[4]),status:String(r[5]),responsavel:String(r[6]),obs:String(r[7]),criadoEm:String(r[8])};
    }).reverse();
  }catch(e){Logger.log('getCobrancas err: '+e);return[];}
}

// ════════════════════════════════════════════════════════════════
// MARKETING E EVENTOS

// ════════════════════════════════════════════════════════════════
// 🏁 VENDAS — Concorrência / Gest. Clientes / Usados
// VENDAS — Concorrência, Parque de Máquinas, Usados
// Aba na planilha: Concorrencia | ParqueMaquinas | Usados
// ════════════════════════════════════════════════════════════════
var _vendaSheets = {
  conc : { nome:'Concorrencia',  cab:['Data','Cliente','Responsavel','Marca','Modelo','Ano','Valor','Obs','SalvoEm'],
            ids: ['cncDt','cncCli','cncResp','cncMarca','cncModelo','cncAno','cncValor','cncObs'] },
  parq : { nome:'ParqueMaquinas', cab:['Data','Cliente','Contato','AreaHa','Culturas','Responsavel','Marca','Modelo','Ano','Horas','Estado','Obs','SalvoEm'],
            ids: ['parqDt','parqCli','parqContato','parqArea','parqCulturas','parqResp','parqMarca','parqModelo','parqAno','parqHoras','parqEstado','parqObs'] },
  usad : { nome:'Usados',        cab:['Data','Responsavel','Marca','Modelo','Ano','Horas','Preco','Condicao','Obs','SalvoEm','LinkAnuncio','Status','Propostas'],
            ids: ['usadDt','usadResp','usadMarca','usadModelo','usadAno','usadHoras','usadPreco','usadCond','usadObs','usadLink','usadStatus'] }
};

function salvarParqueMaquinas(dados){
  // dados = {cliente, maquinas (JSON string), total, salvoEm}
  try{
    var sheet=getOrCreateSheet('ParqueMaquinas');
    if(sheet.getLastRow()===0){
      sheet.appendRow(['Cliente','Maquinas','Total','SalvoEm']);
      sheet.getRange(1,1,1,4).setBackground('#374151').setFontColor('#fff').setFontWeight('bold').setFontSize(9);
    }
    sheet.appendRow([dados.cliente||'',dados.maquinas||'[]',parseInt(dados.total)||0,dados.salvoEm||new Date().toLocaleString('pt-BR')]);
    SpreadsheetApp.flush();
    return {success:true};
  }catch(e){return{success:false,error:e.toString()};}
}

function getParqueMaquinas(){
  try{
    var sheet=getSheet('ParqueMaquinas');
    if(!sheet||sheet.getLastRow()<2) return [];
    var lastCol=Math.max(4,Math.min(sheet.getLastColumn(),13));
    var rows=sheet.getRange(2,1,sheet.getLastRow()-1,lastCol).getValues();
    var fmtD=function(d){return d instanceof Date?Utilities.formatDate(d,'America/Sao_Paulo','dd/MM/yyyy'):String(d||'');};
    return rows.filter(function(r){return r[0];}).map(function(r){
      // Detecta formato: se col A é Date ou parece uma data = formato _vendaSheets.parq
      var isVendSheet=(r[0] instanceof Date)||(String(r[0]).indexOf('/')>=0&&String(r[1]).length>0&&String(r[1]).indexOf('[')===1);
      if(!isVendSheet&&String(r[1]).indexOf('[')===0){
        // Formato simples: [cliente, maquinas_json, total, salvoEm]
        return {data:fmtD(r[3])||'',cliente:String(r[0]),maquinas:String(r[1]),total:r[2],salvoEm:String(r[3]),responsavel:'',area:'',culturas:''};
      } else {
        // Formato _vendaSheets.parq: [Data, Cliente, Contato, AreaHa, Culturas, Responsavel, ...]
        return {data:fmtD(r[0]),cliente:String(r[1]||''),maquinas:'[]',total:0,salvoEm:String(r[lastCol-1]||''),responsavel:String(r[5]||''),area:String(r[3]||''),culturas:String(r[4]||'')};
      }
    }).reverse();
  }catch(e){return[];}
}


function salvarVendas(tab, dados){
  try{
    var cfg=_vendaSheets[tab];
    if(!cfg) return {success:false,error:'Tab desconhecida: '+tab};
    var sheet=getOrCreateSheet(cfg.nome);
    if(sheet.getLastRow()===0) sheet.appendRow(cfg.cab);
    var row=cfg.ids.map(function(id){ return dados[id]||''; });
    row.push(new Date().toLocaleString('pt-BR'));
    sheet.appendRow(row);
    return {success:true};
  }catch(e){Logger.log('salvarVendas err: '+e);return{success:false,error:e.toString()};}
}

function getVendas(tab){
  try{
    var cfg=_vendaSheets[tab];
    if(!cfg) return [];
    var sheet=getOrCreateSheet(cfg.nome);
    if(sheet.getLastRow()<2) return [];
    var lastCol=sheet.getLastColumn();
    // Le cabecalho real da linha 1 e normaliza
    var hdrs=sheet.getRange(1,1,1,lastCol).getValues()[0].map(function(h){
      return String(h||'').toLowerCase()
        .replace(/\s+/g,'')
        .replace(/[\u00e1\u00e0\u00e3\u00e2]/g,'a')
        .replace(/[\u00e9\u00ea\u00e8]/g,'e')
        .replace(/[\u00ed\u00ee\u00ec]/g,'i')
        .replace(/[\u00f3\u00f5\u00f4\u00f2]/g,'o')
        .replace(/[\u00fa\u00fb\u00f9]/g,'u')
        .replace(/\u00e7/g,'c');
    });
    var rows=sheet.getRange(2,1,sheet.getLastRow()-1,lastCol).getValues();
    return rows.filter(function(r){return r[0];}).map(function(r,ri){
      var obj={num:String(ri+2)};
      hdrs.forEach(function(h,i){ if(h) obj[h]=String(r[i]||''); });
      // Aliases para compatibilidade frontend
      if(!obj.data)        obj.data=obj.dt||'';
      if(!obj.responsavel) obj.responsavel=obj.resp||'';
      if(!obj.preco)       obj.preco=obj.valor||'';
      if(!obj.condicao)    obj.condicao=obj.cond||'';
      if(!obj.linkanuncio) obj.linkanuncio=obj.link||'';
      if(!obj.status)      obj.status='Disponivel';
      if(!obj.propostas)   obj.propostas='[]';
      return obj;
    });
  }catch(e){Logger.log('getVendas err: '+e);return[];}
}

// ════════════════════════════════════════════════════════════════
// COBRANÇAS

// ════════════════════════════════════════════════════════════════
// 💵 FINANCEIRO
// FINANCEIRO — Fluxo de Caixa
// Aba: Financeiro | Cols: ID|Data|Tipo|Descricao|Valor|Status|Responsavel|Obs|CriadoEm
// ════════════════════════════════════════════════════════════════
function salvarFinanceiro(dados){
  try{
    var sheet=getOrCreateSheet('Financeiro');
    if(sheet.getLastRow()===0) sheet.appendRow(['ID','Data','Tipo','Descricao','Valor','Status','Responsavel','Obs','CriadoEm']);
    var id='FIN-'+new Date().getTime();
    sheet.appendRow([id,dados.data||'',dados.tipo||'',dados.descricao||'',parseFloat(dados.valor)||0,dados.status||'Pago',dados.responsavel||'',dados.obs||'',dados.criadoEm||new Date().toLocaleString('pt-BR')]);
    return {success:true,id:id};
  }catch(e){Logger.log('salvarFinanceiro err: '+e);return{success:false,error:e.toString()};}
}

function getFinanceiro(){
  try{
    var sheet=getOrCreateSheet('Financeiro');
    if(sheet.getLastRow()<2) return [];
    var rows=sheet.getRange(2,1,sheet.getLastRow()-1,9).getValues();
    return rows.filter(function(r){return r[0];}).map(function(r){
      return {id:String(r[0]),data:String(r[1]),tipo:String(r[2]),descricao:String(r[3]),valor:parseFloat(r[4])||0,status:String(r[5]),responsavel:String(r[6]),obs:String(r[7]),criadoEm:String(r[8])};
    }).reverse();
  }catch(e){Logger.log('getFinanceiro err: '+e);return[];}
}

// ════════════════════════════════════════════════════════════════
// AGENDA — Busca eventos do feed iCal público e retorna só título+data

// ════════════════════════════════════════════════════════════════
// 🔗 VÍNCULO AGENDA ↔ OS
// Col V (22) da aba "Ordens de Servico" = EventoAgendaID
// ════════════════════════════════════════════════════════════════
function vincularOSEvento(numOS, eventoId){
  // Suporta multiplos eventos: armazena IDs separados por virgula
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet||sheet.getLastRow()<2) return {success:false,error:'Aba não encontrada'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(numOS)){
        var cur=String(sheet.getRange(i+2,22).getValue()||'');
        var ids=cur?cur.split(',').map(function(s){return s.trim();}).filter(Boolean):[];
        if(ids.indexOf(eventoId)<0) ids.push(eventoId);
        sheet.getRange(i+2,22).setValue(ids.join(','));
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'OS não encontrada: '+numOS};
  }catch(e){return {success:false,error:e.toString()};}
}

function desvincularOSEvento(numOS){
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet||sheet.getLastRow()<2) return {success:false,error:'Aba não encontrada'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(numOS)){
        sheet.getRange(i+2,22).setValue('');
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'OS não encontrada: '+numOS};
  }catch(e){return {success:false,error:e.toString()};}
}

function getOrdensEmAberto(){
  try{
    return (getOrdens()||[]).filter(function(o){return !o.paga;});
  }catch(e){return [];}
}

function getOSVinculadasEvento(eventoId){
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet||sheet.getLastRow()<2) return [];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,22).getValues();
    var result=[];
    data.forEach(function(r){
      if(r[0]&&String(r[21])===String(eventoId)){
        result.push({
          num:String(r[0]),cliente:String(r[2]||''),
          descricao:String(r[12]||''),vTotal:parseFloat(r[11])||0,
          tipo:String(r[8]||''),data:String(r[1]||'')
        });
      }
    });
    return result;
  }catch(e){return [];}
}

// ════════════════════════════════════════════════════════════════
// 📎 VÍNCULO OS ↔ ORÇAMENTO
// Col W (23) da aba "Ordens de Servico" = OrcamentoVinculado
// ════════════════════════════════════════════════════════════════
function vincularOrcamentoOS(numOS, numOrc){
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet||sheet.getLastRow()<2) return {success:false,error:'Aba não encontrada'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(numOS)){
        sheet.getRange(i+2,23).setValue(numOrc);
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'OS não encontrada: '+numOS};
  }catch(e){return {success:false,error:e.toString()};}
}

function desvincularOrcamentoOS(numOS){
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet||sheet.getLastRow()<2) return {success:false,error:'Aba não encontrada'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(numOS)){
        sheet.getRange(i+2,23).setValue('');
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'OS não encontrada: '+numOS};
  }catch(e){return {success:false,error:e.toString()};}
}


// ════════════════════════════════════════════════════════════════
// 📦 VENDAS — Aba "Vendas" na planilha
// Colunas: A:Num B:Data C:Cliente D:Vendedor E:Marca F:Modelo
//          G:Ano H:ValorTotal I:Parcelas(JSON) J:Obs
//          K:Fotos L:SigGestor M:SigVendedor N:SalvoEm
// ════════════════════════════════════════════════════════════════
function _getVendaSheet(){
  var sheet=getOrCreateSheet('Vendas');
  if(sheet.getLastRow()===0){
    sheet.appendRow(['Num','Data','Cliente','Vendedor','Marca','Modelo','Ano','ValorTotal','Parcelas','Obs','Fotos','SigGestor','SigVendedor','SalvoEm','Usados','FormaPagamento','ValorLiquido']);
    sheet.getRange(1,1,1,17).setFontWeight('bold');
  }
  return sheet;
}

function _getVendaNextNum(){
  var sheet=_getVendaSheet();
  var n=sheet.getLastRow(); // inclui header
  return 'VD-'+String(n).padStart(4,'0');
}

function salvarVenda(dados){
  try{
    var sheet=_getVendaSheet();
    var num=_getVendaNextNum();
    var parcelasJson=typeof dados.parcelas==='string'?dados.parcelas:JSON.stringify(dados.parcelas||[]);
    sheet.appendRow([
      num,
      dados.data||'',
      dados.cliente||'',
      dados.vendedor||'',
      dados.marca||'',
      dados.modelo||'',
      dados.ano||'',
      parseFloat(dados.valorTotal)||0,
      parcelasJson,
      dados.obs||'',
      '',  // K Fotos
      '',  // L SigGestor
      '',  // M SigVendedor
      new Date().toLocaleString('pt-BR'), // N SalvoEm
      typeof dados.usados==='string'?dados.usados:JSON.stringify(dados.usados||[]), // O Usados
      typeof dados.formaPagamento==='string'?dados.formaPagamento:JSON.stringify(dados.formaPagamento||{}), // P FormaPagamento
      parseFloat(dados.valorLiquido)||0  // Q ValorLiquido
    ]);
    SpreadsheetApp.flush();
    return {success:true, num:num};
  }catch(e){Logger.log('salvarVenda err: '+e);return{success:false,error:e.toString()};}
}

function getVendas2(){
  try{
    var sheet=_getVendaSheet();
    if(sheet.getLastRow()<2) return [];
    var data=sheet.getRange(2,1,sheet.getLastRow()-1,14).getValues();
    return data.filter(function(r){return r[0];}).map(function(r){
      var parcelas=[];
      try{parcelas=JSON.parse(String(r[8])||'[]');}catch(e){}
      return {
        num:String(r[0]),data:String(r[1]),cliente:String(r[2]),
        vendedor:String(r[3]),marca:String(r[4]),modelo:String(r[5]),
        ano:String(r[6]),valorTotal:parseFloat(r[7])||0,
        parcelas:parcelas,obs:String(r[9]||''),
        fotos:String(r[10]||''),sigGestor:String(r[11]||''),
        sigVendedor:String(r[12]||''),salvoEm:String(r[13]||''),
        usados:(function(){try{return JSON.parse(String(r[14]||'[]'));}catch(e){return [];}}()),
        formaPagamento:(function(){try{return JSON.parse(String(r[15]||'{}'));}catch(e){return {};}}()),
        valorLiquido:parseFloat(r[16])||0
      };
    });
  }catch(e){Logger.log('getVendas2 err: '+e);return[];}
}

function marcarParcelaRecebida(numVenda, parcelaIdx, comissao){
  try{
    var sheet=_getVendaSheet();
    if(sheet.getLastRow()<2) return {success:false,error:'Sem vendas'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    var row=-1;
    for(var i=0;i<nums.length;i++){if(String(nums[i][0])===String(numVenda)){row=i+2;break;}}
    if(row<0) return {success:false,error:'Venda não encontrada'};

    // Atualiza parcelas
    var parcelasCell=sheet.getRange(row,9).getValue();
    var parcelas=[];try{parcelas=JSON.parse(parcelasCell||'[]');}catch(e){}
    if(!parcelas[parcelaIdx]) return {success:false,error:'Parcela não encontrada'};
    parcelas[parcelaIdx].recebida=true;
    parcelas[parcelaIdx].dataRecebimento=new Date().toLocaleDateString('pt-BR');
    sheet.getRange(row,9).setValue(JSON.stringify(parcelas));
    SpreadsheetApp.flush();

    // Dados da venda para lançamento
    var rowData=sheet.getRange(row,1,1,8).getValues()[0];
    var cliente=String(rowData[2]);
    var vendedor=String(rowData[3]);
    var parcela=parcelas[parcelaIdx];
    var valorParcela=parseFloat(parcela.valor)||0;
    var comissaoVal=parseFloat(comissao)||parseFloat(parcela.comissao)||0;
    var dataBR=new Date().toLocaleDateString('pt-BR');

    // 1. Lançamento de entrada (Recebimento da parcela)
    salvarFinanceiro({
      data:dataBR,
      tipo:'Recebimento',
      descricao:'Venda '+numVenda+' — '+cliente+' | Parcela '+(parcelaIdx+1),
      valor:valorParcela,
      status:'Pago',
      responsavel:vendedor,
      obs:'Parcela '+(parcelaIdx+1)+' da venda '+numVenda,
      criadoEm:new Date().toLocaleString('pt-BR')
    });

    // 2. Lançamento de comissão (Saída) se houver
    if(comissaoVal>0){
      salvarFinanceiro({
        data:dataBR,
        tipo:'Pagamento Fornecedor',
        descricao:'Comissão '+numVenda+' — '+vendedor+' | Parcela '+(parcelaIdx+1),
        valor:comissaoVal,
        status:'Pago',
        responsavel:vendedor,
        obs:'Comissão parcela '+(parcelaIdx+1)+' da venda '+numVenda,
        criadoEm:new Date().toLocaleString('pt-BR')
      });
    }
    return {success:true};
  }catch(e){Logger.log('marcarParcelaRecebida err: '+e);return{success:false,error:e.toString()};}
}


function salvarUsadosVenda(usados, numVenda){
  // Salva cada usado da venda na aba Usados (mesmo sheet de usados avulsos)
  if(!usados||!usados.length) return {success:true};
  try{
    usados.forEach(function(u){
      salvarVendas('usad',{
        usadDt: u.data||new Date().toLocaleDateString('pt-BR'),
        usadResp: u.responsavel||'',
        usadMarca: u.marca||'',
        usadModelo: u.modelo||'',
        usadAno: u.ano||'',
        usadHoras: u.horas||'',
        usadPreco: u.valorAvaliado||'0',
        usadCond: u.estadoGeral||'',
        usadObs: 'Entrada em troca — Venda '+numVenda+'. Pintura: '+(u.pintura||'')+(u.embuchamento?'. Embuchamento: '+u.embuchamento:'')+(u.visual?'. Visual: '+u.visual:''),
        fotos: JSON.stringify([])
      });
    });
    return {success:true};
  }catch(e){return {success:false,error:e.toString()};}
}

function salvarMidiaVenda(dados){
  try{
    var sheet=_getVendaSheet();
    if(sheet.getLastRow()<2) return {success:false,error:'Sem vendas'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    var row=-1;
    for(var i=0;i<nums.length;i++){if(String(nums[i][0])===String(dados.numVenda)){row=i+2;break;}}
    if(row<0) return {success:false,error:'Venda não encontrada'};

    var folder=DriveApp.getFoldersByName('Juliomaq_Vendas');
    var f=folder.hasNext()?folder.next():DriveApp.createFolder('Juliomaq_Vendas');
    var blob=Utilities.newBlob(Utilities.base64Decode(dados.dados),dados.tipo||'image/jpeg',dados.nome||'foto.jpg');
    var file=f.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
    var url=file.getUrl();

    var cur=String(sheet.getRange(row,11).getValue()||'');
    var nova=cur?cur+','+url:url;
    sheet.getRange(row,11).setValue(nova);
    SpreadsheetApp.flush();
    return {success:true,url:url};
  }catch(e){Logger.log('salvarMidiaVenda err: '+e);return{success:false,error:e.toString()};}
}

function salvarAssinaturaVenda(numVenda, tipo, b64){
  // tipo: 'gestor' (col L=12) ou 'vendedor' (col M=13)
  try{
    var sheet=_getVendaSheet();
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    var row=-1;
    for(var i=0;i<nums.length;i++){if(String(nums[i][0])===String(numVenda)){row=i+2;break;}}
    if(row<0) return {success:false,error:'Venda não encontrada'};

    var col=tipo==='gestor'?12:13;
    var folder=DriveApp.getFoldersByName('Juliomaq_Assinaturas');
    var f=folder.hasNext()?folder.next():DriveApp.createFolder('Juliomaq_Assinaturas');
    var blob=Utilities.newBlob(Utilities.base64Decode(b64),'image/jpeg','sig_'+tipo+'_'+numVenda+'.jpg');
    var file=f.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
    sheet.getRange(row,col).setValue(file.getUrl());
    SpreadsheetApp.flush();
    return {success:true};
  }catch(e){return{success:false,error:e.toString()};}
}

function editarOS(dados){
  // Colunas OS: A:Num B:Data C:Km D:horas E:Tipo F:Tecnico G:KmVeiculo H:Horas
  //             I:Tipo J:VHora K:VKm L:VTotal M:Cliente N:Descricao...
  // Mapa real: A=Num B=Data C=Cliente D=Tecnico E=Veiculo F=KmVeiculo G=km H=horas
  //            I=tipo J=vHora K=vKm L=vTotal M=Descricao N=assinatura...
  try{
    var sheet=getSheet('Ordens de Servico');
    if(!sheet||sheet.getLastRow()<2) return {success:false,error:'Aba nao encontrada'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(dados.num)){
        var row=i+2;
        if(dados.data)    sheet.getRange(row,2).setValue(dados.data);
        if(dados.cliente!==undefined) sheet.getRange(row,3).setValue(dados.cliente);
        if(dados.tecnico!==undefined) sheet.getRange(row,4).setValue(dados.tecnico);
        if(dados.veiculo!==undefined) sheet.getRange(row,5).setValue(dados.veiculo);
        if(dados.local!==undefined)   sheet.getRange(row,6).setValue(dados.local);
        if(dados.km!==undefined)      sheet.getRange(row,7).setValue(parseFloat(dados.km)||0);
        if(dados.horas!==undefined)   sheet.getRange(row,8).setValue(parseFloat(dados.horas)||0);
        if(dados.tipo!==undefined)    sheet.getRange(row,9).setValue(dados.tipo);
        if(dados.vHora!==undefined)   sheet.getRange(row,10).setValue(parseFloat(dados.vHora)||0);
        if(dados.vKm!==undefined)     sheet.getRange(row,11).setValue(parseFloat(dados.vKm)||0);
        if(dados.vTotal!==undefined)  sheet.getRange(row,12).setValue(parseFloat(dados.vTotal)||0);
        if(dados.descricao!==undefined) sheet.getRange(row,13).setValue(dados.descricao);
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'OS nao encontrada: '+dados.num};
  }catch(e){return {success:false,error:e.toString()};}
}

function marcarCobrancaPaga(num){
  try{
    var sheet=getSheet('Cobrancas');
    if(!sheet||sheet.getLastRow()<2) return {success:false,error:'Aba nao encontrada'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(num)){
        // Col status — encontrar coluna status dinamicamente pelo cabeçalho
        var hdrs=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
        var stCol=-1;
        for(var j=0;j<hdrs.length;j++){if(String(hdrs[j]).toLowerCase().indexOf('status')>=0){stCol=j+1;break;}}
        if(stCol<0) stCol=6; // fallback col 6
        sheet.getRange(i+2,stCol).setValue('Pago');
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'Cobranca nao encontrada: '+num};
  }catch(e){return {success:false,error:e.toString()};}
}

function salvarPropostaUsado(numUsad, prop){
  // Lê a planilha Usados, encontra a linha pelo num (col A),
  // lê o campo Propostas (col M = 13), adiciona a nova proposta e salva
  try{
    var sheet=getSheet('Usados');
    if(!sheet||sheet.getLastRow()<2) return {success:false,error:'Aba nao encontrada'};
    var lastRow=sheet.getLastRow();
    var data=sheet.getRange(2,1,lastRow-1,13).getValues();
    for(var i=0;i<data.length;i++){
      if(String(data[i][0])===String(numUsad)){
        var row=i+2;
        var propsJson=String(data[i][12]||'[]');
        var props=[];
        try{props=JSON.parse(propsJson);}catch(e){props=[];}
        props.push(prop);
        sheet.getRange(row,13).setValue(JSON.stringify(props));
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    // Se nao encontrou por num, adiciona na ultima linha com num gerado
    return {success:false,error:'Usado nao encontrado: '+numUsad};
  }catch(e){return {success:false,error:e.toString()};}
}

function editarManutencao(dados){
  // Colunas Gestao de Veiculos: A:No B:Data C:Veiculo D:Tipo E:Tecnico F:Hodometro G:Valor H:Descricao
  try{
    var sheet=getSheet('Gestao de Veiculos');
    if(!sheet||sheet.getLastRow()<2) return {success:false,error:'Aba nao encontrada'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(dados.num)){
        var row=i+2;
        if(dados.data)     sheet.getRange(row,2).setValue(dados.data);
        if(dados.veiculo!==undefined)  sheet.getRange(row,3).setValue(dados.veiculo);
        if(dados.tipo!==undefined)     sheet.getRange(row,4).setValue(dados.tipo);
        if(dados.tecnico!==undefined)  sheet.getRange(row,5).setValue(dados.tecnico);
        if(dados.hodometro!==undefined) sheet.getRange(row,6).setValue(dados.hodometro||'');
        if(dados.valor!==undefined)    sheet.getRange(row,7).setValue(parseFloat(dados.valor)||0);
        if(dados.descricao!==undefined) sheet.getRange(row,8).setValue(dados.descricao);
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'Registro nao encontrado: '+dados.num};
  }catch(e){return {success:false,error:e.toString()};}
}

function editarDespesa(dados){
  try{
    var sheet=getSheet('Despesas');
    if(!sheet||sheet.getLastRow()<2) return {success:false,error:'Aba não encontrada'};
    var nums=sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues();
    for(var i=0;i<nums.length;i++){
      if(String(nums[i][0])===String(dados.num)){
        var row=i+2;
        // Colunas: A:No B:Data C:Comprador D:CNPJ E:Fornecedor F:Descricao G:Categoria H:Valor I:FormaPgto J:Foto K:SalvoEm L:Assinatura M:FotoVisual N:AssinaturaVisual O:Reembolsado
        if(dados.data)  sheet.getRange(row,2).setValue(dados.data);
        if(dados.comprador!==undefined) sheet.getRange(row,3).setValue(dados.comprador);
        if(dados.fornecedor!==undefined) sheet.getRange(row,5).setValue(dados.fornecedor);
        if(dados.descricao!==undefined) sheet.getRange(row,6).setValue(dados.descricao);
        if(dados.categoria!==undefined) sheet.getRange(row,7).setValue(dados.categoria);
        if(dados.valor!==undefined) sheet.getRange(row,8).setValue(parseFloat(dados.valor)||0);
        if(dados.formaPgto!==undefined) sheet.getRange(row,9).setValue(dados.formaPgto);
        if(dados.reembolsado!==undefined) sheet.getRange(row,15).setValue(dados.reembolsado);
        SpreadsheetApp.flush();
        return {success:true};
      }
    }
    return {success:false,error:'Despesa não encontrada: '+dados.num};
  }catch(e){return {success:false,error:e.toString()};}
}

// ════════════════════════════════════════════════════════════════
// 📦 LER TUDO — retorna todos os dados da planilha em uma chamada
// Uso: google.script.run.lerTudoPlanilha()
// Retorna objeto com todas as coleções prontas para o frontend
// ════════════════════════════════════════════════════════════════
function lerTudoPlanilha(){
  var resultado = {};
  var erros = [];

  function safe(key, fn){
    try{ resultado[key] = fn(); }
    catch(e){ erros.push(key+': '+e.message); resultado[key] = []; }
  }

  // ── Agenda ──────────────────────────────────────────────────
  safe('agendaEventos',     function(){ return getAgendaEventosSalvos(); });

  // ── Despesas ────────────────────────────────────────────────
  safe('despesas',          function(){ return getDespesas(); });

  // ── Desp. Veículos ──────────────────────────────────────────
  safe('manutencoes',       function(){ return getManutencoes(); });

  // ── Checklist ───────────────────────────────────────────────
  safe('checklistItens',    function(){ return getItensSemanal(); });
  safe('checklistHistorico',function(){ return getHistoricoChecklist(''); });

  // ── Marketing ───────────────────────────────────────────────
  safe('marketingEventos',  function(){ return getMarketing('eventos'); });
  safe('marketingCampanhas',function(){ return getMarketing('campanhas'); });

  // ── Nova OS / Resumo OS ─────────────────────────────────────
  safe('ordens',            function(){ return getOrdens(); });
  safe('proximaOS',         function(){ return getNextOSNum(); });

  // ── Salesforce ──────────────────────────────────────────────
  safe('garantias',         function(){ return getGarantias(); });
  safe('atividades',        function(){ return getAtividades(); });

  // ── Ferramentas ─────────────────────────────────────────────
  safe('ferramentas',       function(){ return getFerramentas(); });

  // ── Prospecção ──────────────────────────────────────────────
  safe('prospeccoes',       function(){ return getProspeccoes(); });
  safe('proximaProsp',      function(){ return getNextProspNum(); });

  // ── Orçamento ───────────────────────────────────────────────
  safe('orcamentos',        function(){ return getOrcamentos(); });
  safe('proximoOrc',        function(){ return getNextOrcNum(); });

  // ── Cobranças ───────────────────────────────────────────────
  safe('cobrancas',         function(){ return getCobrancas(); });

  // ── Vendas ──────────────────────────────────────────────────
  safe('concorrencias',     function(){ return getVendas('conc'); });
  safe('gestaoClientes',    function(){ return getVendas('parq'); });
  safe('usados',            function(){ return getVendas('usad'); });
  safe('parqueMaquinas',    function(){ return getParqueMaquinas(); });

  // ── Financeiro ──────────────────────────────────────────────
  safe('financeiro',        function(){ return getFinanceiro(); });

  // ── Meta ────────────────────────────────────────────────────
  resultado._meta = {
    geradoEm: new Date().toLocaleString('pt-BR'),
    erros: erros,
    totalColecoes: Object.keys(resultado).length - 1
  };

  Logger.log('lerTudoPlanilha: '+resultado._meta.totalColecoes+' coleções carregadas. Erros: '+erros.length);
  return resultado;
}


// ════════════════════════════════════════════════════════════════
// 🛠️ UTILITÁRIOS — Exportar Tudo
// Retorna objeto JSON com todos os dados das abas principais
// Compatível com o formato exportado pelo offline para importação
// ════════════════════════════════════════════════════════════════
function exportarTudo(){
  try{
    return {
      exportadoEm  : new Date().toISOString(),
      fonte        : 'online',
      ordens       : getOrdens(),
      manutencoes  : getManutencoes(),
      ferramentas  : getFerramentas(),
      prospeccoes  : getProspeccoes(),
      orcamentos   : getOrcamentos(),
      fotos        : []  // fotos ficam no Drive — links já estão nas ordens.fotos
    };
  }catch(e){
    Logger.log('exportarTudo err: '+e);
    return {exportadoEm:new Date().toISOString(),fonte:'online',error:e.toString()};
  }
}

// ════════════════════════════════════════════════════════════════
// DESPESAS GERAIS
// ════════════════════════════════════════════════════════════════
// 📊 FÓRMULAS DOCUMENTADAS NA PLANILHA
// Chamado automaticamente pelo onOpen()
// Adiciona colunas de memória de cálculo e resumos por SUMIF/ARRAYFORMULA
// ════════════════════════════════════════════════════════════════

// onOpen consolidado acima

function setupFormulas(){
  _setupFormulasOS();
  _setupFormulasFinanceiro();
  _setupFormulasDespesas();
  _setupFormulasVeiculos();
  _setupFormulasVendas();
}

// ── Ordens de Serviço ─────────────────────────────────────────
// Colunas A-W (dados). Adiciona em X: Memória de Cálculo, Y-AB: Resumo SUMIF
function _setupFormulasOS(){
  var sh = getSheet('Ordens de Servico');
  if(!sh || sh.getLastRow()<1) return;

  // Limpa col X (24) se ainda contiver a fórmula antiga de memória de cálculo
  try{
    var hdr24 = sh.getRange(1,24).getValue();
    if(String(hdr24).indexOf('Memória')>=0 || String(hdr24).indexOf('Memoria')>=0){
      sh.getRange(1,24).clearContent();
      if(sh.getLastRow()>1) sh.getRange(2,24,sh.getLastRow()-1,1).clearContent();
    }
  }catch(e){}

  // --- Col X: Cabeçalho + ARRAYFORMULA memória de cálculo ---
  sh.getRange(1,30).setValue('Memória de Cálculo');
  sh.getRange(1,30).setFontWeight('bold').setBackground('#e8f5e9').setFontColor('#1A6B2A');
  // ARRAYFORMULA: se há número na col A, monta a descrição
  sh.getRange(2,30).setFormula(
    '=ARRAYFORMULA(IF(A2:A<>"";"MO: R$"&TEXT(J2:J;"#.##0,00")&" | Desl: R$"&TEXT(K2:K;"#.##0,00")&" | Total: R$"&TEXT(L2:L;"#.##0,00");""))'
  );

  // --- Cols Z-AH: Resumo por Tipo (SUMIF) ---
  var colR = 26; // Z
  var headers = [
    ['','Resumo OS','','','','','',''],
    ['Tipo','Qtd','MO Total','Desl. Total','Total Geral','Km Total','Horas Total','Valor Médio'],
    ['Cliente',
      '=COUNTIF(I:I;"Cliente")',
      '=SUMIF(I:I;"Cliente";J:J)',
      '=SUMIF(I:I;"Cliente";K:K)',
      '=SUMIF(I:I;"Cliente";L:L)',
      '=SUMIF(I:I;"Cliente";G:G)',
      '=SUMIF(I:I;"Cliente";H:H)',
      '=IFERROR(SUMIF(I:I;"Cliente";L:L)/COUNTIF(I:I;"Cliente");0)'
    ],
    ['Garantia',
      '=COUNTIF(I:I;"Garantia")',
      '=SUMIF(I:I;"Garantia";J:J)',
      '=SUMIF(I:I;"Garantia";K:K)',
      '=SUMIF(I:I;"Garantia";L:L)',
      '=SUMIF(I:I;"Garantia";G:G)',
      '=SUMIF(I:I;"Garantia";H:H)',
      '=IFERROR(SUMIF(I:I;"Garantia";L:L)/COUNTIF(I:I;"Garantia");0)'
    ],
    ['Cortesia/Comercial',
      '=COUNTIF(I:I;"Cortesia/Comercial")',
      '=SUMIF(I:I;"Cortesia/Comercial";J:J)',
      '=SUMIF(I:I;"Cortesia/Comercial";K:K)',
      '=SUMIF(I:I;"Cortesia/Comercial";L:L)',
      '=SUMIF(I:I;"Cortesia/Comercial";G:G)',
      '=SUMIF(I:I;"Cortesia/Comercial";H:H)',
      '=IFERROR(SUMIF(I:I;"Cortesia/Comercial";L:L)/COUNTIF(I:I;"Cortesia/Comercial");0)'
    ],
    ['Contrato Fechado',
      '=COUNTIF(I:I;"Contrato Fechado")',
      '=SUMIF(I:I;"Contrato Fechado";J:J)',
      '=SUMIF(I:I;"Contrato Fechado";K:K)',
      '=SUMIF(I:I;"Contrato Fechado";L:L)',
      '=SUMIF(I:I;"Contrato Fechado";G:G)',
      '=SUMIF(I:I;"Contrato Fechado";H:H)',
      '=IFERROR(SUMIF(I:I;"Contrato Fechado";L:L)/COUNTIF(I:I;"Contrato Fechado");0)'
    ],
    ['TOTAL',
      '=COUNTA(A2:A)-1',
      '=SUM(J2:J)',
      '=SUM(K2:K)',
      '=SUM(L2:L)',
      '=SUM(G2:G)',
      '=SUM(H2:H)',
      '=IFERROR(SUM(L2:L)/MAX(1;COUNTA(A2:A)-1);0)'
    ],
    ['Pagas','=COUNTIF(Q:Q;TRUE)','','','=SUMIF(Q:Q;TRUE;L:L)','','',''],
    ['A Receber','=COUNTIF(Q:Q;FALSE)','','','=SUMIF(Q:Q;FALSE;L:L)','','','']
  ];

  var rng = sh.getRange(1, colR, headers.length, 8);
  rng.clearContent();
  headers.forEach(function(row, i){
    sh.getRange(i+1, colR, 1, row.length).setValues([row]);
  });
  // Formata cabeçalhos
  sh.getRange(1,colR,1,8).setBackground('#1a4a7a').setFontColor('#ffffff').setFontWeight('bold');
  sh.getRange(2,colR,1,8).setBackground('#c8d9f0').setFontWeight('bold');
  sh.getRange(7,colR,1,8).setBackground('#e8f5e9').setFontWeight('bold');
  // Formata valores monetários (colunas MO, Desl, Total, Médio)
  [colR+2,colR+3,colR+4,colR+7].forEach(function(c){
    sh.getRange(3,c,7).setNumberFormat('R$ #,##0.00');
  });
}

// ── Financeiro ────────────────────────────────────────────────
// Colunas A-I (dados). Adiciona J: Saldo Acumulado; L-O: Resumo
function _setupFormulasFinanceiro(){
  var sh = getSheet('Financeiro');
  if(!sh || sh.getLastRow()<1) return;

  // --- Col J: Saldo Acumulado (running balance) ---
  sh.getRange(1,10).setValue('Saldo Acumulado').setFontWeight('bold').setBackground('#e3f2fd').setFontColor('#1a4a7a');
  sh.getRange(2,10).setFormula(
    '=ARRAYFORMULA(IF(A2:A<>"";MMULT(IF(ROW(E2:E)>=TRANSPOSE(ROW(E2:E));IF(C2:C="Recebimento";E2:E;-IF(C2:C="Pagamento Fornecedor";E2:E;0));0);IF(ROW(E2:E)>=TRANSPOSE(ROW(E2:E));1;0));""))'
  );
  // Alternativa mais simples: saldo = total entradas - total saídas até aquela linha
  // Usa SUMPRODUCT para running balance
  sh.getRange(2,10).setFormula(
    '=ARRAYFORMULA(IF(A2:A<>"";SUMIF(C$2:C2;"Recebimento";E$2:E2)-SUMIF(C$2:C2;"Pagamento Fornecedor";E$2:E2);""))'
  );
  sh.getRange(2,10,sh.getMaxRows()-1,1).setNumberFormat('R$ #,##0.00');

  // --- Cols L-N: Resumo Financeiro ---
  var colR = 12; // L
  var resumo = [
    ['Resumo Financeiro','',''],
    ['Métrica','Valor',''],
    ['Total Recebimentos','=SUMIF(C:C;"Recebimento";E:E)',''],
    ['Total Saídas (Fornecedor)','=SUMIF(C:C;"Pagamento Fornecedor";E:E)',''],
    ['Saldo Atual','=SUMIF(C:C;"Recebimento";E:E)-SUMIF(C:C;"Pagamento Fornecedor";E:E)',''],
    ['Qtd Pagos','=COUNTIF(F:F;"Pago")',''],
    ['Qtd Pendentes','=COUNTIF(F:F;"Pendente")',''],
    ['Valor Pago','=SUMIF(F:F;"Pago";E:E)',''],
    ['Valor Pendente','=SUMIF(F:F;"Pendente";E:E)',''],
    ['Fórmula Saldo','="""=SUMIF(C:C,Recebimento,E:E) - SUMIF(C:C,Pagamento,E:E)"""','']
  ];
  var rng2 = sh.getRange(1,colR,resumo.length,3);
  rng2.clearContent();
  resumo.forEach(function(row,i){sh.getRange(i+1,colR,1,3).setValues([row]);});
  sh.getRange(1,colR,1,3).setBackground('#1a4a7a').setFontColor('#fff').setFontWeight('bold');
  sh.getRange(2,colR,1,3).setBackground('#c8d9f0').setFontWeight('bold');
  sh.getRange(5,colR,1,2).setBackground('#e8f5e9').setFontWeight('bold');
  [colR+1].forEach(function(c){sh.getRange(3,c,8,1).setNumberFormat('R$ #,##0.00');});
}

// ── Despesas ──────────────────────────────────────────────────
// Colunas A-O (dados). Adiciona Q+: Resumo SUMIF
function _setupFormulasDespesas(){
  var sh = getSheet('Despesas');
  if(!sh || sh.getLastRow()<1) return;

  // --- Col P: Memória forma de pagamento ---
  sh.getRange(1,16).setValue('Status Pgto').setFontWeight('bold').setBackground('#f3e5f5').setFontColor('#6a1b9a');
  sh.getRange(2,16).setFormula(
    '=ARRAYFORMULA(IF(A2:A<>"";IF(I2:I="Comprador Pagou";IF(O2:O="Sim";"Reembolsado ✅";"Aguardando Reembolso ⏳");IF(I2:I="Juliomaq Pagou";"Juliomaq Pagou ✅";"Pendente"));""))'
  );

  // --- Cols R-T: Resumo por Categoria ---
  var colR = 18; // R
  var cats = ['Alimentação','Hospedagem e Transporte','Itens de Serviço e Peças','Outros'];
  var rows = [
    ['Resumo Despesas','',''],
    ['Categoria','Total','Qtd'],
  ];
  cats.forEach(function(c){
    rows.push([c,'=SUMIF(G:G;"'+c+'",H:H)','=COUNTIF(G:G;"'+c+'")']);
  });
  rows.push(['TOTAL','=SUM(H:H)','=COUNTA(A2:A)']);
  rows.push(['Comprador Pagou','=SUMIF(I:I;"Comprador Pagou";H:H)','=COUNTIF(I:I;"Comprador Pagou")']);
  rows.push(['Juliomaq Pagou','=SUMIF(I:I;"Juliomaq Pagou";H:H)','=COUNTIF(I:I;"Juliomaq Pagou")']);
  rows.push(['Reembolsados','=SUMIF(O:O;"Sim";H:H)','=COUNTIF(O:O;"Sim")']);
  rows.push(['A Reembolsar','=SUMIF(I:I;"Comprador Pagou";H:H)-SUMIF(O:O;"Sim";H:H)','']);
  rows.push(['Fórmula Total','="""=SUMIF(G:G,Categoria,H:H)"""','']);

  sh.getRange(1,colR,rows.length,3).clearContent();
  rows.forEach(function(row,i){sh.getRange(i+1,colR,1,3).setValues([row]);});
  sh.getRange(1,colR,1,3).setBackground('#6a1b9a').setFontColor('#fff').setFontWeight('bold');
  sh.getRange(2,colR,1,3).setBackground('#e1bee7').setFontWeight('bold');
  sh.getRange(6,colR,1,3).setBackground('#e8f5e9').setFontWeight('bold');
  sh.getRange(3,colR+1,rows.length-1,1).setNumberFormat('R$ #,##0.00');
}

// ── Gestão de Veículos ────────────────────────────────────────
// Colunas: A No, B Data, C Veiculo, D Tipo, E Tecnico, F Hodometro, G Valor, H Descricao
// Adiciona J+: Resumo SUMIF
function _setupFormulasVeiculos(){
  var sh = getSheet('Gestao de Veiculos');
  if(!sh || sh.getLastRow()<1) return;

  // Col L: Custo por km (quando hodômetro > 0)
  sh.getRange(1,12).setValue('Custo/km').setFontWeight('bold').setBackground('#e3f2fd').setFontColor('#1a4a7a');
  sh.getRange(2,12).setFormula(
    '=ARRAYFORMULA(IF(A2:A<>"";IF(F2:F>0;G2:G/F2:F;"-");""))'
  );

  // Cols N+: Resumo por Veículo
  var colR = 14; // N
  var veics = ['Montana 2018','Montana 2020','Saveiro 2019','Saveiro 2024','Ka 2017','Mobi 2024','MB 1318','VW 24280'];
  var rows = [
    ['Resumo Veículos','','',''],
    ['Veículo','Total Gasto','Nº Registros','Tipo mais comum'],
  ];
  veics.forEach(function(v){
    rows.push([v,
      '=SUMIF(C:C;"'+v+'",G:G)',
      '=COUNTIF(C:C;"'+v+'")',
      '=IFERROR(INDEX(D:D;MATCH(MAX(COUNTIFS(C:C;"'+v+'",D:D,D2:D)),COUNTIFS(C:C,"'+v+'",D:D,D2:D),0)+1),"-")'
    ]);
  });
  rows.push(['TOTAL','=SUM(G:G)','=COUNTA(A2:A)','']);
  rows.push(['','','','']);
  rows.push(['Por Tipo','Total','Qtd','']);
  ['Abastecimento','Manutencao','Borracharia','Lavagem'].forEach(function(t){
    rows.push([t,'=SUMIF(D:D;"'+t+'",G:G)','=COUNTIF(D:D;"'+t+'")','']);
  });
  rows.push(['Fórmula','="""=SUMIF(C:C,Veiculo,G:G)"""','','']);

  sh.getRange(1,colR,rows.length,4).clearContent();
  rows.forEach(function(row,i){sh.getRange(i+1,colR,1,4).setValues([row]);});
  sh.getRange(1,colR,1,4).setBackground('#1a4a7a').setFontColor('#fff').setFontWeight('bold');
  sh.getRange(2,colR,1,4).setBackground('#bbdefb').setFontWeight('bold');
  sh.getRange(10,colR,1,4).setBackground('#e8f5e9').setFontWeight('bold');
  sh.getRange(3,colR+1,rows.length-1,1).setNumberFormat('R$ #,##0.00');
}

// ── Vendas ────────────────────────────────────────────────────
// Colunas: A Num, B Data, C Cliente, D Vendedor, E Marca, F Modelo, G Ano,
//          H ValorTotal, I Parcelas, J Obs, K Fotos, L SigGestor, M SigVendedor,
//          N SalvoEm, O Usados, P FormaPagamento, Q ValorLiquido
// Adiciona S: Memória de Cálculo; U+: Resumo
function _setupFormulasVendas(){
  var sh = getSheet('Vendas');
  if(!sh || sh.getLastRow()<1) return;

  // Col S: Memória de Cálculo do Valor Líquido
  sh.getRange(1,19).setValue('Memória: Valor Líquido').setFontWeight('bold').setBackground('#fff3e0').setFontColor('#e65100');
  sh.getRange(2,19).setFormula(
    '=ARRAYFORMULA(IF(A2:A<>"";"Total: R$"&TEXT(H2:H;"#.##0,00")&" - Usados: R$"&TEXT(H2:H-Q2:Q;"#.##0,00")&" = Líquido: R$"&TEXT(Q2:Q;"#.##0,00");""))'
  );

  // Cols U+: Resumo Vendas
  var colR = 21; // U
  var rows = [
    ['Resumo Vendas',''],
    ['Métrica','Valor'],
    ['Total Vendas (bruto)','=SUM(H:H)'],
    ['Total Líquido','=SUM(Q:Q)'],
    ['Total Descontos Usados','=SUM(H:H)-SUM(Q:Q)'],
    ['Qtd Vendas','=COUNTA(A2:A)'],
    ['Ticket Médio','=IFERROR(SUM(H:H)/MAX(1;COUNTA(A2:A));0)'],
    ['',''],
    ['Por Vendedor',''],
  ];
  // Adiciona vendedores únicos via nota
  rows.push(['(Ver col D para detalhes)','=SUMPRODUCT((D2:D<>"")*H2:H)']);
  rows.push(['Fórmula Líquido','="""=ValorTotal - SUM(Usados.valorAvaliado)"""']);

  sh.getRange(1,colR,rows.length,2).clearContent();
  rows.forEach(function(row,i){sh.getRange(i+1,colR,1,2).setValues([row]);});
  sh.getRange(1,colR,1,2).setBackground('#e65100').setFontColor('#fff').setFontWeight('bold');
  sh.getRange(2,colR,1,2).setBackground('#ffe0b2').setFontWeight('bold');
  sh.getRange(3,colR+1,7,1).setNumberFormat('R$ #,##0.00');
}
