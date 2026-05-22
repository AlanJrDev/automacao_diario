import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip,
  LineChart, Line
} from 'recharts';
import {
  Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Calendar,
  BookOpen, Users, UserMinus, Menu, MessageSquare,
  LayoutDashboard, X, Database, FileSpreadsheet, Shield,
  ChevronRight, Zap, Mail, Plus, Info, Bot, Activity,
  TrendingDown, MapPin, User, Phone, Hash, ChevronDown,
  RefreshCw, Brain, Eye, AlertTriangle
} from 'lucide-react';
import './index.css';

// ============================================================
// CONSTANTES
// ============================================================
const ADMIN_EMAIL        = 'alandevbrasil.ia@gmail.com';
const APPS_SCRIPT_URL    = 'https://script.google.com/macros/s/AKfycby_tqud-aLgMg0tWxzT3FpoM4i2jBXJGV3OkoqxaVSgTatLTJTS0kx-N3sSzGoqG5Xd9Q/exec';
const GERADOR_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby05vGuyjhflrARwS4uXd65gmjCLLY34xcH_J0liGl9wZWRvjkERAEgfyingu16r5cmqA/exec';

// ============================================================
// MOCK DATA — Dashboard de Faltas
// ============================================================
const MOCK_TURMAS = ['Informática Básica', 'Criando com a IA', 'C# para Iniciantes', 'IA e o Futuro do Trabalho', 'Estética de Jogo'];
const MOCK_CIDADES = ['Planaltina', 'Sobradinho', 'Gama', 'Taguatinga', 'Ceilândia'];
const MOCK_INSTRUTORES = [
  { nome: 'João Silva',    cidade: 'Planaltina', curso: 'Informática Básica' },
  { nome: 'Maria Santos',  cidade: 'Sobradinho',  curso: 'Criando com a IA' },
  { nome: 'Pedro Lima',    cidade: 'Gama',        curso: 'C# para Iniciantes' },
  { nome: 'Carla Mendes',  cidade: 'Taguatinga',  curso: 'IA e o Futuro do Trabalho' },
  { nome: 'Rafael Costa',  cidade: 'Ceilândia',   curso: 'Estética de Jogo' },
];
const MOCK_ALUNOS = [
  { id:1, nome:'Ana Carolina Silva',    turno:'Manhã',  faltas:2,  totalAulas:20, cpf:'***.***.***-01', dn:'15/03/2000', email:'ana@email.com',    tel:'61 9 9999-0001', tipo:'Soldado'  },
  { id:2, nome:'Bruno Mendes Costa',    turno:'Tarde',  faltas:9,  totalAulas:20, cpf:'***.***.***-02', dn:'22/07/1998', email:'bruno@email.com',  tel:'61 9 9999-0002', tipo:'Cidadão'  },
  { id:3, nome:'Carla Oliveira Lima',   turno:'Manhã',  faltas:1,  totalAulas:20, cpf:'***.***.***-03', dn:'08/11/2001', email:'carla@email.com',  tel:'61 9 9999-0003', tipo:'Soldado'  },
  { id:4, nome:'Diego Ferreira Santos', turno:'Tarde',  faltas:11, totalAulas:20, cpf:'***.***.***-04', dn:'30/05/1997', email:'diego@email.com',  tel:'61 9 9999-0004', tipo:'Cidadão'  },
  { id:5, nome:'Eduarda Rocha Alves',   turno:'Manhã',  faltas:0,  totalAulas:20, cpf:'***.***.***-05', dn:'14/02/2002', email:'edu@email.com',    tel:'61 9 9999-0005', tipo:'Soldado'  },
  { id:6, nome:'Felipe Nascimento',     turno:'Tarde',  faltas:6,  totalAulas:20, cpf:'***.***.***-06', dn:'19/09/1999', email:'felipe@email.com', tel:'61 9 9999-0006', tipo:'Cidadão'  },
  { id:7, nome:'Gabriela Moura Costa',  turno:'Manhã',  faltas:3,  totalAulas:20, cpf:'***.***.***-07', dn:'27/04/2003', email:'gabi@email.com',   tel:'61 9 9999-0007', tipo:'Soldado'  },
  { id:8, nome:'Henrique Dias Lima',    turno:'Tarde',  faltas:14, totalAulas:20, cpf:'***.***.***-08', dn:'03/12/1996', email:'henri@email.com',  tel:'61 9 9999-0008', tipo:'Cidadão'  },
];
const HEATMAP_DATA = [
  { data:'01/05', faltas:2, presencas:28 },{ data:'02/05', faltas:0, presencas:30 },{ data:'05/05', faltas:5, presencas:25 },
  { data:'06/05', faltas:1, presencas:29 },{ data:'07/05', faltas:8, presencas:22 },{ data:'08/05', faltas:3, presencas:27 },
  { data:'09/05', faltas:0, presencas:30 },{ data:'12/05', faltas:6, presencas:24 },{ data:'13/05', faltas:2, presencas:28 },
  { data:'14/05', faltas:4, presencas:26 },{ data:'15/05', faltas:1, presencas:29 },{ data:'16/05', faltas:9, presencas:21 },
  { data:'19/05', faltas:3, presencas:27 },{ data:'20/05', faltas:2, presencas:28 },{ data:'21/05', faltas:0, presencas:30 },
];

// ============================================================
// ROBOT LOGO SVG — Elegante + Animado
// ============================================================
function BrasilIARobot({ size = 36, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={`robot-pulse ${className}`}>
      <defs>
        <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="glow-r" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Hexagonal outer ring */}
      <polygon points="24,2 42,12 42,36 24,46 6,36 6,12" stroke="url(#rg1)" strokeWidth="1.2" fill="rgba(139,92,246,0.08)" filter="url(#glow-r)" />
      {/* Circuit lines */}
      <line x1="6" y1="24" x2="12" y2="24" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.7"/>
      <line x1="36" y1="24" x2="42" y2="24" stroke="#8b5cf6" strokeWidth="0.8" opacity="0.7"/>
      <circle cx="5" cy="24" r="1.5" fill="#8b5cf6" opacity="0.7"/>
      <circle cx="43" cy="24" r="1.5" fill="#8b5cf6" opacity="0.7"/>
      {/* Face panel */}
      <rect x="14" y="15" width="20" height="16" rx="3" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.5)" strokeWidth="0.8"/>
      {/* Eyes */}
      <circle cx="19.5" cy="22" r="2.8" fill="rgba(139,92,246,0.3)" stroke="#a78bfa" strokeWidth="0.8" filter="url(#glow-r)"/>
      <circle cx="28.5" cy="22" r="2.8" fill="rgba(139,92,246,0.3)" stroke="#a78bfa" strokeWidth="0.8" filter="url(#glow-r)"/>
      <circle cx="19.5" cy="22" r="1.2" fill="#c4b5fd"/>
      <circle cx="28.5" cy="22" r="1.2" fill="#c4b5fd"/>
      <circle cx="20.2" cy="21.3" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="29.2" cy="21.3" r="0.5" fill="white" opacity="0.8"/>
      {/* Scan line */}
      <rect x="17" y="27" width="14" height="1.5" rx="0.75" fill="#8b5cf6" opacity="0.5" className="robot-scan"/>
      {/* Antenna */}
      <line x1="24" y1="2" x2="24" y2="10" stroke="url(#rg1)" strokeWidth="1.5"/>
      <circle cx="24" cy="2" r="2" fill="#8b5cf6" filter="url(#glow-r)"/>
      <circle cx="24" cy="2" r="0.8" fill="white"/>
      {/* Legs */}
      <line x1="18" y1="41" x2="18" y2="46" stroke="#7c3aed" strokeWidth="1.5" opacity="0.6"/>
      <line x1="30" y1="41" x2="30" y2="46" stroke="#7c3aed" strokeWidth="1.5" opacity="0.6"/>
      <rect x="15" y="44" width="6" height="2" rx="1" fill="#7c3aed" opacity="0.5"/>
      <rect x="27" y="44" width="6" height="2" rx="1" fill="#7c3aed" opacity="0.5"/>
    </svg>
  );
}

