import React, { useState, useEffect } from 'react';
import {
  Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Calendar,
  BookOpen, Users, UserMinus, Menu, MessageSquare,
  LayoutDashboard, X, Database, FileSpreadsheet, Bot, Shield,
  ChevronRight, Zap, Mail, Plus, Trash2, Info
} from 'lucide-react';

// ============================================================
// CONSTANTES DE CONFIGURAÇÃO
// ============================================================
const ADMIN_EMAIL = 'alandevbrasil.ia@gmail.com';
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVE38v7r0kREtjzydXasosO5mEWEQo8p6SZ_soS82iHxFstRJ0nE_R0Ra2zyPWAmnS1w/exec";
// URL do Apps Script que irá gerar as planilhas (a ser implantado futuramente)
const GERADOR_SCRIPT_URL = import.meta.env.VITE_GERADOR_SCRIPT_URL || "";

// ============================================================
// TELA: DIÁRIO (principal)
// ============================================================
function DiarioScreen({ userEmail }) {
  const [prompt, setPrompt] = useState('');
  const [planilhaId, setPlanilhaId] = useState('13wot0sKShqyRg6NVxnYBahWIFOzA7SNgoeNozITZaB0');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [syncStatus, setSyncStatus] = useState({ status: 'idle', message: '' });
  const [error, setError] = useState('');

  const fetchWithRetry = async (url, options, retries = 5) => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }
  };

  const handleProcessPrompt = async () => {
    if (!prompt.trim()) { setError('Por favor, descreva como foi a aula antes de enviar.'); return; }
    if (!planilhaId.trim()) { setError('O ID da Planilha é obrigatório.'); return; }

    setIsLoading(true); setError(''); setResult(null);
    setSyncStatus({ status: 'idle', message: '' });

    const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
    const currentDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const isoDate = new Date().toISOString().split('T')[0];

    const systemInstruction = `
      Você é um assistente de extração de dados para um diário de classe.
      Sua tarefa é ler o relato do professor e extrair as informações relevantes em um formato JSON estrito.
      Cursos possíveis: "Informática Básica", "Estética de Jogo", "Criando com a IA", "C# para Iniciantes", "IA e o Futuro do Trabalho".
      Turnos possíveis: "Manhã", "Tarde".
      Regras:
      1. Deduza a data exata com base no relato e na data de hoje.
      2. Extraia o conteúdo lecionado.
      3. Identifique os nomes ou primeiros nomes dos alunos que faltaram e dos que estiveram presentes (se mencionados). Se disser que "ninguém faltou" ou "todos vieram", deixe a lista de faltas vazia.
      4. Devolva APENAS um objeto JSON válido, sem markdown ou explicações. A estrutura DEVE ser exatamente: {"curso": "nome", "turno": "Manhã", "data_aula": "5/14/2026", "conteudo_lecionado": "...", "nomes_faltas": [], "nomes_presencas": [], "observacoes": ""}
      ATENÇÃO CRÍTICA PARA A DATA: A propriedade "data_aula" DEVE ser obrigatoriamente no formato M/D/YYYY (Mês/Dia/Ano) sem zero à esquerda. Exemplo: 14 de Maio de 2026 deve ser "5/14/2026". 4 de Junho de 2026 deve ser "6/4/2026".
    `;

    try {
      const data = await fetchWithRetry(`https://api.groq.com/openai/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemInstruction }, { role: "user", content: `Data de hoje (contexto): ${currentDate} (${isoDate}).\nRelato do professor: "${prompt}"` }],
          response_format: { type: "json_object" },
          temperature: 0.1
        })
      });

      const jsonText = data.choices?.[0]?.message?.content;
      if (!jsonText) throw new Error("A resposta da IA não continha dados válidos.");
      const extractedData = JSON.parse(jsonText);
      extractedData.planilhaId = planilhaId.trim();
      setResult(extractedData);
      setSyncStatus({ status: 'syncing', message: 'A enviar dados para a planilha...' });

      try {
        const syncRes = await fetch(APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(extractedData) });
        const syncJson = await syncRes.json();
        if (syncJson.status === 'success') {
          setSyncStatus({ status: 'success', message: `Sucesso! Planilha atualizada (${syncJson.details.alunos_processados} alunos).` });
        } else {
          setSyncStatus({ status: 'error', message: `Erro no Sheets: ${syncJson.message}` });
        }
      } catch (e) {
        setSyncStatus({ status: 'error', message: 'Erro de comunicação com o Google. A data solicitada provavelmente não existe na planilha.' });
      }
    } catch (err) {
      setError('Ocorreu um erro ao processar o relato. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Descreva a Aula</h2>
          <p className="text-slate-600 text-lg">Relate a aula com linguagem natural. A IA conectará diretamente com a planilha correta.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 text-slate-600 font-medium whitespace-nowrap px-2">
            <Database className="w-5 h-5 text-slate-400" /> ID da Planilha:
          </div>
          <input type="text" value={planilhaId} onChange={(e) => setPlanilhaId(e.target.value)}
            placeholder="Insira o ID do Google Sheets..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 font-mono text-sm focus:outline-none focus:border-purple-400 focus:bg-white transition-colors" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:border-purple-600">
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleProcessPrompt(); }}
            placeholder="Ex: Hoje à tarde na turma de Informática Básica, falei sobre o LibreOffice. Todos vieram menos o Davi..."
            className="w-full min-h-[160px] p-6 text-lg resize-y bg-transparent border-none focus:ring-0 outline-none placeholder:text-slate-400 text-slate-800 font-medium"
            disabled={isLoading} />
          <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-200">
            <span className="text-sm text-slate-500 font-medium">
              Atalho: <kbd className="font-sans bg-white border border-slate-300 px-2 py-1 rounded shadow-sm text-slate-700 font-semibold">Ctrl</kbd> + <kbd className="font-sans bg-white border border-slate-300 px-2 py-1 rounded shadow-sm text-slate-700 font-semibold">Enter</kbd>
            </span>
            <button onClick={handleProcessPrompt} disabled={isLoading || !prompt.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:text-slate-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</> : <><Send className="w-5 h-5" /> Extrair e Lançar</>}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-5 rounded-2xl flex items-center gap-4 border border-red-200">
            <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {syncStatus.status !== 'idle' && (
              <div className={`p-4 rounded-2xl flex items-center gap-4 border ${syncStatus.status === 'syncing' ? 'bg-blue-50 border-blue-200 text-blue-800' : syncStatus.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {syncStatus.status === 'syncing' ? <Loader2 className="w-6 h-6 animate-spin shrink-0 text-blue-600" /> : syncStatus.status === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" /> : <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />}
                <p className="font-bold">{syncStatus.message}</p>
              </div>
            )}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="bg-purple-100 p-2.5 rounded-xl shrink-0"><BookOpen className="w-6 h-6 text-purple-700" /></div>
                  <div><p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Curso</p><p className="text-lg font-bold text-slate-800">{result.curso}</p></div>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="bg-amber-100 p-2.5 rounded-xl shrink-0"><Calendar className="w-6 h-6 text-amber-700" /></div>
                  <div><p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Data e Turno</p><p className="text-lg font-bold text-slate-800">{result.data_aula} ({result.turno})</p></div>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4 md:col-span-2">
                  <div className="bg-red-100 p-2.5 rounded-xl shrink-0"><UserMinus className="w-6 h-6 text-red-700" /></div>
                  <div><p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Faltas Identificadas</p><p className="text-lg font-bold text-slate-800">{result.nomes_faltas?.length > 0 ? result.nomes_faltas.join(', ') : 'Todos Presentes'}</p></div>
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                <p className="text-sm text-purple-800 font-bold uppercase tracking-wider mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Resumo do Conteúdo</p>
                <p className="text-slate-800 text-lg leading-relaxed font-medium">{result.conteudo_lecionado}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================
// TELA: GERAR NOVOS RELATÓRIOS
// ============================================================
function GerarRelatoriosScreen({ userEmail }) {
  const isAdmin = userEmail === ADMIN_EMAIL;
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleGerar = async () => {
    if (!prompt.trim()) {
      setStatus({ type: 'error', message: 'Por favor, descreva a matriz com os instrutores e equipes.' });
      return;
    }
    setIsLoading(true);
    setStatus({ type: 'loading', message: 'Processando e gerando planilhas. Isso pode levar alguns minutos...' });

    try {
      // Prepara o payload para o Apps Script gerador
      const payload = {
        acao: 'gerar_planilhas',
        prompt: prompt.trim(),
        solicitadoPor: userEmail,
        timestamp: new Date().toISOString()
      };

      // Envia para o Apps Script gerador (URL a ser configurada)
      if (!GERADOR_SCRIPT_URL) {
        // Simulação quando o script ainda não foi configurado
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStatus({
          type: 'warning',
          message: 'Frontend pronto! O Apps Script de geração ainda não foi configurado. Adicione a variável VITE_GERADOR_SCRIPT_URL quando o backend estiver pronto.'
        });
        return;
      }

      const res = await fetch(GERADOR_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) });
      const json = await res.json();

      if (json.status === 'success') {
        setStatus({ type: 'success', message: `Planilhas geradas com sucesso! ${json.details?.planilhas_criadas || ''} planilhas enviadas por e-mail.` });
        setPrompt('');
      } else {
        setStatus({ type: 'error', message: `Erro: ${json.message}` });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Erro de comunicação. Verifique se o Apps Script está configurado corretamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header da tela */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-2.5 rounded-xl shadow-lg shadow-purple-500/20">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Gerar Novos Relatórios</h2>
              <p className="text-slate-500 text-sm font-medium">Geração automática de planilhas mensais via IA</p>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex gap-4">
          <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="text-sm text-purple-800 space-y-1">
            <p className="font-bold">Como funciona:</p>
            <p>Descreva a matriz de instrutores com seus respectivos cursos e equipes. A IA irá processar e o sistema gerará automaticamente as planilhas provisórias mensais e as enviará por e-mail para cada instrutor.</p>
          </div>
        </div>

        {/* Exemplo de formato */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Exemplo de formato do prompt</p>
          <pre className="text-sm text-slate-700 bg-slate-50 rounded-xl p-4 overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
{`Carreta 1 - Equipe Norte:
- Instrutor: João Silva | Email: joao@email.com | Curso: Informática Básica | Turno: Manhã | Cidade: Planaltina
- Instrutora: Maria Santos | Email: maria@email.com | Curso: Criando com a IA | Turno: Tarde | Cidade: Sobradinho

Carreta 2 - Equipe Sul:
- Instrutor: Pedro Lima | Email: pedro@email.com | Curso: C# para Iniciantes | Turno: Manhã | Cidade: Gama
...`}
          </pre>
        </div>

        {/* Área de prompt */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden focus-within:ring-4 focus-within:ring-purple-500/20 focus-within:border-purple-600">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGerar(); }}
            placeholder="Descreva aqui a matriz de instrutores, equipes, cursos, cidades e e-mails..."
            className="w-full min-h-[220px] p-6 text-base resize-y bg-transparent border-none focus:ring-0 outline-none placeholder:text-slate-400 text-slate-800 font-medium"
            disabled={isLoading}
          />
          <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-200">
            <span className="text-sm text-slate-500 font-medium">
              Atalho: <kbd className="font-sans bg-white border border-slate-300 px-2 py-1 rounded shadow-sm text-slate-700 font-semibold">Ctrl</kbd> + <kbd className="font-sans bg-white border border-slate-300 px-2 py-1 rounded shadow-sm text-slate-700 font-semibold">Enter</kbd>
            </span>

            {/* Botão só aparece para o admin */}
            {isAdmin ? (
              <button
                onClick={handleGerar}
                disabled={isLoading || !prompt.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/25"
              >
                {isLoading
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Gerando Planilhas...</>
                  : <><Zap className="w-5 h-5" /> Gerar e Enviar Planilhas</>
                }
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-100 px-4 py-2 rounded-xl">
                <Shield className="w-4 h-4" />
                <span>Ação restrita ao administrador</span>
              </div>
            )}
          </div>
        </div>

        {/* Status feedback */}
        {status.type !== 'idle' && (
          <div className={`p-5 rounded-2xl flex items-start gap-4 border ${
            status.type === 'loading' ? 'bg-blue-50 border-blue-200 text-blue-800' :
            status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            status.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            {status.type === 'loading' && <Loader2 className="w-6 h-6 animate-spin shrink-0 text-blue-600 mt-0.5" />}
            {status.type === 'success' && <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600 mt-0.5" />}
            {status.type === 'warning' && <AlertCircle className="w-6 h-6 shrink-0 text-amber-600 mt-0.5" />}
            {status.type === 'error' && <AlertCircle className="w-6 h-6 shrink-0 text-red-600 mt-0.5" />}
            <p className="font-semibold">{status.message}</p>
          </div>
        )}

        {/* Aviso para não-admin */}
        {!isAdmin && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
            <Shield className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="font-bold text-slate-700 mb-1">Visualização disponível para todos</p>
            <p className="text-sm text-slate-500">O botão de geração é exclusivo do administrador. Você pode visualizar esta tela, mas a ação de gerar planilhas é restrita.</p>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================
// TELA: RELATÓRIOS (placeholder)
// ============================================================
function RelatoriosScreen() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Relatórios e Faltas</h2>
          <p className="text-slate-600 text-lg">Visualize o histórico de lançamentos e relatórios de frequência.</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <LayoutDashboard className="w-16 h-16 text-purple-200 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700 mb-2">Em breve</p>
          <p className="text-slate-500">Esta seção está sendo desenvolvida. Em breve você poderá visualizar relatórios completos de frequência por turma e período.</p>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// TELA: TURMAS (placeholder)
// ============================================================
function TurmasScreen() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Turmas</h2>
          <p className="text-slate-600 text-lg">Gerencie as turmas organizadas por carreta, etapa e cidade.</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <Users className="w-16 h-16 text-purple-200 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-700 mb-2">Em breve</p>
          <p className="text-slate-500">Esta seção está sendo desenvolvida. Em breve você poderá visualizar e gerenciar todas as turmas por carreta e cidade.</p>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function App() {
  const [activeScreen, setActiveScreen] = useState('diario');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Email do usuário logado (mock até implementar Google Auth)
  // Troque este valor para testar as permissões de admin
  const userEmail = ADMIN_EMAIL; // Será substituído pelo email real do Google Auth
  const isAdmin = userEmail === ADMIN_EMAIL;

  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const navItems = [
    { id: 'diario', label: 'Prompt de Diário', icon: MessageSquare },
    { id: 'relatorios', label: 'Relatórios e Faltas', icon: LayoutDashboard },
    { id: 'turmas', label: 'Turmas', icon: Users },
    { id: 'gerar', label: 'Gerar Novos Relatórios', icon: FileSpreadsheet },
  ];

  const screenTitles = {
    diario: 'Lançamento de Diário',
    relatorios: 'Relatórios e Faltas',
    turmas: 'Turmas',
    gerar: 'Gerar Novos Relatórios',
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Barra Lateral */}
      <aside className={`${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'} fixed md:relative z-50 h-full bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out shrink-0 overflow-hidden flex flex-col shadow-2xl`}>
        <div className="w-72 flex flex-col h-full">

          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-violet-700 p-1.5 rounded-lg shadow-lg shadow-purple-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg tracking-wider">
                <span className="text-white">DIÁRIO</span>
                <span className="text-purple-400">.IA</span>
              </span>
            </div>
            <button className="md:hidden p-1 hover:bg-slate-800 rounded-md text-slate-400" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ferramentas</p>

            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = activeScreen === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActiveScreen(id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/25'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
                </button>
              );
            })}
          </nav>

          {/* Info do usuário */}
          <div className="px-4 pb-4 border-t border-slate-800 pt-4 shrink-0">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/60">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isAdmin ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white' : 'bg-slate-600 text-slate-200'}`}>
                {isAdmin ? <Shield className="w-4 h-4" /> : userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                {isAdmin && <p className="text-xs font-bold text-purple-400">Administrador</p>}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-xl text-slate-800 hidden sm:block">{screenTitles[activeScreen]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border ${isAdmin ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
              {isAdmin ? <Shield className="w-4 h-4" /> : userEmail.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-slate-700 hidden sm:block text-sm">{isAdmin ? 'Administrador' : 'Professor(a)'}</span>
          </div>
        </header>

        {/* Renderização condicional das telas */}
        {activeScreen === 'diario' && <DiarioScreen userEmail={userEmail} />}
        {activeScreen === 'gerar' && <GerarRelatoriosScreen userEmail={userEmail} />}
        {activeScreen === 'relatorios' && <RelatoriosScreen />}
        {activeScreen === 'turmas' && <TurmasScreen />}

        {/* Banner by Alan */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2 pointer-events-none">
          <div className="bg-slate-900 p-1.5 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <img src="/banner.svg" alt="Banner" className="h-12 w-12 object-cover rounded-xl" />
          </div>
          <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 shadow-xl">
            <span className="text-[10px] font-black text-slate-800 tracking-widest uppercase">BY ALAN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
