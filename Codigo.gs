/**
 * GERADOR DE RELATÓRIOS E API (APPS SCRIPT)
 * 
 * Este script recebe o JSON estruturado do Frontend (React), cria planilhas baseadas num Template,
 * gera as datas úteis e envia por e-mail para os instrutores, além de servir dados para o dashboard.
 */
// ==========================================
// CONFIGURAÇÕES
// ==========================================
var TEMPLATE_ID = "13wot0sKShqyRg6NVxnYBahWIFOzA7SNgoeNozITZaB0"; 
var FERIADOS_ID = "1HjA_G1QiSd1UU9OJtPvGOEn4139-i_q_lgYQ5MsA7tA"; 
var PLANILHA_ID = "13wot0sKShqyRg6NVxnYBahWIFOzA7SNgoeNozITZaB0";
var PASTA_ETAPAS_ID = "1A-UiNmlXxk28byYwz78qLRWG9s-SJACm";

function configurarPermissoes() {
  try {
    var dummyDrive = DriveApp.getFiles();
    var dummySheet = SpreadsheetApp.create("Dummy File");
    DriveApp.getFileById(dummySheet.getId()).setTrashed(true);
    Logger.log("Permissões configuradas com sucesso! Pode fazer o Deploy agora.");
  } catch (e) {
    Logger.log("Certifique-se de que aceitou todos os acessos.");
  }
}

function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.TEXT).setHeaders(headers);
}