// ============================================================
// UTILITY
// ============================================================
const fetchWithRetry = async (url, options, retries = 5) => {
  const delays = [1000, 2000, 4000, 8000, 16000];
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(url, options);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
};

const getAssiduidade = (aluno) => Math.round(((aluno.totalAulas - aluno.faltas) / aluno.totalAulas) * 100);

// ============================================================
// TELA: DIÁRIO (prompt de aula)
// ============================================================
function DiarioScreen({ userEmail }) {
  const [prompt, setPrompt]       = useState('');
  const [planilhaId, setPlanilhaId] = useState('13wot0sKShqyRg6NVxnYBahWIFOzA7SNgoeNozITZaB0');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult]       = useState(null);
  const [syncStatus, setSyncStatus] = useState({ status: 'idle', message: '' });
  const [error, setError]         = useState('');

  const handleProcessPrompt = async () => {
    if (!prompt.trim()) { setError('Por favor, descreva como foi a aula antes de enviar.'); return; }
    if (!planilhaId.trim()) { setError('O ID da Planilha é obrigatório.'); return; }
    setIsLoading(true); setError(''); setResult(null);
    setSyncStatus({ status: 'idle', message: '' });

    const apiKey      = import.meta.env.VITE_GROQ_API_KEY || '';
    const currentDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const isoDate     = new Date().toISOString().split('T')[0];

    const systemInstruction = `
      Você é um assistente de extração de dados para um diário de classe.
      Sua tarefa é ler o relato do professor e extrair as informações em um JSON estrito.
      Cursos possíveis: "Informática Básica", "Estética de Jogo", "Criando com a IA", "C# para Iniciantes", "IA e o Futuro do Trabalho".
      Turnos possíveis: "Manhã", "Tarde".
      Regras:
      1. Deduza a data exata com base no relato e na data de hoje.
      2. Extraia o conteúdo lecionado.
      3. Identifique os nomes ou primeiros nomes dos alunos que faltaram e dos que estiveram presentes.
      4. Devolva APENAS um objeto JSON válido sem markdown. Estrutura: {"curso":"nome","turno":"Manhã","data_aula":"5/14/2026","conteudo_lecionado":"...","nomes_faltas":[],"nomes_presencas":[],"observacoes":""}
      CRÍTICO: "data_aula" deve estar em formato M/D/YYYY sem zero à esquerda. Ex: 14/Maio/2026 → "5/14/2026".
    `;

    try {
      const data = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: `Data de hoje: ${currentDate} (${isoDate}).\nRelato: "${prompt}"` }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1
        })
      });

      const jsonText = data.choices?.[0]?.message?.content;
      if (!jsonText) throw new Error('A resposta da IA não continha dados válidos.');
      const extracted = JSON.parse(jsonText);
      extracted.planilhaId = planilhaId.trim();
      setResult(extracted);
      setSyncStatus({ status: 'syncing', message: 'Enviando dados para a planilha...' });

      try {
        const syncRes = await fetch(APPS_SCRIPT_URL, { method: 'POST', body: JSON.stringify(extracted) });
        const syncJson = await syncRes.json();
        if (syncJson.status === 'success') {
          setSyncStatus({ status: 'success', message: `Sucesso! ${syncJson.details.alunos_processados} alunos processados.` });
        } else {
          setSyncStatus({ status: 'error', message: `Erro no Sheets: ${syncJson.message}` });
        }
      } catch (e) {
        setSyncStatus({ status: 'error', message: 'Erro de comunicação com o Google Sheets.' });
      }
    } catch (err) {
      setError('Ocorreu um erro ao processar o relato. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 screen-light">
      <div style={{ maxWidth: 860, margin: '0 auto' }} className="space-y-6">
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>Descreva a Aula</h2>
          <p style={{ color: '#64748b', marginTop: 6 }}>Relate a aula em linguagem natural. A IA identificará o curso e registrará presença na planilha.</p>
        </div>

        {/* Planilha ID */}
        <div style={{ background:'white', padding:16, borderRadius:16, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:12, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <Database style={{ width:20, height:20, color:'#94a3b8', flexShrink:0 }} />
          <span style={{ color:'#64748b', fontWeight:500, whiteSpace:'nowrap' }}>ID da Planilha</span>
          <input type="text" value={planilhaId} onChange={e => setPlanilhaId(e.target.value)}
            placeholder="Insira o ID do Google Sheets..."
            style={{ flex:1, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'8px 14px', color:'#334155', fontFamily:'monospace', fontSize:13 }} />
        </div>

        {/* Textarea */}
        <div style={{ background:'white', borderRadius:16, border:'1px solid #cbd5e1', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleProcessPrompt(); }}
            placeholder="Ex: Hoje à tarde na turma de Informática Básica, ensinei sobre planilhas. Todos vieram menos o Davi e a Maria..."
            style={{ width:'100%', minHeight:160, padding:24, fontSize:17, resize:'vertical', background:'transparent', border:'none', outline:'none', color:'#1e293b', fontWeight:500, fontFamily:'Inter, sans-serif' }}
            disabled={isLoading} />
          <div style={{ background:'#f8fafc', padding:'12px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #e2e8f0', flexWrap:'wrap', gap:12 }}>
            <span style={{ fontSize:13, color:'#94a3b8' }}>Atalho: <kbd style={{ background:'white', border:'1px solid #e2e8f0', padding:'2px 8px', borderRadius:6, fontFamily:'sans-serif', fontWeight:600, color:'#475569' }}>Ctrl</kbd> + <kbd style={{ background:'white', border:'1px solid #e2e8f0', padding:'2px 8px', borderRadius:6, fontFamily:'sans-serif', fontWeight:600, color:'#475569' }}>Enter</kbd></span>
            <button onClick={handleProcessPrompt} disabled={isLoading || !prompt.trim()}
              style={{ display:'flex', alignItems:'center', gap:8, background: isLoading || !prompt.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: isLoading || !prompt.trim() ? '#94a3b8' : 'white', padding:'10px 28px', borderRadius:12, fontWeight:700, border:'none', cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer', fontSize:15, boxShadow: isLoading || !prompt.trim() ? 'none' : '0 4px 20px rgba(139,92,246,0.3)', transition:'all 0.2s' }}>
              {isLoading ? <><Loader2 style={{ width:18, height:18, animation:'spin 1s linear infinite' }} /> Processando...</> : <><Send style={{ width:18, height:18 }} /> Extrair e Lançar</>}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:'#fef2f2', color:'#991b1b', padding:'16px 20px', borderRadius:14, display:'flex', alignItems:'center', gap:12, border:'1px solid #fecaca' }}>
            <AlertCircle style={{ width:22, height:22, color:'#dc2626', flexShrink:0 }} />
            <p style={{ fontWeight:600 }}>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {syncStatus.status !== 'idle' && (
              <div style={{ padding:'14px 20px', borderRadius:14, display:'flex', alignItems:'center', gap:12, border:'1px solid', background: syncStatus.status==='syncing'?'#eff6ff':syncStatus.status==='success'?'#f0fdf4':'#fef2f2', borderColor: syncStatus.status==='syncing'?'#bfdbfe':syncStatus.status==='success'?'#bbf7d0':'#fecaca', color: syncStatus.status==='syncing'?'#1e40af':syncStatus.status==='success'?'#15803d':'#991b1b' }}>
                {syncStatus.status==='syncing' ? <Loader2 style={{ width:22,height:22,animation:'spin 1s linear infinite',flexShrink:0 }}/> : syncStatus.status==='success' ? <CheckCircle2 style={{ width:22,height:22,flexShrink:0,color:'#16a34a' }}/> : <AlertCircle style={{ width:22,height:22,flexShrink:0,color:'#dc2626' }}/>}
                <p style={{ fontWeight:700 }}>{syncStatus.message}</p>
              </div>
            )}
            <div style={{ background:'white', borderRadius:24, border:'1px solid #e2e8f0', padding:32, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16, marginBottom:24 }}>
                {[
                  { icon: BookOpen, bg:'#f3e8ff', ic:'#7c3aed', label:'Curso', val: result.curso },
                  { icon: Calendar, bg:'#fef3c7', ic:'#d97706', label:'Data e Turno', val: `${result.data_aula} (${result.turno})` },
                  { icon: UserMinus, bg:'#fee2e2', ic:'#dc2626', label:'Faltas', val: result.nomes_faltas?.length > 0 ? result.nomes_faltas.join(', ') : 'Todos Presentes', span: 2 },
                ].map(({ icon: Icon, bg, ic, label, val, span }) => (
                  <div key={label} style={{ background:'#f8fafc', padding:20, borderRadius:16, border:'1px solid #e2e8f0', display:'flex', alignItems:'flex-start', gap:14, gridColumn: span ? `span ${span}` : 'auto' }}>
                    <div style={{ background:bg, padding:10, borderRadius:12, flexShrink:0 }}><Icon style={{ width:22, height:22, color:ic }}/></div>
                    <div><p style={{ fontSize:11, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{label}</p><p style={{ fontSize:16, fontWeight:700, color:'#1e293b' }}>{val}</p></div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#f5f3ff', padding:24, borderRadius:16, border:'1px solid #ddd6fe' }}>
                <p style={{ fontSize:11, color:'#6d28d9', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:10, display:'flex', alignItems:'center', gap:6 }}><BookOpen style={{ width:14, height:14 }}/> Conteúdo Lecionado</p>
                <p style={{ color:'#1e293b', fontSize:16, lineHeight:1.7, fontWeight:500 }}>{result.conteudo_lecionado}</p>
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
    if (!prompt.trim()) { setStatus({ type: 'error', message: 'Por favor, descreva a matriz de instrutores.' }); return; }
    setIsLoading(true);
    setStatus({ type: 'loading', message: 'Extraindo dados com IA...' });

    const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString('pt-BR');
    const lastDay  = new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString('pt-BR');

    const systemInstruction = `
      Você é um assistente de extração de dados para automação de planilhas.
      Leia o texto e extraia as informações em formato JSON estrito.
      Regras:
      - "data_inicio": DD/MM/YYYY (padrão: "${firstDay}" se não informado)
      - "data_fim": DD/MM/YYYY (padrão: "${lastDay}" se não informado)
      - "equipes": array de objetos com "nome_equipe" (string) e "instrutores" (array de objetos com "nome","email","curso","cidade")
      - Máximo de 5 instrutores por equipe.
      - Se campo não encontrado, use string vazia "".
      - Retorne APENAS o JSON válido, sem comentários.
    `;

    try {
      const groqRes = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: `Prompt: "${prompt}"` }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1
        })
      });

      const jsonText = groqRes.choices?.[0]?.message?.content;
      if (!jsonText) throw new Error('A IA não retornou um JSON válido.');
      const payload = JSON.parse(jsonText);
      payload.acao = 'gerar_planilhas';
      payload.solicitadoPor = userEmail;

      setStatus({ type: 'loading', message: 'Enviando para o Google Apps Script (gerando planilhas)...' });

      const res  = await fetch(GERADOR_SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload) });
      const json = await res.json();

      if (json.status === 'success') {
        setStatus({ type: 'success', message: `Planilhas geradas! ${json.details?.planilhas_criadas || 0} criadas, ${json.details?.planilhas_atualizadas || 0} atualizadas.` });
        setPrompt('');
      } else {
        setStatus({ type: 'error', message: `Erro no Script: ${json.message}` });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Erro ao processar. Verifique o prompt ou a conexão.' });
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors = {
    loading: { bg:'#eff6ff', border:'#bfdbfe', color:'#1e40af' },
    success: { bg:'#f0fdf4', border:'#bbf7d0', color:'#15803d' },
    warning: { bg:'#fffbeb', border:'#fde68a', color:'#92400e' },
    error:   { bg:'#fef2f2', border:'#fecaca', color:'#991b1b' },
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 screen-light">
      <div style={{ maxWidth: 860, margin: '0 auto' }} className="space-y-6">
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', padding:12, borderRadius:14, boxShadow:'0 4px 16px rgba(139,92,246,0.3)' }}>
            <FileSpreadsheet style={{ width:24, height:24, color:'white' }}/>
          </div>
          <div>
            <h2 style={{ fontSize:'1.875rem', fontWeight:800, color:'#0f172a', lineHeight:1.2 }}>Gerar Novos Relatórios</h2>
            <p style={{ color:'#64748b', fontSize:14, marginTop:2 }}>Geração automática de planilhas mensais via IA</p>
          </div>
        </div>

        <div style={{ background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:16, padding:20, display:'flex', gap:14 }}>
          <Info style={{ width:18, height:18, color:'#7c3aed', flexShrink:0, marginTop:2 }}/>
          <div style={{ fontSize:14, color:'#5b21b6' }}>
            <p style={{ fontWeight:700, marginBottom:4 }}>Como funciona:</p>
            <p>Descreva a matriz de instrutores com cursos, equipes, cidades e e-mails. A IA processa e o sistema gera as planilhas mensais automaticamente, enviando por e-mail para cada instrutor. Cada equipe suporta até <strong>5 instrutores</strong> (um por matéria/aba).</p>
          </div>
        </div>

        {/* Exemplo */}
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:16, padding:20, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Exemplo de formato</p>
          <pre style={{ fontSize:12, color:'#475569', background:'#f8fafc', borderRadius:10, padding:16, overflowX:'auto', fontFamily:'monospace', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{`Carreta 1 - Equipe Norte (Planaltina):
- João Silva | joao@email.com | Informática Básica
- Maria Santos | maria@email.com | Criando com a IA
- Pedro Lima | pedro@email.com | C# para Iniciantes
- Carla Dias | carla@email.com | IA e o Futuro do Trabalho
- Rafael Costa | rafael@email.com | Estética de Jogo
Período: 01/05/2026 a 31/05/2026`}</pre>
        </div>

        {/* Textarea */}
        <div style={{ background:'white', borderRadius:16, border:'1px solid #cbd5e1', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter'&&(e.ctrlKey||e.metaKey)) handleGerar(); }}
            placeholder="Descreva aqui a matriz de instrutores, equipes, cursos, cidades e e-mails..."
            style={{ width:'100%', minHeight:220, padding:24, fontSize:15, resize:'vertical', background:'transparent', border:'none', outline:'none', color:'#1e293b', fontWeight:500, fontFamily:'Inter, sans-serif' }}
            disabled={isLoading} />
          <div style={{ background:'#f8fafc', padding:'12px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #e2e8f0', flexWrap:'wrap', gap:12 }}>
            <span style={{ fontSize:13, color:'#94a3b8' }}>Atalho: <kbd style={{ background:'white', border:'1px solid #e2e8f0', padding:'2px 8px', borderRadius:6, fontFamily:'sans-serif', fontWeight:600, color:'#475569' }}>Ctrl</kbd> + <kbd style={{ background:'white', border:'1px solid #e2e8f0', padding:'2px 8px', borderRadius:6, fontFamily:'sans-serif', fontWeight:600, color:'#475569' }}>Enter</kbd></span>
            {isAdmin ? (
              <button onClick={handleGerar} disabled={isLoading || !prompt.trim()}
                style={{ display:'flex', alignItems:'center', gap:8, background: isLoading || !prompt.trim() ? '#e2e8f0' : 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: isLoading || !prompt.trim() ? '#94a3b8' : 'white', padding:'10px 28px', borderRadius:12, fontWeight:700, border:'none', cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer', fontSize:15, boxShadow: isLoading || !prompt.trim() ? 'none' : '0 4px 20px rgba(139,92,246,0.3)' }}>
                {isLoading ? <><Loader2 style={{ width:18, height:18, animation:'spin 1s linear infinite' }}/> Gerando...</> : <><Zap style={{ width:18, height:18 }}/> Gerar e Enviar</>}
              </button>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#94a3b8', background:'#f1f5f9', padding:'8px 16px', borderRadius:10 }}>
                <Shield style={{ width:14, height:14 }}/> Ação restrita ao administrador
              </div>
            )}
          </div>
        </div>

        {status.type !== 'idle' && (
          <div style={{ padding:'16px 20px', borderRadius:14, display:'flex', alignItems:'center', gap:12, border:'1px solid', ...(statusColors[status.type] || {}) }}>
            {status.type === 'loading' && <Loader2 style={{ width:22, height:22, animation:'spin 1s linear infinite', flexShrink:0 }}/>}
            {status.type === 'success' && <CheckCircle2 style={{ width:22, height:22, flexShrink:0, color:'#16a34a' }}/>}
            {status.type === 'error'   && <AlertCircle  style={{ width:22, height:22, flexShrink:0, color:'#dc2626' }}/>}
            {status.type === 'warning' && <AlertCircle  style={{ width:22, height:22, flexShrink:0, color:'#d97706' }}/>}
            <p style={{ fontWeight:600 }}>{status.message}</p>
          </div>
        )}

        {!isAdmin && (
          <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:16, padding:28, textAlign:'center' }}>
            <Shield style={{ width:40, height:40, color:'#cbd5e1', margin:'0 auto 12px' }}/>
            <p style={{ fontWeight:700, color:'#475569', marginBottom:4 }}>Visualização disponível para todos</p>
            <p style={{ fontSize:14, color:'#94a3b8' }}>O botão de geração é exclusivo do administrador.</p>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================
// TELA: TURMAS
// ============================================================
function TurmasScreen({ userEmail }) {
  const [activeTab, setActiveTab]       = useState('lancamento');
  const [selectedInstrutor, setSelectedInstrutor] = useState('');
  const [selectedCidade, setSelectedCidade]       = useState('');
  const [formData, setFormData]         = useState({ nome:'', email:'', dn:'', cpf:'', telefone:'', tipo:'Soldado', cidade:'' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg]       = useState(null);

  const alunosFiltrados = MOCK_ALUNOS.filter(() => true); // Placeholder: futuramente filtrar por instrutor/cidade

  const handleForm = field => e => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleLancar = async () => {
    if (!formData.nome || !formData.cidade) {
      setSubmitMsg({ type:'error', text:'Preencha pelo menos o Nome e a Cidade do aluno.' });
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitMsg({ type:'success', text:`Aluno "${formData.nome}" lançado com sucesso na cidade ${formData.cidade}!` });
    setFormData({ nome:'', email:'', dn:'', cpf:'', telefone:'', tipo:'Soldado', cidade:'' });
    setIsSubmitting(false);
  };

  const fieldStyle = { width:'100%', padding:'12px 16px', borderRadius:10, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#1e293b', fontSize:14, outline:'none', fontFamily:'Inter, sans-serif' };
  const labelStyle = { fontSize:12, fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:6, display:'block' };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 screen-light">
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:8 }}>
            <div style={{ background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', padding:12, borderRadius:14, boxShadow:'0 4px 16px rgba(139,92,246,0.3)' }}>
              <Users style={{ width:24, height:24, color:'white' }}/>
            </div>
            <div>
              <h2 style={{ fontSize:'1.875rem', fontWeight:800, color:'#0f172a', lineHeight:1.2 }}>Turmas</h2>
              <p style={{ color:'#64748b', fontSize:14, marginTop:2 }}>Lançamento de alunos e visualização por instrutor</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:28, background:'#f1f5f9', padding:6, borderRadius:14, width:'fit-content' }}>
          <button className={`tab-btn ${activeTab==='lancamento'?'active':''}`} onClick={() => setActiveTab('lancamento')}>
            <Plus style={{ width:14, height:14, display:'inline', marginRight:6 }}/>Lançamento
          </button>
          <button className={`tab-btn ${activeTab==='turmas'?'active':''}`} onClick={() => setActiveTab('turmas')}>
            <Eye style={{ width:14, height:14, display:'inline', marginRight:6 }}/>Ver Turmas
          </button>
        </div>

        {/* TAB: Lançamento */}
        {activeTab === 'lancamento' && (
          <div style={{ background:'white', borderRadius:24, border:'1px solid #e2e8f0', padding:32, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:'#1e293b', marginBottom:24 }}>Novo Aluno</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
              <div>
                <label style={labelStyle}>Nome Completo *</label>
                <input type="text" value={formData.nome} onChange={handleForm('nome')} placeholder="Nome do aluno" style={fieldStyle}/>
              </div>
              <div>
                <label style={labelStyle}>E-mail</label>
                <input type="email" value={formData.email} onChange={handleForm('email')} placeholder="email@exemplo.com" style={fieldStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Data de Nascimento</label>
                <input type="date" value={formData.dn} onChange={handleForm('dn')} style={fieldStyle}/>
              </div>
              <div>
                <label style={labelStyle}>CPF</label>
                <input type="text" value={formData.cpf} onChange={handleForm('cpf')} placeholder="000.000.000-00" style={fieldStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Telefone</label>
                <input type="tel" value={formData.telefone} onChange={handleForm('telefone')} placeholder="(61) 9 9999-9999" style={fieldStyle}/>
              </div>
              <div>
                <label style={labelStyle}>Situação</label>
                <select value={formData.tipo} onChange={handleForm('tipo')} style={{ ...fieldStyle, cursor:'pointer' }}>
                  <option value="Soldado">Soldado</option>
                  <option value="Cidadão">Cidadão</option>
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={labelStyle}>Cidade * (determina qual planilha será lançada)</label>
                <select value={formData.cidade} onChange={handleForm('cidade')} style={{ ...fieldStyle, cursor:'pointer' }}>
                  <option value="">Selecione a cidade...</option>
                  {MOCK_CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {submitMsg && (
              <div style={{ marginTop:20, padding:'14px 20px', borderRadius:12, display:'flex', alignItems:'center', gap:12, background: submitMsg.type==='success'?'#f0fdf4':'#fef2f2', border: `1px solid ${submitMsg.type==='success'?'#bbf7d0':'#fecaca'}`, color: submitMsg.type==='success'?'#15803d':'#991b1b' }}>
                {submitMsg.type==='success' ? <CheckCircle2 style={{ width:20, height:20 }}/> : <AlertCircle style={{ width:20, height:20 }}/>}
                <span style={{ fontWeight:600 }}>{submitMsg.text}</span>
              </div>
            )}

            <button onClick={handleLancar} disabled={isSubmitting}
              style={{ marginTop:24, display:'flex', alignItems:'center', gap:8, background: isSubmitting?'#e2e8f0':'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: isSubmitting?'#94a3b8':'white', padding:'12px 32px', borderRadius:12, fontWeight:700, border:'none', cursor: isSubmitting?'not-allowed':'pointer', fontSize:15, boxShadow: isSubmitting?'none':'0 4px 20px rgba(139,92,246,0.3)' }}>
              {isSubmitting ? <><Loader2 style={{ width:18,height:18,animation:'spin 1s linear infinite' }}/> Lançando...</> : <><Plus style={{ width:18,height:18 }}/> Lançar Aluno</>}
            </button>
          </div>
        )}

        {/* TAB: Ver Turmas */}
        {activeTab === 'turmas' && (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {/* Seletores */}
            <div style={{ background:'white', borderRadius:20, border:'1px solid #e2e8f0', padding:24, boxShadow:'0 1px 4px rgba(0,0,0,0.05)', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
              <div>
                <label style={labelStyle}>Instrutor</label>
                <select value={selectedInstrutor} onChange={e => setSelectedInstrutor(e.target.value)} style={{ ...fieldStyle, cursor:'pointer' }}>
                  <option value="">Todos os instrutores</option>
                  {MOCK_INSTRUTORES.map(i => <option key={i.nome} value={i.nome}>{i.nome}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Cidade</label>
                <select value={selectedCidade} onChange={e => setSelectedCidade(e.target.value)} style={{ ...fieldStyle, cursor:'pointer' }}>
                  <option value="">Todas as cidades</option>
                  {MOCK_CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Tabela de alunos */}
            <div style={{ background:'white', borderRadius:20, border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ padding:'16px 24px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <h3 style={{ fontWeight:700, color:'#1e293b', fontSize:15 }}>Alunos Cadastrados</h3>
                <span style={{ fontSize:12, background:'#f1f5f9', padding:'4px 12px', borderRadius:20, color:'#64748b', fontWeight:600 }}>{alunosFiltrados.length} alunos</span>
              </div>
              {/* Header */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 80px', gap:0, padding:'10px 24px', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:0.8 }}>
                <span>Nome</span><span>E-mail</span><span>CPF</span><span>DN</span><span>Telefone</span><span>Tipo</span>
              </div>
              {alunosFiltrados.map((aluno, idx) => (
                <div key={aluno.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 80px', gap:0, padding:'14px 24px', borderBottom: idx < alunosFiltrados.length-1 ? '1px solid #f1f5f9' : 'none', fontSize:13, alignItems:'center', transition:'background 0.15s', cursor:'default' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#e9d5ff,#ddd6fe)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#7c3aed', flexShrink:0 }}>{aluno.nome[0]}</div>
                    <div>
                      <p style={{ fontWeight:600, color:'#1e293b' }}>{aluno.nome}</p>
                      <p style={{ fontSize:11, color:'#94a3b8', marginTop:1 }}>{aluno.turno}</p>
                    </div>
                  </div>
                  <span style={{ color:'#64748b' }}>{aluno.email}</span>
                  <span style={{ color:'#64748b', fontFamily:'monospace', fontSize:12 }}>{aluno.cpf}</span>
                  <span style={{ color:'#64748b' }}>{aluno.dn}</span>
                  <span style={{ color:'#64748b' }}>{aluno.tel}</span>
                  <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background: aluno.tipo==='Soldado'?'#eff6ff':'#f5f3ff', color: aluno.tipo==='Soldado'?'#1d4ed8':'#6d28d9' }}>{aluno.tipo}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================
// TELA: RELATÓRIOS E FALTAS — CYBERPUNK DASHBOARD + CHATBOT
// ============================================================
function RelatoriosScreen() {
  const [chatMessages, setChatMessages] = useState([
    { role:'ai', text:'Olá! Sou a IA do BRASIL.IA. Diga-me o nome da sua turma e cidade e mostrarei o relatório de faltas completo, ou peça um insight sobre qualquer dado do dashboard.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState('');
  const [progressLoaded, setProgressLoaded] = useState(false);
  const chatEndRef = useRef(null);
  const cardsRef   = useRef(null);

  const totalAlunos    = MOCK_ALUNOS.length;
  const totalFaltas    = MOCK_ALUNOS.reduce((a, b) => a + b.faltas, 0);
  const totalPresencas = MOCK_ALUNOS.reduce((a, b) => a + (b.totalAulas - b.faltas), 0);
  const mediaAssid     = Math.round(MOCK_ALUNOS.reduce((a, b) => a + getAssiduidade(b), 0) / totalAlunos);
  const emRisco        = MOCK_ALUNOS.filter(a => getAssiduidade(a) < 75).length;

  const donutData = [
    { name: 'Manhã',   value: MOCK_ALUNOS.filter(a => a.turno === 'Manhã').length,  color:'#8b5cf6' },
    { name: 'Tarde',   value: MOCK_ALUNOS.filter(a => a.turno === 'Tarde').length,   color:'#22d3ee' },
  ];

  // GSAP: cards stagger on mount
  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll('.metric-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    );
    // Progress bars
    setTimeout(() => setProgressLoaded(true), 600);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [chatMessages]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role:'user', text: userMsg }]);
    setIsChatLoading(true);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    const context = `
      Dados disponíveis no dashboard de faltas:
      - Total de alunos: ${totalAlunos}
      - Média de assiduidade: ${mediaAssid}%
      - Alunos em risco (< 75%): ${emRisco}
      - Total de faltas: ${totalFaltas}
      - Total de presenças: ${totalPresencas}
      - Alunos: ${JSON.stringify(MOCK_ALUNOS.map(a => ({ nome: a.nome, turno: a.turno, faltas: a.faltas, assiduidade: getAssiduidade(a) })))}
    `;

    const systemMsg = `Você é a IA do sistema BRASIL.IA. O usuário faz perguntas e você responde (formato de chat). Responda em português brasileiro, de forma clara e direta. IMPORTANTE: NÃO use formatação markdown como asteriscos (*) para negrito ou listas. Use texto puro, parágrafos limpos e hífens (-) para criar listas. Forneça insights acionáveis. Contexto:\n${context}`;

    try {
      const res = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemMsg },
            ...chatMessages.filter(m => m.role !== 'ai' || chatMessages.indexOf(m) === 0).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
            { role: 'user', content: userMsg }
          ],
          temperature: 0.4
        })
      });
      const aiText = res.choices?.[0]?.message?.content || 'Não foi possível obter uma resposta. Tente novamente.';
      setChatMessages(prev => [...prev, { role:'ai', text: aiText }]);
    } catch {
      setChatMessages(prev => [...prev, { role:'ai', text:'Erro ao conectar com a IA. Verifique a chave de API.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getProgressClass = (pct) => pct >= 80 ? 'progress-ok' : pct >= 60 ? 'progress-warn' : 'progress-alert';
  const getBadgeClass    = (pct) => pct >= 80 ? 'badge-ok' : pct >= 60 ? 'badge-warn' : 'badge-risk';

  const heatColor = (v) => {
    if (v === 0) return 'rgba(139,92,246,0.08)';
    if (v <= 2)  return 'rgba(139,92,246,0.3)';
    if (v <= 5)  return 'rgba(139,92,246,0.55)';
    if (v <= 8)  return 'rgba(234,179,8,0.6)';
    return 'rgba(239,68,68,0.65)';
  };

  return (
    <main className="flex-1 overflow-y-auto cyber-grid-bg" style={{ background:'#07060f' }}>
      <div style={{ padding:'28px 24px 80px', maxWidth:1280, margin:'0 auto' }}>

        {/* ─── PAGE HEADER ─── */}
        <div style={{ marginBottom:32, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'1.75rem', fontWeight:700, background:'linear-gradient(135deg, #c4b5fd 0%, #ffffff 60%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Relatórios de Faltas
            </h2>
            <p style={{ color:'rgba(148,163,184,0.7)', marginTop:4, fontSize:14 }}>Dashboard de assiduidade em tempo real • Maio 2026</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <select value={selectedTurma} onChange={e => setSelectedTurma(e.target.value)}
              className="cyber-select" style={{ padding:'8px 16px', fontSize:13 }}>
              <option value="">Todas as turmas</option>
              {MOCK_TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button style={{ padding:'8px 14px', borderRadius:10, border:'1px solid rgba(139,92,246,0.3)', background:'rgba(139,92,246,0.1)', color:'#a78bfa', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600 }}>
              <RefreshCw style={{ width:14, height:14 }}/>Atualizar
            </button>
          </div>
        </div>

        {/* ─── METRIC CARDS ─── */}
        <div ref={cardsRef} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:28 }}>
          {[
            { label:'Total de Alunos', value: totalAlunos, icon: Users, color:'#a78bfa', sub:'ativos no período' },
            { label:'Méd. Assiduidade', value: `${mediaAssid}%`, icon: Activity, color:'#34d399', sub:'da turma geral' },
            { label:'Alunos em Risco', value: emRisco, icon: AlertTriangle, color:'#f87171', sub:'abaixo de 75%' },
            { label:'Total de Presenças', value: totalPresencas, icon: CheckCircle2, color:'#60a5fa', sub:'registradas' },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="metric-card" style={{ opacity:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                <p style={{ fontSize:12, fontWeight:600, color:'rgba(148,163,184,0.7)', textTransform:'uppercase', letterSpacing:1 }}>{label}</p>
                <div style={{ background:`${color}20`, padding:8, borderRadius:10 }}>
                  <Icon style={{ width:18, height:18, color }}/>
                </div>
              </div>
              <p className="metric-value" style={{ marginBottom:8 }}>{value}</p>
              <p style={{ fontSize:12, color:'rgba(148,163,184,0.5)' }}>{sub}</p>
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, borderRadius:'0 0 16px 16px', background:`linear-gradient(90deg, ${color}00, ${color}60, ${color}00)` }}/>
            </div>
          ))}
        </div>

        {/* ─── MAIN GRID: TABLE + CHARTS ─── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20, marginBottom:28 }}>

          {/* Student Table */}
          <div className="cyber-card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:600, color:'#e2e8f0', fontSize:15 }}>Lista de Alunos</h3>
              <span style={{ fontSize:11, padding:'4px 12px', borderRadius:20, background:'rgba(139,92,246,0.15)', color:'#a78bfa', fontWeight:600, border:'1px solid rgba(139,92,246,0.25)' }}>{MOCK_ALUNOS.length} alunos</span>
            </div>
            {/* Table header */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 60px 140px 60px', gap:12, padding:'10px 24px', background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(139,92,246,0.08)', fontSize:11, fontWeight:700, color:'rgba(148,163,184,0.5)', textTransform:'uppercase', letterSpacing:0.8 }}>
              <span>Aluno</span><span>Turno</span><span>Assiduidade</span><span>Faltas</span>
            </div>
            {MOCK_ALUNOS.map((aluno, idx) => {
              const assid = getAssiduidade(aluno);
              return (
                <div key={aluno.id} style={{ display:'grid', gridTemplateColumns:'1fr 60px 140px 60px', gap:12, padding:'14px 24px', borderBottom: idx < MOCK_ALUNOS.length-1 ? '1px solid rgba(139,92,246,0.06)' : 'none', alignItems:'center', transition:'all 0.2s', cursor:'default' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(139,92,246,0.07)'; e.currentTarget.style.borderRadius='8px'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(124,58,237,0.2))', border:'1px solid rgba(139,92,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#c4b5fd', flexShrink:0 }}>
                      {aluno.nome[0]}
                    </div>
                    <p style={{ fontWeight:600, color:'#e2e8f0', fontSize:14 }}>{aluno.nome}</p>
                  </div>
                  <span style={{ fontSize:12, color:'rgba(148,163,184,0.6)', textAlign:'center' }}>{aluno.turno}</span>
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:11, color:'rgba(148,163,184,0.5)' }}>{assid}%</span>
                      <span className={getBadgeClass(assid)} style={{ fontSize:10, padding:'1px 8px', borderRadius:20, fontWeight:700 }}>
                        {assid >= 80 ? 'OK' : assid >= 60 ? 'ATENÇÃO' : 'RISCO'}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className={`progress-fill ${getProgressClass(assid)}`} style={{ width: progressLoaded ? `${assid}%` : '0%' }}/>
                    </div>
                  </div>
                  <span style={{ textAlign:'center', fontFamily:'Space Grotesk, sans-serif', fontSize:18, fontWeight:700, color: assid < 75 ? '#f87171' : '#c4b5fd' }}>{aluno.faltas}</span>
                </div>
              );
            })}
          </div>

          {/* Right column: Donut + Heatmap */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Donut Chart */}
            <div className="cyber-card" style={{ padding:24 }}>
              <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:600, color:'#e2e8f0', fontSize:14, marginBottom:20 }}>Presenças por Turno</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" animationBegin={400} animationDuration={1200}>
                    {donutData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent"/>)}
                  </Pie>
                  <ReTooltip contentStyle={{ background:'#1a1030', border:'1px solid rgba(139,92,246,0.3)', borderRadius:10, color:'#e2e8f0', fontSize:13 }}/>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', justifyContent:'center', gap:20 }}>
                {donutData.map(d => (
                  <div key={d.name} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(148,163,184,0.7)' }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:d.color }}/>
                    <span>{d.name}: <strong style={{ color:'#e2e8f0' }}>{d.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Heatmap */}
            <div className="cyber-card" style={{ padding:24, flex:1 }}>
              <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:600, color:'#e2e8f0', fontSize:14, marginBottom:16 }}>Mapa de Calor — Faltas</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
                {HEATMAP_DATA.map(({ data, faltas }) => (
                  <div key={data} className="heat-cell" title={`${data}: ${faltas} faltas`}
                    style={{ aspectRatio:'1', background: heatColor(faltas), borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'rgba(255,255,255,0.6)', fontWeight:600, cursor:'pointer' }}>
                    {faltas > 0 ? faltas : ''}
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:6, fontSize:10, color:'rgba(148,163,184,0.5)' }}>
                <div style={{ width:10, height:10, borderRadius:2, background:'rgba(139,92,246,0.08)' }}/>
                <span style={{ marginRight:8 }}>0</span>
                <div style={{ width:10, height:10, borderRadius:2, background:'rgba(139,92,246,0.55)' }}/>
                <span style={{ marginRight:8 }}>1-5</span>
                <div style={{ width:10, height:10, borderRadius:2, background:'rgba(234,179,8,0.6)' }}/>
                <span style={{ marginRight:8 }}>6-8</span>
                <div style={{ width:10, height:10, borderRadius:2, background:'rgba(239,68,68,0.65)' }}/>
                <span>9+</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CHART & CHATBOT MERGED ─── */}
        <div className="cyber-card" style={{ padding:0, overflow:'hidden', marginBottom:28, display:'flex', flexDirection:'column' }}>
          
          {/* Chart Section */}
          <div style={{ padding:'24px 24px 16px', borderBottom:'1px solid rgba(139,92,246,0.15)' }}>
            <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:600, color:'#e2e8f0', fontSize:15, marginBottom:20 }}>Frequência Mensal — Maio 2026</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={HEATMAP_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="data" tick={{ fill:'rgba(148,163,184,0.5)', fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'rgba(148,163,184,0.5)', fontSize:11 }} axisLine={false} tickLine={false}/>
                <ReTooltip contentStyle={{ background:'#1a1030', border:'1px solid rgba(139,92,246,0.3)', borderRadius:10, color:'#e2e8f0', fontSize:13 }}/>
                <Line type="monotone" dataKey="presencas" name="Presenças" stroke="#34d399" strokeWidth={3} dot={{ r: 3, fill: '#34d399', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="faltas" name="Faltas" stroke="#f87171" strokeWidth={3} dot={{ r: 3, fill: '#f87171', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chatbot Section */}
          <div>
            <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(139,92,246,0.15)', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ background:'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(124,58,237,0.1))', border:'1px solid rgba(139,92,246,0.3)', padding:8, borderRadius:10 }}>
              <Brain style={{ width:18, height:18, color:'#a78bfa' }}/>
            </div>
            <div>
              <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:600, color:'#e2e8f0', fontSize:15 }}>IA de Insights</h3>
              <p style={{ fontSize:11, color:'rgba(148,163,184,0.5)', marginTop:1 }}>Peça um insight sobre qualquer dado — informe a turma e cidade ou faça uma pergunta</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ height:280, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{ display:'flex', flexDirection: msg.role==='user' ? 'row-reverse' : 'row', alignItems:'flex-start', gap:10 }}>
                {msg.role === 'ai' && (
                  <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(124,58,237,0.2))', border:'1px solid rgba(139,92,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Bot style={{ width:14, height:14, color:'#a78bfa' }}/>
                  </div>
                )}
                <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                  <p style={{ fontSize:14, color:'#e2e8f0', lineHeight:1.6, margin:0 }}>{msg.text}</p>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(124,58,237,0.2))', border:'1px solid rgba(139,92,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Bot style={{ width:14, height:14, color:'#a78bfa' }}/>
                </div>
                <div className="chat-bubble-ai" style={{ display:'flex', gap:4, alignItems:'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#8b5cf6', animation:`blink 1.2s ${i*0.2}s ease-in-out infinite` }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:'16px 24px', borderTop:'1px solid rgba(139,92,246,0.12)', display:'flex', gap:12, alignItems:'center' }}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && handleChatSend()}
              placeholder="Ex: Quais alunos estão em risco na turma de Informática Básica em Planaltina?"
              className="cyber-input"
              style={{ flex:1, padding:'12px 18px', fontSize:14 }}
              disabled={isChatLoading}
            />
            <button onClick={handleChatSend} disabled={!chatInput.trim() || isChatLoading}
              className="btn-cyber" style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:6, fontSize:14, whiteSpace:'nowrap' }}>
              {isChatLoading ? <Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }}/> : <Send style={{ width:16, height:16 }}/>}
              {!isChatLoading && 'Enviar'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// APP PRINCIPAL — BRASIL.IA
// ============================================================
export default function App() {
  const [activeScreen, setActiveScreen] = useState('relatorios');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef    = useRef(null);
  const contentRef    = useRef(null);

  const userEmail = ADMIN_EMAIL;
  const isAdmin   = userEmail === ADMIN_EMAIL;

  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    // GSAP: sidebar entrance
    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current,
        { x: -320, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
    }
    // GSAP: content entrance
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.15 }
      );
    }
  }, []);

  const handleScreenChange = (id) => {
    if (!contentRef.current || id === activeScreen) return;
    gsap.to(contentRef.current, {
      opacity: 0, y: 16, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setActiveScreen(id);
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
        );
      }
    });
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const navItems = [
    { id: 'diario',    label: 'Prompt de Diário',       icon: MessageSquare,  group:'Ferramentas' },
    { id: 'relatorios',label: 'Relatórios e Faltas',    icon: LayoutDashboard, group:'Ferramentas' },
    { id: 'turmas',    label: 'Turmas',                  icon: Users,           group:'Ferramentas' },
    { id: 'gerar',     label: 'Gerar Novos Relatórios', icon: FileSpreadsheet, group:'Admin' },
  ];

  const screenTitles = {
    diario:    'Lançamento de Diário',
    relatorios:'Relatórios e Faltas',
    turmas:    'Turmas',
    gerar:     'Gerar Novos Relatórios',
  };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#07060f' }}>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div style={{ display:'none' }} className="md-hidden"
          onClick={() => setIsSidebarOpen(false)}
          id="mobile-overlay"/>
      )}

      {/* ── SIDEBAR ── */}
      <aside
        ref={sidebarRef}
        className="sidebar-cyber"
        style={{
          width: isSidebarOpen ? 280 : 0,
          minWidth: isSidebarOpen ? 280 : 0,
          overflow: 'hidden',
          height:'100%',
          display:'flex', flexDirection:'column',
          transition: 'width 0.3s ease, min-width 0.3s ease',
          position: 'relative',
          zIndex: 50,
        }}>
        <div style={{ width:280, display:'flex', flexDirection:'column', height:'100%' }}>

          {/* Logo */}
          <div style={{ height:68, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', borderBottom:'1px solid rgba(139,92,246,0.15)', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <BrasilIARobot size={38}/>
              <div style={{ lineHeight:1.1 }}>
                <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:18, color:'#e2e8f0', letterSpacing:'-0.3px' }}>BRASIL</span>
                <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:18, background:'linear-gradient(135deg,#c4b5fd,#8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>.IA</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex:1, padding:'20px 12px', overflowY:'auto' }}>
            {['Ferramentas', 'Admin'].map(group => {
              const items = navItems.filter(n => n.group === group);
              if (group === 'Admin' && !isAdmin) return null;
              return (
                <div key={group} style={{ marginBottom:24 }}>
                  <p style={{ fontSize:10, fontWeight:700, color:'rgba(148,163,184,0.4)', textTransform:'uppercase', letterSpacing:1.5, padding:'0 8px', marginBottom:8 }}>{group}</p>
                  {items.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => handleScreenChange(id)}
                      className={`nav-item ${activeScreen === id ? 'active' : ''}`}>
                      <Icon style={{ width:18, height:18, flexShrink:0 }}/>
                      <span style={{ flex:1, textAlign:'left' }}>{label}</span>
                      {activeScreen === id && <ChevronRight style={{ width:14, height:14, opacity:0.5 }}/>}
                    </button>
                  ))}
                </div>
              );
            })}
          </nav>

          {/* User info */}
          <div style={{ padding:'12px 12px 20px', borderTop:'1px solid rgba(139,92,246,0.12)', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(139,92,246,0.1)' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {isAdmin ? <Shield style={{ width:16, height:16, color:'white' }}/> : <span style={{ color:'white', fontWeight:700, fontSize:13 }}>{userEmail[0].toUpperCase()}</span>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:11, color:'rgba(148,163,184,0.6)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userEmail}</p>
                {isAdmin && <p style={{ fontSize:10, fontWeight:700, color:'#a78bfa', marginTop:2 }}>Administrador</p>}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, height:'100%', overflow:'hidden' }}>

        {/* Header */}
        <header style={{ height:60, background:'rgba(13,11,30,0.8)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(139,92,246,0.12)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', flexShrink:0, zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ padding:8, borderRadius:8, border:'none', background:'rgba(255,255,255,0.05)', cursor:'pointer', color:'rgba(148,163,184,0.7)', display:'flex', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(139,92,246,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
              <Menu style={{ width:20, height:20 }}/>
            </button>
            <h1 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:600, fontSize:16, color:'#e2e8f0' }}>{screenTitles[activeScreen]}</h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(148,163,184,0.6)' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 6px rgba(74,222,128,0.6)' }}/>
              Online
            </div>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {isAdmin ? <Shield style={{ width:14, height:14, color:'white' }}/> : <span style={{ color:'white', fontWeight:700, fontSize:12 }}>{userEmail[0].toUpperCase()}</span>}
            </div>
          </div>
        </header>

        {/* Content */}
        <div ref={contentRef} style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
          {activeScreen === 'diario'     && <DiarioScreen userEmail={userEmail}/>}
          {activeScreen === 'gerar'      && <GerarRelatoriosScreen userEmail={userEmail}/>}
          {activeScreen === 'turmas'     && <TurmasScreen userEmail={userEmail}/>}
          {activeScreen === 'relatorios' && <RelatoriosScreen/>}
        </div>
      </div>

      {/* Badge BY ALAN */}
      <div style={{ position:'fixed', bottom:20, right:20, zIndex:100, display:'flex', flexDirection:'column', alignItems:'center', gap:6, pointerEvents:'none' }}>
        <div style={{ background:'rgba(13,11,30,0.9)', padding:6, borderRadius:14, border:'1px solid rgba(139,92,246,0.3)', boxShadow:'0 0 20px rgba(139,92,246,0.2)' }}>
          <BrasilIARobot size={32}/>
        </div>
        <div style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(10px)', padding:'4px 12px', borderRadius:20, border:'1px solid rgba(139,92,246,0.2)' }}>
          <span style={{ fontSize:9, fontWeight:800, color:'rgba(196,181,253,0.8)', letterSpacing:2, textTransform:'uppercase' }}>BY ALAN</span>
        </div>
      </div>
    </div>
  );
}
