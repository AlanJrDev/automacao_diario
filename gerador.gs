/**
 * GERADOR DE RELATÓRIOS (APPS SCRIPT) — BRASIL.IA
 *
 * Recebe o JSON do Frontend, cria/atualiza planilhas a partir de um Template,
 * calcula dias úteis, preenche cabeçalhos, etapa e envia por e-mail.
 *
 * FÓRMULA DA ETAPA: mesBase + (mesAtual - mesBase)  →  simplificado = mesAtual
 * (mesBase = 1 = Janeiro. Ex: Maio → 1 + (5‑1) = 5 → 5ª ETAPA)
 */

// ==========================================
// CONFIGURAÇÕES
// ==========================================
var TEMPLATE_ID  = "13wot0sKShqyRg6NVxnYBahWIFOzA7SNgoeNozITZaB0";
var FERIADOS_ID  = "1HjA_G1QiSd1UU9OJtPvGOEn4139-i_q_lgYQ5MsA7tA";
var MES_BASE     = 1; // Janeiro

// ==========================================
// CORS — necessário para requisições do frontend
// ==========================================
function doOptions(e) {
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
}

// ==========================================
// PONTO DE ENTRADA GET
// ==========================================
function doGet(e) {
  try {
    var acao = e.parameter ? e.parameter.acao : null;
    if (acao === "listar") {
      // TODO: Implementar leitura da planilha real de alunos e faltas
      // Ex: var ss = SpreadsheetApp.openById('ID_DA_PLANILHA'); ...
      var dadosReais = []; 
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "success",
          data: dadosReais
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "Ação GET inválida" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// PONTO DE ENTRADA POST
// ==========================================
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (payload.acao !== "gerar_planilhas") {
      throw new Error("Ação inválida: " + payload.acao);
    }

    var resultados = gerarPlanilhas(
      payload.equipes,
      payload.data_inicio,
      payload.data_fim
    );

    return ContentService
      .createTextOutput(JSON.stringify({
        status:  "success",
        message: "Planilhas geradas e compartilhadas com sucesso.",
        details: resultados
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Erro no doPost: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status:  "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// FUNÇÃO PRINCIPAL DE GERAÇÃO
// ==========================================
function gerarPlanilhas(equipes, dataInicioStr, dataFimStr) {
  var relatorioFinal = { planilhas_criadas: 0, planilhas_atualizadas: 0, arquivos: [] };

  // 1. Calcular Dias Úteis (data início e fim valem para TODAS as planilhas)
  var datasUteis = calcularDiasUteis(dataInicioStr, dataFimStr);
  if (datasUteis.length === 0) {
    throw new Error("Nenhum dia útil encontrado no período: " + dataInicioStr + " a " + dataFimStr);
  }

  // 2. Calcular Etapa  →  mesBase + (mesAtual - mesBase) = mesAtual
  var mesAtual = parseInt(dataInicioStr.split("/")[1], 10);
  var etapa    = MES_BASE + (mesAtual - MES_BASE); // = mesAtual

  Logger.log("Etapa calculada: " + etapa + "ª (mês " + mesAtual + ")");

  // 3. Contagem de equipes por cidade (para nomear carretas)
  var contagemCidades = {};
  for (var i = 0; i < equipes.length; i++) {
    var cidadeTemp = _getCidadeEquipe(equipes[i]);
    contagemCidades[cidadeTemp] = (contagemCidades[cidadeTemp] || 0) + 1;
  }

  var indiceAtualCidade = {};
  var templateFile = DriveApp.getFileById(TEMPLATE_ID);

  // 4. Processar cada Equipe (máx. 5 instrutores por equipe/carreta)
  for (var eq = 0; eq < equipes.length; eq++) {
    var equipe     = equipes[eq];
    var instrutores = (equipe.instrutores || []).slice(0, 5); // MÁXIMO 5 POR CARRETA

    if (instrutores.length === 0) continue;

    var cidadeEquipe = _getCidadeEquipe(equipe);

    // 4a. Contar arquivos já existentes no Drive para nomear corretamente
    var buscaDrive = DriveApp.searchFiles(
      "title contains 'Diário Provisório- Brasil IA - " + cidadeEquipe + "' " +
      "and title contains '" + etapa + "ª ETAPA' and trashed = false"
    );
    var qtdExistente = 0;
    while (buscaDrive.hasNext()) { buscaDrive.next(); qtdExistente++; }

    indiceAtualCidade[cidadeEquipe] = (indiceAtualCidade[cidadeEquipe] || 0) + 1;
    var numCarreta = qtdExistente + indiceAtualCidade[cidadeEquipe];

    var nomeCidade = cidadeEquipe;
    if (qtdExistente > 0 || contagemCidades[cidadeEquipe] > 1) {
      nomeCidade = cidadeEquipe + " " + numCarreta;
    }

    var nomeArquivo = "Diário Provisório- Brasil IA - " + nomeCidade + " " + etapa + "ª ETAPA";

    // 4b. Verificar se já existe planilha com EXATAMENTE este nome → atualizar
    var buscaExato = DriveApp.searchFiles(
      "title = '" + nomeArquivo + "' and trashed = false"
    );

    var ss;
    var novoPlanilhaFile;
    var isNova = true;

    if (buscaExato.hasNext()) {
      // Planilha já existe → atualizar
      novoPlanilhaFile = buscaExato.next();
      ss = SpreadsheetApp.openById(novoPlanilhaFile.getId());
      isNova = false;
      Logger.log("Planilha existente encontrada: " + nomeArquivo);
    } else {
      // Criar nova a partir do template
      novoPlanilhaFile = templateFile.makeCopy(nomeArquivo);
      ss = SpreadsheetApp.openById(novoPlanilhaFile.getId());
      Logger.log("Nova planilha criada: " + nomeArquivo);
    }

    // 4c. Verificar divergência de matérias (somente em planilhas existentes)
    if (!isNova) {
      _corrigirDivergenciasMaterias(ss, instrutores);
    }

    // 4d. Preencher/atualizar cada aba de instrutor
    for (var i = 0; i < instrutores.length; i++) {
      var instrutor = instrutores[i];
      var aba = encontrarAbaPorCurso(ss, instrutor.curso);

      if (aba) {
        // Renomear aba para o nome exato do curso no prompt
        aba.setName(instrutor.curso);

        // A. Cabeçalho
        var textoCabecalho = nomeCidade + " - " + etapa + "ª ETAPA 2º CICLO";
        aba.getRange("A1").setValue(textoCabecalho);

        // B. Descobrir colunas dinamicamente pela linha de header (linha 2)
        var cols = _descobrirColunas(aba);

        // C. RESET COMPLETO da aba (Email, CPF, DN, Nome aluno, faltas/presenças)
        _resetarAba(aba, cols);

        // D. Datas horizontais (linha 1 e 2 a partir da coluna I)
        if (datasUteis.length > 0) {
          var datasRow = [datasUteis];
          aba.getRange(1, 9, 1, datasUteis.length).setValues(datasRow);
          aba.getRange(2, 9, 1, datasUteis.length).setValues(datasRow);
        }

        // E. Substituir header de nome do aluno
        aba.getRange(2, cols.nomes).setValue("NOME DO ALUNO").setFontWeight("bold");

        // F. Preencher grade de faltas "F" + datas verticais
        var datasVerticais = datasUteis.map(function(d) { return [d]; });
        var linhaF         = datasUteis.map(function() { return "F"; });

        var gradeF_manha = [];
        for (var r = 0; r < 23; r++) gradeF_manha.push(linhaF.slice());

        var gradeF_tarde = [];
        for (var r = 0; r < 28; r++) gradeF_tarde.push(linhaF.slice());

        if (datasVerticais.length > 0) {
          // Datas verticais (coluna de datas)
          aba.getRange(3,  cols.datas, datasVerticais.length, 1).setValues(datasVerticais);
          aba.getRange(27, cols.datas, datasVerticais.length, 1).setValues(datasVerticais);

          // Grade de F — Manhã (linhas 3‑25, colunas I em diante)
          aba.getRange(3,  9, 23, datasUteis.length).setValues(gradeF_manha);
          // Grade de F — Tarde (linhas 27‑54)
          aba.getRange(27, 9, 28, datasUteis.length).setValues(gradeF_tarde);
        }

        Logger.log("Aba preenchida: " + instrutor.curso + " | Instrutor: " + instrutor.nome);
      } else {
        Logger.log("AVISO: Aba não encontrada para o curso: " + instrutor.curso);
      }
    }

    // 4e. Compartilhar com os instrutores
    for (var i = 0; i < instrutores.length; i++) {
      if (instrutores[i].email && instrutores[i].email.trim() !== "") {
        try {
          novoPlanilhaFile.addEditor(instrutores[i].email.trim());
        } catch (shareErr) {
          Logger.log("Erro ao compartilhar com " + instrutores[i].email + ": " + shareErr.message);
        }
      }
    }

    if (isNova) {
      relatorioFinal.planilhas_criadas++;
    } else {
      relatorioFinal.planilhas_atualizadas++;
    }
    relatorioFinal.arquivos.push({
      nome: nomeArquivo,
      url:  novoPlanilhaFile.getUrl(),
      nova: isNova
    });
  }

  return relatorioFinal;
}

// ==========================================
// VERIFICAÇÃO E CORREÇÃO DE MATÉRIAS DIVERGENTES
// ==========================================
function _corrigirDivergenciasMaterias(ss, instrutoresPrompt) {
  var sheets      = ss.getSheets();
  var cursoPrompt = instrutoresPrompt.map(function(i) {
    return normalizeStr(i.curso);
  });

  // Mapeia cursos presentes nas abas
  var cursoAbaMap = {};
  for (var i = 0; i < sheets.length; i++) {
    var nomeAba = sheets[i].getName();
    // Ignora abas de controle (ex: "Instruções", "Config", etc.)
    if (nomeAba.toLowerCase().indexOf("instru") === -1 &&
        nomeAba.toLowerCase().indexOf("config") === -1 &&
        nomeAba.toLowerCase().indexOf("modelo") === -1) {
      cursoAbaMap[normalizeStr(nomeAba)] = sheets[i];
    }
  }

  // Encontra abas que NÃO estão no prompt atual
  var abasNaoNoPrompt = [];
  for (var nomeNorm in cursoAbaMap) {
    if (cursoPrompt.indexOf(nomeNorm) === -1) {
      // Verificar se é match parcial
      var temMatch = false;
      for (var j = 0; j < cursoPrompt.length; j++) {
        if (cursoNorm_contains(nomeNorm, cursoPrompt[j])) {
          temMatch = true; break;
        }
      }
      if (!temMatch) abasNaoNoPrompt.push(nomeNorm);
    }
  }

  // Encontra cursos do prompt que NÃO estão nas abas
  var cursosPromptSemAba = [];
  for (var j = 0; j < cursoPrompt.length; j++) {
    var temAba = false;
    for (var nomeNorm in cursoAbaMap) {
      if (cursoNorm_contains(nomeNorm, cursoPrompt[j]) || cursoNorm_contains(cursoPrompt[j], nomeNorm)) {
        temAba = true; break;
      }
    }
    if (!temAba) cursosPromptSemAba.push(instrutoresPrompt[cursoPrompt.indexOf(cursoPrompt[j])].curso);
  }

  // Substituir a primeira aba sem correspondência pelo primeiro curso sem aba
  for (var k = 0; k < Math.min(abasNaoNoPrompt.length, cursosPromptSemAba.length); k++) {
    var abaParaRenomear = cursoAbaMap[abasNaoNoPrompt[k]];
    var novoCurso       = cursosPromptSemAba[k];
    Logger.log("Divergência: renomeando aba '" + abaParaRenomear.getName() + "' → '" + novoCurso + "'");
    abaParaRenomear.setName(novoCurso);
  }
}

function cursoNorm_contains(a, b) {
  return a.indexOf(b) > -1 || b.indexOf(a) > -1;
}

// ==========================================
// DESCOBERTA DINÂMICA DE COLUNAS
// ==========================================
function _descobrirColunas(aba) {
  var headersRow = aba.getRange(2, 1, 1, 40).getValues()[0];
  var cols = {
    nomes:    3,  // Coluna C (padrão)
    email:    7,  // Coluna G
    cpf:      6,  // Coluna F
    dn:       5,  // Coluna E
    datas:    32, // Coluna AF
    conteudo: 33  // Coluna AG
  };

  for (var h = 0; h < headersRow.length; h++) {
    var txt = headersRow[h] ? headersRow[h].toString().toUpperCase().trim() : "";
    if (txt === "E-MAIL" || txt === "EMAIL")               cols.email    = h + 1;
    if (txt === "CPF")                                     { cols.cpf = h + 1; cols.nomes = h; }
    if (txt === "DN" || txt === "DATA NASC" || txt === "DATA DE NASCIMENTO") cols.dn = h + 1;
    if (txt === "CONTEÚDO" || txt === "CONTEUDO")          cols.conteudo = h + 1;
    if (txt === "DATAS" || txt === "DATA")                 cols.datas    = h + 1;
  }

  return cols;
}

// ==========================================
// RESET DAS COLUNAS DE DADOS DA TURMA
// ==========================================
function _resetarAba(aba, cols) {
  // Limpar: nomes, email, CPF, DN — Manhã (linhas 3‑25) e Tarde (27‑54)
  var colsParaLimpar = [cols.nomes, cols.email, cols.cpf, cols.dn];

  for (var c = 0; c < colsParaLimpar.length; c++) {
    var col = colsParaLimpar[c];
    if (col > 0) {
      aba.getRange(3,  col, 23, 1).clearContent(); // Manhã
      aba.getRange(27, col, 28, 1).clearContent(); // Tarde
    }
  }

  // Limpar grade de presenças/faltas (colunas I→AB = 9→28) e datas verticais
  aba.getRange(3,  9, 23, 20).clearContent(); // Manhã
  aba.getRange(27, 9, 28, 20).clearContent(); // Tarde

  if (cols.datas > 0) {
    aba.getRange(3,  cols.datas, 23, 1).clearContent();
    aba.getRange(27, cols.datas, 28, 1).clearContent();
  }
  if (cols.conteudo > 0) {
    aba.getRange(3,  cols.conteudo, 23, 1).clearContent();
    aba.getRange(27, cols.conteudo, 28, 1).clearContent();
  }
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================
function _getCidadeEquipe(equipe) {
  var inst = equipe.instrutores && equipe.instrutores[0];
  return inst && inst.cidade ? inst.cidade.toUpperCase().trim() : "BRASÍLIA";
}

function calcularDiasUteis(dataInicioStr, dataFimStr) {
  var pi = dataInicioStr.split("/");
  var pf = dataFimStr.split("/");
  var dI = new Date(pi[2], pi[1] - 1, pi[0]);
  var dF = new Date(pf[2], pf[1] - 1, pf[0]);

  var feriados  = carregarFeriados();
  var diasUteis = [];
  var tmp       = new Date(dI.getTime());

  while (tmp <= dF) {
    var dow = tmp.getDay();
    if (dow !== 0 && dow !== 6) { // seg–sex
      var str = pad(tmp.getDate()) + "/" + pad(tmp.getMonth() + 1) + "/" + tmp.getFullYear();
      if (feriados.indexOf(str) === -1) diasUteis.push(str);
    }
    tmp.setDate(tmp.getDate() + 1);
  }
  return diasUteis;
}

function pad(n) { return n < 10 ? "0" + n : "" + n; }

function carregarFeriados() {
  try {
    var ss     = SpreadsheetApp.openById(FERIADOS_ID);
    var aba    = ss.getSheets()[0];
    var vals   = aba.getRange("A2:A60").getDisplayValues();
    var result = [];
    for (var i = 0; i < vals.length; i++) {
      var v = vals[i][0];
      if (v && v.trim() !== "") result.push(v.trim());
    }
    return result;
  } catch (e) {
    Logger.log("Erro ao carregar feriados: " + e.message);
    return [];
  }
}

function encontrarAbaPorCurso(ss, nomeCurso) {
  var sheets         = ss.getSheets();
  var cursoNorm      = normalizeStr(nomeCurso).replace(/\s+/g, "");
  var cursoWords     = normalizeStr(nomeCurso).split(" ").filter(function(w) { return w.length > 3; });

  for (var i = 0; i < sheets.length; i++) {
    var nomeAba     = sheets[i].getName();
    var nomeAbaNorm = normalizeStr(nomeAba).replace(/\s+/g, "");

    if (nomeAbaNorm.indexOf(cursoNorm) > -1 || cursoNorm.indexOf(nomeAbaNorm) > -1) {
      return sheets[i];
    }

    var matchedWords = 0;
    for (var w = 0; w < cursoWords.length; w++) {
      if (normalizeStr(nomeAba).indexOf(cursoWords[w]) > -1) matchedWords++;
    }
    if (matchedWords >= 2) return sheets[i];
  }
  return null;
}

function normalizeStr(text) {
  if (!text) return "";
  return text.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// ==========================================
// AUTORIZAÇÃO (rodar uma vez antes do deploy)
// ==========================================
function configurarPermissoes() {
  try {
    DriveApp.getFiles();
    var dummy = SpreadsheetApp.create("_brasil_ia_dummy_");
    DriveApp.getFileById(dummy.getId()).setTrashed(true);
    Logger.log("Permissões OK! Pode fazer o Deploy agora.");
  } catch (e) {
    Logger.log("Erro nas permissões: " + e.message);
  }
}