function doGet(e) {
  var headers = { "Access-Control-Allow-Origin": "*" };
  try {
    var params = e.parameter;
    
    // Lista todas as planilhas da pasta de Etapas para o Frontend descobrir cidades e abas
    if (params.acao === "listar_metadados") {
      var planilhas = [];
      try {
        var folder = DriveApp.getFolderById(PASTA_ETAPAS_ID);
        var files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
        while (files.hasNext()) {
          var file = files.next();
          var ss = SpreadsheetApp.openById(file.getId());
          planilhas.push({
            id: file.getId(),
            nome: file.getName(),
            materias: ss.getSheets().map(function(s) { return s.getName(); })
          });
        }
      } catch(err) {
        // Fallback caso a pasta falhe, retorna a planilha principal
        var ssFallback = SpreadsheetApp.openById(PLANILHA_ID);
        planilhas.push({
          id: PLANILHA_ID,
          nome: ssFallback.getName(),
          materias: ssFallback.getSheets().map(function(s) { return s.getName(); })
        });
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", planilhas: planilhas }))
        .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    }
    
    // Buscar dados de uma aba específica
    if (params.acao === "listar") {
      var period = params.period || "";
      var materia = params.materia || ""; 
      var sheetId = params.planilhaId || PLANILHA_ID; // Pega a planilha certa
      
      var ss = SpreadsheetApp.openById(sheetId);
      var sheetName = ss.getName(); 
      
      var aba = ss.getSheets()[0];
      if (materia) {
        var abaBusca = ss.getSheetByName(materia);
        if (abaBusca) aba = abaBusca;
      }
      
      var dados = aba.getDataRange().getValues();
      if (dados.length < 2) {
        return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [], sheetName: sheetName, abaAtual: aba.getName() }))
          .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
      }
      var cabecalho = dados.shift().map(function(h) { return (h || "").toString().trim().toLowerCase(); });
      var linhas = [];
      for (var i = 0; i < dados.length; i++) {
        var obj = {};
        for (var j = 0; j < cabecalho.length; j++) {
          obj[cabecalho[j]] = dados[i][j] ? dados[i][j].toString() : "";
        }
        if (period) {
          var dataAula = obj["data_aula"] || obj["data"] || "";
          var parts = dataAula.split("/");
          if (parts.length === 3) {
            var mes = ("0" + parts[0]).slice(-2);
            var ano = parts[2];
            if (ano + "-" + mes !== period) continue;
          }
        }
        obj.faltas = parseInt(obj["nomes_faltas_count"] || obj["faltas"]) || 0;
        obj.totalAulas = parseInt(obj["total_aulas"]) || 20;
        linhas.push(obj);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: linhas, sheetName: sheetName, abaAtual: aba.getName() }))
        .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "acao desconhecida: " + params.acao }))
      .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  }
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    if (payload.acao === "gerar_planilhas") {
      var equipes = payload.equipes;
      var dataInicioStr = payload.data_inicio;
      var dataFimStr = payload.data_fim;
      var resultados = gerarPlanilhas(equipes, dataInicioStr, dataFimStr);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Planilhas geradas com sucesso.',
        details: resultados
      })).setMimeType(ContentService.MimeType.JSON);
    }
    var sheetId = payload.planilhaId || PLANILHA_ID;
    var ss = SpreadsheetApp.openById(sheetId);
    var aba = ss.getSheets()[0];
    var linha = [
      new Date().toISOString(),
      payload.data_aula || "",
      payload.curso || "",
      payload.turno || "",
      payload.conteudo_lecionado || "",
      (payload.nomes_presencas || []).join(", "),
      (payload.nomes_faltas || []).join(", "),
      payload.observacoes || ""
    ];
    aba.appendRow(linha);
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Registro salvo."
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function gerarPlanilhas(equipes, dataInicioStr, dataFimStr) {
  var relatorioFinal = { planilhas_criadas: 0, equipes: [] };
  var datasUteis = calcularDiasUteis(dataInicioStr, dataFimStr);
  if (datasUteis.length === 0) throw new Error("Nenhum dia útil encontrado.");
  for (var i = 0; i < equipes.length; i++) {
    var equipe = equipes[i];
    var nomeArquivo = equipe.nome_equipe + " - " + getNomeMes(dataInicioStr);
    var templateFile = DriveApp.getFileById(TEMPLATE_ID.trim());
    var newFile = templateFile.makeCopy(nomeArquivo);
    var folder = DriveApp.getFolderById(PASTA_ETAPAS_ID);
    newFile.moveTo(folder); // Move para a pasta de Etapas
    var ss = SpreadsheetApp.openById(newFile.getId());
    
    var emailsParaCompartilhar = [];
    for (var j = 0; j < equipe.instrutores.length; j++) {
      var instrutor = equipe.instrutores[j];
      if (instrutor.email && emailsParaCompartilhar.indexOf(instrutor.email) === -1) {
        emailsParaCompartilhar.push(instrutor.email);
      }
      var aba = encontrarAbaPorCurso(ss, instrutor.curso);
      if (aba) processarAba(aba, instrutor, datasUteis);
    }
    for (var e = 0; e < emailsParaCompartilhar.length; e++) {
      try { newFile.addEditor(emailsParaCompartilhar[e]); } catch (err) {}
    }
    relatorioFinal.planilhas_criadas++;
    relatorioFinal.equipes.push({ equipe: equipe.nome_equipe, url: newFile.getUrl() });
  }
  return relatorioFinal;
}

function processarAba(aba, instrutor, datasUteis) {}

function calcularDiasUteis(dataInicioStr, dataFimStr) {
  var partesIn = dataInicioStr.split("/");
  var start = new Date(partesIn[2], partesIn[1] - 1, partesIn[0]);
  var partesFim = dataFimStr.split("/");
  var end = new Date(partesFim[2], partesFim[1] - 1, partesFim[0]);
  var diasUteis = [];
  var curr = new Date(start);
  while (curr <= end) {
    var diaSemana = curr.getDay();
    var dStr = ('0' + curr.getDate()).slice(-2) + '/' + ('0' + (curr.getMonth()+1)).slice(-2) + '/' + curr.getFullYear();
    if (diaSemana !== 0 && diaSemana !== 6) diasUteis.push(dStr);
    curr.setDate(curr.getDate() + 1);
  }
  return diasUteis;
}

function encontrarAbaPorCurso(ss, nomeCurso) {
  var sheets = ss.getSheets();
  var cursoBuscadoNorm = nomeCurso.toString().toLowerCase().trim();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().toLowerCase().indexOf(cursoBuscadoNorm) > -1) return sheets[i];
  }
  return null;
}

function getNomeMes(dataStr) {
  var partes = dataStr.split("/");
  var meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  return meses[parseInt(partes[1], 10) - 1] + "/" + partes[2];
}
