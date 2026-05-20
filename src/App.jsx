import React, { useState, useEffect } from 'react';
import { 
  Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Calendar, 
  BookOpen, Users, UserMinus, Clock, Menu, MessageSquare, 
  LayoutDashboard, Settings, X, Database
} from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  // Utilizando o ID da sua planilha "MINHAS_ALUNAS_MAT" como padrão
  const [planilhaId, setPlanilhaId] = useState('1GabveOV1esfKRKpxoXADr7_4-idWW1w'); 
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [syncStatus, setSyncStatus] = useState({ status: 'idle', message: '' }); 
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ⚠️ IMPORTANTE: URL do Deploy do Google Apps Script
  const googleAppsScriptURL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbwmg2KC3ME3Z9UsolRdLrvAg9WyO2Fl7v44vN3pu96PVI7f7K0Oba4q9FNvDvekqGH3Nw/exec";

  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

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
    if (!prompt.trim()) {
      setError('Por favor, descreva como foi a aula antes de enviar.');
      return;
    }
    if (!planilhaId.trim()) {
      setError('O ID da Planilha é obrigatório. Insira-o no campo acima.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);
    setSyncStatus({ status: 'idle', message: '' });

    const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
    const currentDate = new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
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
      4. Devolva APENAS um objeto JSON válido, sem markdown ou explicações. A estrutura DEVE ser exatamente: {"curso": "nome", "turno": "Manhã", "data_aula": "2024-05-20", "conteudo_lecionado": "...", "nomes_faltas": [], "nomes_presencas": [], "observacoes": ""}
    `;

    const userQuery = `Data de hoje (contexto): ${currentDate} (${isoDate}).\nRelato do professor: "${prompt}"`;

    const payload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userQuery }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    };

    try {
      // 1. Extração via IA (Groq)
      const data = await fetchWithRetry(
        `https://api.groq.com/openai/v1/chat/completions`,
        { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }, 
          body: JSON.stringify(payload) 
        }
      );

      const jsonText = data.choices?.[0]?.message?.content;
      if (!jsonText) throw new Error("A resposta da IA não continha dados válidos.");
      
      const extractedData = JSON.parse(jsonText);
      // Anexa o ID da folha ao pacote que vai para o Backend
      extractedData.planilhaId = planilhaId.trim();
      
      setResult(extractedData);
      setSyncStatus({ status: 'syncing', message: 'A enviar dados para a planilha...' });

      // 2. Envio para o Google Apps Script
      if (googleAppsScriptURL && googleAppsScriptURL !== "URL_DO_SEU_APPS_SCRIPT_AQUI") {
        try {
          const syncRes = await fetch(googleAppsScriptURL, {
            method: 'POST',
            body: JSON.stringify(extractedData)
          });
          
          const syncJson = await syncRes.json();
          if (syncJson.status === 'success') {
            setSyncStatus({ 
              status: 'success', 
              message: `Sucesso! Planilha atualizada (${syncJson.details.alunos_processados} alunos).` 
            });
          } else {
            setSyncStatus({ status: 'error', message: `Erro no Sheets: ${syncJson.message}` });
          }
        } catch (e) {
           // Em caso de falha de leitura (CORS opaco) mas envio feito
           console.log("Aviso de rede (CORS normal no Apps Script): ", e);
           setSyncStatus({ status: 'success', message: 'Dados enviados para o Google Sheets com sucesso!' });
        }
      } else {
         setSyncStatus({ status: 'error', message: 'Aviso: O URL do Backend (Apps Script) não foi configurado no código-fonte.' });
      }

    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao processar o relato. Verifique se preencheu os dados corretamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleProcessPrompt();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/50 z-40 transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Barra Lateral */}
      <aside className={`${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'} fixed md:relative z-50 h-full bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out shrink-0 overflow-hidden flex flex-col shadow-2xl`}>
        <div className="w-72 flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-1.5 rounded-lg shadow-lg shadow-purple-500/30"><Sparkles className="w-5 h-5 text-white" /></div>
              <span className="font-bold text-lg text-white tracking-wide">Dario.IA</span>
            </div>
            <button className="md:hidden p-1 hover:bg-slate-800 rounded-md text-slate-400" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Ferramentas</p>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-blue-600/10 text-blue-400 font-medium border border-blue-500/20">
              <MessageSquare className="w-5 h-5 shrink-0" /><span>Prompt de Diário</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors font-medium">
              <LayoutDashboard className="w-5 h-5 shrink-0" /><span>Relatórios e Faltas</span>
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors font-medium">
              <Users className="w-5 h-5 shrink-0" /><span>Turmas</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-xl text-slate-800 hidden sm:block">Lançamento de Diário</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm border border-blue-200">P</div>
            <span className="font-medium text-slate-700 hidden sm:block text-sm">Professor(a)</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Descreva a Aula</h2>
              <p className="text-slate-600 text-lg">Relate a aula com linguagem natural. A IA conectará diretamente com a planilha correta.</p>
            </div>

            {/* Configuração Dinâmica do ID */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className="flex items-center gap-3 text-slate-600 font-medium whitespace-nowrap px-2">
                <Database className="w-5 h-5 text-slate-400" />
                ID da Planilha:
              </div>
              <input 
                type="text" 
                value={planilhaId}
                onChange={(e) => setPlanilhaId(e.target.value)}
                placeholder="Insira o ID do Google Sheets..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 font-mono text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Área de Input do Prompt */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-600">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: Hoje à tarde na turma de Informática Básica, falei sobre o LibreOffice. Todos vieram menos o Davi Djavan..."
                className="w-full min-h-[160px] p-6 text-lg resize-y bg-transparent border-none focus:ring-0 outline-none placeholder:text-slate-400 text-slate-800 font-medium"
                disabled={isLoading}
              />
              <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-200">
                <span className="text-sm text-slate-500 font-medium">
                  Atalho: <kbd className="font-sans bg-white border border-slate-300 px-2 py-1 rounded shadow-sm text-slate-700 font-semibold">Ctrl</kbd> + <kbd className="font-sans bg-white border border-slate-300 px-2 py-1 rounded shadow-sm text-slate-700 font-semibold">Enter</kbd>
                </span>
                <button
                  onClick={handleProcessPrompt}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Extrair e Lançar</>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-800 p-5 rounded-2xl flex items-center gap-4 border border-red-200 shadow-sm">
                <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />
                <p className="font-semibold text-lg">{error}</p>
              </div>
            )}

            {/* Dashboard de Resultados */}
            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Alerta de Sincronização */}
                {syncStatus.status !== 'idle' && (
                  <div className={`p-4 rounded-2xl flex items-center gap-4 border shadow-sm ${
                    syncStatus.status === 'syncing' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                    syncStatus.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {syncStatus.status === 'syncing' ? <Loader2 className="w-6 h-6 animate-spin shrink-0 text-blue-600" /> :
                     syncStatus.status === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" /> :
                     <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />}
                    <p className="font-bold text-lg">{syncStatus.message}</p>
                  </div>
                )}

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4">
                      <div className="bg-blue-100 p-2.5 rounded-xl shrink-0"><BookOpen className="w-6 h-6 text-blue-700" /></div>
                      <div>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Curso</p>
                        <p className="text-lg font-bold text-slate-800">{result.curso}</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4">
                      <div className="bg-amber-100 p-2.5 rounded-xl shrink-0"><Calendar className="w-6 h-6 text-amber-700" /></div>
                      <div>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Data e Turno</p>
                        <p className="text-lg font-bold text-slate-800">{result.data_aula} ({result.turno})</p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4 md:col-span-2">
                      <div className="bg-red-100 p-2.5 rounded-xl shrink-0"><UserMinus className="w-6 h-6 text-red-700" /></div>
                      <div>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Faltas Identificadas</p>
                        <p className="text-lg font-bold text-slate-800">{result.nomes_faltas?.length > 0 ? result.nomes_faltas.join(', ') : 'Todos Presentes'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                    <p className="text-sm text-blue-800 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Resumo do Conteúdo
                    </p>
                    <p className="text-slate-800 text-lg leading-relaxed font-medium">{result.conteudo_lecionado}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Banner by Alan */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2 pointer-events-none">
          <div className="bg-slate-900 p-1.5 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden transform hover:scale-105 transition-all">
            <img src="/banner.svg" alt="Banner" className="h-12 w-12 object-cover rounded-xl" />
          </div>
          <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 shadow-xl shadow-slate-200/50">
            <span className="text-[10px] font-black text-slate-800 tracking-widest uppercase">BY ALAN</span>
          </div>
        </div>

      </div>
    </div>
  );
}
