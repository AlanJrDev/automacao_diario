/**
 * CÓDIGO PRINCIPAL — BRASIL.IA
 *
 * Script do APPS_SCRIPT_URL (AKfycby_tqud.../exec).
 * Handlers:
 *   GET  ?acao=listar&period=YYYY-MM  →  ler dados da planilha
 *   POST {curso, turno, data_aula, ...}  →  escrever na planilha
 *   POST {acao: "gerar_planilhas", ...}  →  delegar pro gerador (fallback)
 */

var PLANILHA_ID = "13wot0sKShqyRg6NVxnYBahWIFOzA7SNgoeNozITZaB0";

// ==========================================
// CORS
// ==========================================
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
}

// ==========================================
// GET — Listar dados
// ==========================================
function doGet(e) {
  var headers = { "Access-Control-Allow-Origin": "*" };
  try {
    var params = e.parameter;
    if (params.acao === "listar") {
      var period = params.period || "";
      var ss = SpreadsheetApp.openById(PLANILHA_ID);
      var aba = ss.getSheets()[0];
      var dados = aba.getDataRange().getValues();
      if (dados.length < 2) {
        return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
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
      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: linhas }))
        .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "acao desconhecida: " + params.acao }))
      .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  }
}

// ==========================================
// POST — Escrever dados do diario
// ==========================================
function doPost(e) {
  var headers = { "Access-Control-Allow-Origin": "*" };
  try {
    var payload = JSON.parse(e.postData.contents);

    // Lancamento do diario
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
      message: "Registro salvo com sucesso.",
      details: { alunos_processados: (payload.nomes_presencas || []).length + (payload.nomes_faltas || []).length }
    })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  }
}


