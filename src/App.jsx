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
  RefreshCw, Brain, Eye, AlertTriangle, Share2, GraduationCap, MoreVertical,
  Bell, Settings, Download, UserPlus
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
// DATA FETCHING & ANIMATION
// ============================================================
export const useLegoAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.lego-piece').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

export const GlobalChatbot = ({ isOpen, onClose, isMobile }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([{ role: 'ai', text: 'Olá! Sou a IA do BRASIL.IA. Posso extrair dados, cadastrar alunos ou analisar as planilhas. Como posso ajudar?' }]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading, isOpen]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsChatLoading(true);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    try {
      const data = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Você é um assistente da base Brasil IA. Responda de forma direta.' },
            { role: 'user', content: userText }
          ],
          temperature: 0.7
        })
      });
      const aiResponse = data.choices?.[0]?.message?.content || 'Desculpe, não consegui analisar agora.';
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Erro de conexão com o cérebro da IA.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      {isOpen && isMobile && <div className="sidebar-overlay" style={{ zIndex:99 }} onClick={onClose} />}
      <div className={`chatbot-sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(139,92,246,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background:'rgba(139,92,246,0.04)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', padding:10, borderRadius:12, boxShadow:'0 0 12px rgba(139,92,246,0.4)' }}>
              <Brain style={{ width:18, height:18, color:'white' }}  className="robot-pulse"/>
            </div>
            <div>
              <h3 style={{ fontWeight: '700', color: '#e2e8f0', fontSize:15, margin:0 }}>IA Global</h3>
              <p style={{ fontSize:11, color:'rgba(139,92,246,0.6)', margin:'2px 0 0 0' }}>Assistente Brasil.IA</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'rgba(139,92,246,0.6)', cursor:'pointer', padding:4, display:'flex' }}><X size={20}/></button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {chatMessages.map((msg, idx) => (
            <div key={idx} style={{ display:'flex', flexDirection: msg.role==='user' ? 'row-reverse' : 'row', alignItems:'flex-end', gap:8 }}>
              {msg.role === 'ai' && (
                <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', border:'2px solid rgba(139,92,246,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 0 8px rgba(139,92,246,0.3)' }}>
                  <Bot style={{ width:14, height:14, color:'white' }}/>
                </div>
              )}
              <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'} style={{ whiteSpace:'pre-wrap', maxWidth:'280px' }}>
                <p style={{ fontSize:13, color:'#e2e8f0', lineHeight:1.5, margin:0 }}>{msg.text}</p>
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', border:'2px solid rgba(139,92,246,0.4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 8px rgba(139,92,246,0.3)' }}>
                <Bot style={{ width:14, height:14, color:'white' }}/>
              </div>
              <div className="chat-bubble-ai" style={{ display:'flex', gap:3, alignItems:'center', padding:'8px 12px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#c4b5fd', animation:`blink 1.2s ${i*0.2}s ease-in-out infinite` }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div style={{ padding: '16px', borderTop: '1px solid rgba(139,92,246,0.2)', background:'rgba(139,92,246,0.03)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleChatSend()}
              placeholder="Digite sua dúvida..." 
              style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.25)', background: '#0f0a1c', color: '#e2e8f0', outline:'none', fontSize:13, fontWeight:500 }}
              className="cyber-input"
            />
            <button onClick={handleChatSend} style={{ padding:'12px 14px', borderRadius:'10px', background:'linear-gradient(135deg, #8b5cf6, #7c3aed)', border:'none', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(139,92,246,0.3)' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

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

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.animate-assemble');
    gsap.fromTo(elements,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, []);

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
    <main ref={containerRef} className="flex-1 p-6 md:p-10 pb-32 cyber-grid-bg" style={{ background:'#07060f', minHeight:0, overflowY:'auto' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }} className="space-y-6">
        <div className="animate-assemble">
          <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize: '1.875rem', fontWeight: 800, background: 'linear-gradient(135deg, #c4b5fd 0%, #ffffff 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>Lançamento Inteligente</h2>
          <p style={{ color: 'rgba(148,163,184,0.7)', marginTop: 6 }}>Lançamento de faltas e conteúdo em linguagem natural.</p>
        </div>

        {/* Planilha ID */}
        <div className="cyber-card animate-assemble" style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
          <Database style={{ width:16, height:16, color:'#a78bfa', flexShrink:0 }} />
          <input type="text" value={planilhaId} onChange={e => setPlanilhaId(e.target.value)}
            placeholder="ID da Planilha Google Sheets..."
            style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(139,92,246,0.25)', borderRadius:8, padding:'6px 12px', color:'#e2e8f0', fontFamily:'monospace', fontSize:12, outline:'none' }}
            className="cyber-input" />
        </div>

        {/* Textarea */}
        <div className="cyber-card animate-assemble" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ background:'rgba(255,255,255,0.02)', padding:'12px 20px', borderBottom:'1px solid rgba(139,92,246,0.15)', fontSize:11, fontWeight:700, color:'rgba(148,163,184,0.5)', letterSpacing:0.8 }}>
            DESCREVA O OCORRIDO (CONTEÚDO E FALTAS)
          </div>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleProcessPrompt(); }}
            placeholder="Ex: Na turma [Turma] no dia [DD/MM/AAAA], os alunos [X, Y, Z] faltaram e o conteúdo do dia foi [Assunto]..."
            style={{ width:'100%', minHeight:160, padding:24, fontSize:15, resize:'vertical', background:'transparent', border:'none', outline:'none', color:'#e2e8f0', fontWeight:500, fontFamily:'Inter, sans-serif' }}
            disabled={isLoading} />
          <div style={{ background:'rgba(255,255,255,0.02)', padding:'12px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(139,92,246,0.15)', flexWrap:'wrap', gap:12 }}>
            <span style={{ fontSize:13, color:'rgba(148,163,184,0.5)' }}>
              {prompt.trim().length} CARACTERES
            </span>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:12, color:'rgba(148,163,184,0.5)', marginRight:12 }}>Atalho: <kbd style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(139,92,246,0.25)', padding:'2px 8px', borderRadius:6, fontFamily:'sans-serif', fontWeight:600, color:'#c4b5fd' }}>Ctrl</kbd> + <kbd style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(139,92,246,0.25)', padding:'2px 8px', borderRadius:6, fontFamily:'sans-serif', fontWeight:600, color:'#c4b5fd' }}>Enter</kbd></span>
              <button onClick={handleProcessPrompt} disabled={isLoading || !prompt.trim()} className="btn-cyber"
                style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 28px', borderRadius:12, fontSize:15 }}>
                {isLoading ? <><Loader2 style={{ width:18, height:18, animation:'spin 1s linear infinite' }} /> Processando...</> : <><Sparkles style={{ width:18, height:18 }} /> Lançar com IA</>}
              </button>
            </div>
          </div>
        </div>

        {/* Status block (Pulsing / Processing) */}
        <div className="animate-assemble" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'rgba(148,163,184,0.6)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#a78bfa', boxShadow:'0 0 6px rgba(167,139,250,0.6)' }} className="robot-pulse"/>
            Processamento de IA Ativo
          </div>
          <button onClick={() => setPrompt('')} style={{ background:'transparent', border:'none', color:'rgba(148,163,184,0.6)', cursor:'pointer', fontSize:13, fontWeight:600 }}>Cancelar</button>
        </div>

        {/* Error */}
        {error && (
          <div className="cyber-card animate-assemble" style={{ background:'rgba(239,68,68,0.1)', color:'#f87171', padding:'16px 20px', borderRadius:14, display:'flex', alignItems:'center', gap:12, border:'1px solid rgba(239,68,68,0.3)' }}>
            <AlertCircle style={{ width:22, height:22, color:'#f87171', flexShrink:0 }} />
            <p style={{ fontWeight:600 }}>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="animate-assemble" style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {syncStatus.status !== 'idle' && (
              <div style={{ padding:'14px 20px', borderRadius:14, display:'flex', alignItems:'center', gap:12, border:'1px solid', background: syncStatus.status==='syncing'?'rgba(59,130,246,0.1)':syncStatus.status==='success'?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', borderColor: syncStatus.status==='syncing'?'rgba(59,130,246,0.3)':syncStatus.status==='success'?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)', color: syncStatus.status==='syncing'?'#60a5fa':syncStatus.status==='success'?'#4ade80':'#f87171' }}>
                {syncStatus.status==='syncing' ? <Loader2 style={{ width:22,height:22,animation:'spin 1s linear infinite',flexShrink:0 }}/> : syncStatus.status==='success' ? <CheckCircle2 style={{ width:22,height:22,flexShrink:0,color:'#4ade80' }}/> : <AlertCircle style={{ width:22,height:22,flexShrink:0,color:'#f87171' }}/>}
                <p style={{ fontWeight:700 }}>{syncStatus.message}</p>
              </div>
            )}
            <div className="cyber-card" style={{ padding:32 }}>
            <div className="grid-responsive" style={{ marginBottom:24 }}>
              {[
                { icon: BookOpen, bg:'rgba(139,92,246,0.15)', ic:'#c4b5fd', label:'Curso', val: result.curso },
                { icon: Calendar, bg:'rgba(234,179,8,0.15)', ic:'#fbbf24', label:'Data e Turno', val: `${result.data_aula} (${result.turno})` },
                { icon: UserMinus, bg:'rgba(239,68,68,0.15)', ic:'#f87171', label:'Faltas', val: result.nomes_faltas?.length > 0 ? result.nomes_faltas.join(', ') : 'Todos Presentes' },
              ].map(({ icon: Icon, bg, ic, label, val }) => (
                <div key={label} style={{ background:'rgba(255,255,255,0.02)', padding:20, borderRadius:16, border:'1px solid rgba(139,92,246,0.15)', display:'flex', alignItems:'flex-start', gap:14 }}>
                    <div style={{ background:bg, padding:10, borderRadius:12, flexShrink:0 }}><Icon style={{ width:22, height:22, color:ic }}/></div>
                    <div><p style={{ fontSize:11, color:'rgba(148,163,184,0.5)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{label}</p><p style={{ fontSize:16, fontWeight:700, color:'#e2e8f0' }}>{val}</p></div>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(139,92,246,0.08)', padding:24, borderRadius:16, border:'1px solid rgba(139,92,246,0.25)' }}>
                <p style={{ fontSize:11, color:'#c4b5fd', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:10, display:'flex', alignItems:'center', gap:6 }}><BookOpen style={{ width:14, height:14 }}/> Conteúdo Lecionado</p>
                <p style={{ color:'#e2e8f0', fontSize:16, lineHeight:1.7, fontWeight:500 }}>{result.conteudo_lecionado}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards Section (underneath) */}
        <div className="grid-responsive animate-assemble" style={{ marginTop:24 }}>
          {[
            { icon: UserMinus, title: 'Detecção de Faltas', desc: 'A IA identifica nomes e registra ausências automaticamente no sistema.' },
            { icon: BookOpen, title: 'Resumo de Conteúdo', desc: 'Sua descrição é convertida em tópicos formais para o diário de classe.' },
            { icon: Zap, title: 'Agilidade Diária', desc: 'Economize até 70% do tempo gasto com burocracia escolar.' }
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="cyber-card" style={{ padding:24, display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={18} color="#c4b5fd" />
              </div>
              <h4 style={{ fontSize:15, fontWeight:700, color:'#e2e8f0', margin:0 }}>{title}</h4>
              <p style={{ fontSize:13, color:'rgba(148,163,184,0.6)', lineHeight:1.5, margin:0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


// ============================================================
function GerarRelatoriosScreen({ userEmail }) {
  const isAdmin = userEmail === ADMIN_EMAIL;
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.animate-assemble');
    gsap.fromTo(elements,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, []);

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
    loading: { bg:'rgba(59,130,246,0.1)', border:'rgba(59,130,246,0.3)', color:'#60a5fa' },
    success: { bg:'rgba(34,197,94,0.1)', border:'rgba(34,197,94,0.3)', color:'#4ade80' },
    warning: { bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.3)', color:'#fbbf24' },
    error:   { bg:'rgba(239,68,68,0.1)', border:'rgba(239,68,68,0.3)', color:'#f87171' },
  };

  const handleFillExample = () => {
    setPrompt(`Carreta 1 - Equipe Norte (Planaltina):
- João Silva | joao@email.com | Informática Básica
- Maria Santos | maria@email.com | Criando com a IA
- Pedro Lima | pedro@email.com | C# para Iniciantes
- Carla Dias | carla@email.com | IA e o Futuro do Trabalho
- Rafael Costa | rafael@email.com | Estética de Jogo
Período: 01/05/2026 a 31/05/2026`);
  };

  return (
    <main ref={containerRef} className="flex-1 p-6 md:p-10 pb-32 cyber-grid-bg" style={{ background:'#07060f', minHeight:0, overflowY:'auto' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }} className="space-y-6">
        
        {/* Header */}
        <div className="animate-assemble" style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', padding:12, borderRadius:14, boxShadow:'0 4px 16px rgba(139,92,246,0.3)' }}>
            <Share2 style={{ width:24, height:24, color:'white' }}/>
          </div>
          <div>
            <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'1.875rem', fontWeight:800, background: 'linear-gradient(135deg, #c4b5fd 0%, #ffffff 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight:1.2 }}>Criar Novo Relatório</h2>
            <p style={{ color:'rgba(148,163,184,0.7)', fontSize:14, marginTop:2 }}>Criação automática de relatórios mensais via IA para os instrutores e equipes.</p>
          </div>
        </div>

        {/* Como funciona */}
        <div className="cyber-card animate-assemble" style={{ padding:24, display:'flex', gap:16, background:'rgba(139,92,246,0.03)', borderColor:'rgba(139,92,246,0.2)' }}>
          <Info style={{ width:20, height:20, color:'#a78bfa', flexShrink:0, marginTop:2 }}/>
          <div style={{ fontSize:14, color:'rgba(148,163,184,0.8)', lineHeight:1.6 }}>
            <p style={{ fontWeight:700, color:'#e2e8f0', marginBottom:8, fontSize:15 }}>Como funciona:</p>
            <p style={{ marginBottom:10 }}>Descreva a matriz de instrutores com os cursos correspondentes, e-mails, turmas e cidades. A inteligência artificial irá ler e estruturar esses dados, criando as planilhas individuais na nuvem e disparando o e-mail de acesso para cada um deles.</p>
            <p style={{ fontWeight:600, color:'#c4b5fd', marginBottom:4 }}>Regras importantes:</p>
            <ul style={{ listStyleType:'none', paddingLeft:0 }}>
              <li>• Mínimo de 1 equipe e máximo de 10.</li>
              <li>• Cada equipe comporta até 5 instrutores (um para cada curso).</li>
              <li>• Os e-mails devem ser válidos para recebimento do link.</li>
              <li>• O processamento leva entre 15 a 45 segundos.</li>
            </ul>
          </div>
        </div>

        {/* Textarea Area */}
        <div className="cyber-card animate-assemble" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ background:'rgba(255,255,255,0.02)', padding:'12px 20px', borderBottom:'1px solid rgba(139,92,246,0.15)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:11, fontWeight:700, color:'rgba(148,163,184,0.5)', letterSpacing:0.8 }}>MATRIZ DE INSTRUTORES</span>
            <button onClick={handleFillExample} style={{ background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)', borderRadius:20, padding:'4px 12px', fontSize:11, fontWeight:600, color:'#c4b5fd', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(139,92,246,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(139,92,246,0.1)'}>
              Exemplo formatado
            </button>
          </div>
          
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter'&&(e.ctrlKey||e.metaKey)) handleGerar(); }}
            placeholder="Insira a descrição da matriz ou cole o texto..."
            style={{ width:'100%', minHeight:220, padding:24, fontSize:15, resize:'vertical', background:'transparent', border:'none', outline:'none', color:'#e2e8f0', fontWeight:500, fontFamily:'Inter, sans-serif' }}
            disabled={isLoading} />
            
          <div style={{ background:'rgba(255,255,255,0.02)', padding:'12px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(139,92,246,0.15)', flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <span style={{ fontSize:13, color:'rgba(148,163,184,0.5)' }}>
                {prompt.trim().length} CARACTERES
              </span>
              <span style={{ fontSize:13, color:'rgba(148,163,184,0.5)' }}>
                Atalho: <kbd style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(139,92,246,0.25)', padding:'2px 8px', borderRadius:6, fontFamily:'sans-serif', fontWeight:600, color:'#c4b5fd' }}>Ctrl</kbd> + <kbd style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(139,92,246,0.25)', padding:'2px 8px', borderRadius:6, fontFamily:'sans-serif', fontWeight:600, color:'#c4b5fd' }}>Enter</kbd>
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <button onClick={() => setPrompt('')} style={{ background:'transparent', border:'none', color:'rgba(148,163,184,0.6)', cursor:'pointer', fontSize:14, fontWeight:600, padding:'8px 16px' }}>Limpar</button>
              {isAdmin ? (
                <button onClick={handleGerar} disabled={isLoading || !prompt.trim()} className="btn-cyber"
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 28px', borderRadius:12, fontSize:15 }}>
                  {isLoading ? <><Loader2 style={{ width:18, height:18, animation:'spin 1s linear infinite' }}/> Gerando...</> : <><Sparkles style={{ width:18, height:18 }}/> Gerar Relatórios</>}
                </button>
              ) : (
                <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'rgba(148,163,184,0.5)', background:'rgba(255,255,255,0.03)', padding:'8px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)' }}>
                  <Shield style={{ width:14, height:14 }}/> Ação restrita ao administrador
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ambiente seguro footer text */}
        <p className="animate-assemble" style={{ textAlign:'center', fontSize:12, color:'rgba(148,163,184,0.4)', marginTop:12 }}>
          Planilhas criadas em ambiente seguro • Acesso gerenciado via Google Workspace
        </p>

        {status.type !== 'idle' && (
          <div className="cyber-card animate-assemble" style={{ padding:'16px 20px', borderRadius:14, display:'flex', alignItems:'center', gap:12, border:'1px solid', ...(statusColors[status.type] || {}) }}>
            {status.type === 'loading' && <Loader2 style={{ width:22, height:22, animation:'spin 1s linear infinite', flexShrink:0 }}/>}
            {status.type === 'success' && <CheckCircle2 style={{ width:22, height:22, flexShrink:0, color:'#4ade80' }}/>}
            {status.type === 'error'   && <AlertCircle  style={{ width:22, height:22, flexShrink:0, color:'#f87171' }}/>}
            {status.type === 'warning' && <AlertCircle  style={{ width:22, height:22, flexShrink:0, color:'#fbbf24' }}/>}
            <p style={{ fontWeight:600 }}>{status.message}</p>
          </div>
        )}

        {!isAdmin && (
          <div className="cyber-card animate-assemble" style={{ padding:28, textAlign:'center', background:'rgba(255,255,255,0.02)', borderColor:'rgba(255,255,255,0.08)' }}>
            <Shield style={{ width:40, height:40, color:'rgba(148,163,184,0.3)', margin:'0 auto 12px' }}/>
            <p style={{ fontWeight:700, color:'#e2e8f0', marginBottom:4 }}>Visualização disponível para todos</p>
            <p style={{ fontSize:14, color:'rgba(148,163,184,0.5)' }}>O botão de geração é exclusivo do administrador.</p>
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================
// TELA: TURMAS
// ============================================================

function TurmasScreen({ userEmail, isMobile }) {
  const [showStudents, setShowStudents] = useState(false);
  const [selectedInstrutor, setSelectedInstrutor] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    dn: '',
    cpf: '',
    telefone: '',
    tipo: 'Soldado',
    cidade: '',
    idade: '14',
    tutor: 'Responsável legal',
    dataIngressao: '',
    status: 'Ativo',
    turma: '',
    observacoes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [promptIA, setPromptIA] = useState('');
  const [isLoadingIA, setIsLoadingIA] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.animate-assemble');
    gsap.fromTo(elements,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, [showStudents]);

  const handleForm = field => e => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleLancarIA = async () => {
    setIsLoadingIA(true);
    setSubmitMsg(null);
    try {
      const apiKey = localStorage.getItem('BRASILIA_API_KEY') || '';
      const groqRes = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'Extraia os dados do aluno. Retorne um JSON com os campos EXATOS: nome, email, dn (formato YYYY-MM-DD), cpf, telefone, tipo (Soldado ou Cidadão), cidade. Se não tiver alguma informação, use "". Nomes de cidades com primeira maiúscula.' },
            { role: 'user', content: promptIA }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1
        })
      });
      const jsonText = groqRes.choices?.[0]?.message?.content;
      if (jsonText) {
        const payload = JSON.parse(jsonText);
        setFormData(prev => ({ ...prev, ...payload }));
        setPromptIA('');
        setSubmitMsg({ type:'success', text:'Formulário preenchido pela IA! Revise os dados e clique em Finalizar Matrícula.' });
      }
    } catch (err) {
      console.error(err);
      setSubmitMsg({ type:'error', text:'Erro na IA. Verifique se configurou a API Key ou preencha manualmente.' });
    } finally {
      setIsLoadingIA(false);
    }
  };

  const handleLancar = async () => {
    if (!formData.nome) {
      setSubmitMsg({ type:'error', text:'Preencha pelo menos o Nome do aluno.' });
      return;
    }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setSubmitMsg({ type:'success', text:`Matrícula do aluno "${formData.nome}" finalizada com sucesso!` });
    setFormData({ nome:'', email:'', dn:'', cpf:'', telefone:'', tipo:'Soldado', cidade:'', idade:'14', tutor:'Responsável legal', dataIngressao:'', status:'Ativo', turma:'', observacoes:'' });
    setIsSubmitting(false);
  };

  const handleDescartar = () => {
    setFormData({ nome:'', email:'', dn:'', cpf:'', telefone:'', tipo:'Soldado', cidade:'', idade:'14', tutor:'Responsável legal', dataIngressao:'', status:'Ativo', turma:'', observacoes:'' });
    setSubmitMsg(null);
  };

  const fieldStyle = { width:'100%', padding:'12px 16px', borderRadius:12, border:'1px solid rgba(139,92,246,0.25)', background:'rgba(255,255,255,0.05)', color:'#e2e8f0', fontSize:14, outline:'none', fontFamily:'Inter, sans-serif' };
  const labelStyle = { fontSize:12, fontWeight:600, color:'rgba(148,163,184,0.7)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:6, display:'block' };

  return (
    <main ref={containerRef} className="flex-1 p-6 md:p-10 pb-32 cyber-grid-bg" style={{ background:'#07060f', minHeight:0, overflowY:'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Header */}
        <header className="animate-assemble" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, paddingBottom:16, borderBottom:'1px solid rgba(139,92,246,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Users style={{ width:22, height:22, color:'#a78bfa' }}/>
            </div>
            <h1 style={{ fontWeight:700, fontSize: isMobile ? 20 : 24, color:'#e2e8f0' }}>Turmas</h1>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ padding:8, borderRadius:8, background:'transparent', border:'none', color:'rgba(148,163,184,0.6)', cursor:'pointer', display:'flex' }} title="Notificações">
              <Bell style={{ width:20, height:20 }}/>
            </button>
            <button style={{ padding:8, borderRadius:8, background:'transparent', border:'none', color:'rgba(148,163,184,0.6)', cursor:'pointer', display:'flex' }} title="Configurações">
              <Settings style={{ width:20, height:20 }}/>
            </button>
          </div>
        </header>

        {/* Quick Actions */}
        <div className="animate-assemble" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
          <button
            onClick={() => alert('Lista exportada com sucesso!')}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 16px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(139,92,246,0.2)', color:'#e2e8f0', cursor:'pointer', fontSize:14, fontWeight:600, transition:'all 0.2s' }}>
            <Download style={{ width:16, height:16, color:'#a78bfa' }}/>
            Exportar
          </button>
          <button
            onClick={() => setShowStudents(!showStudents)}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 16px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(139,92,246,0.2)', color:'#e2e8f0', cursor:'pointer', fontSize:14, fontWeight:600, transition:'all 0.2s' }}>
            <Eye style={{ width:16, height:16, color:'#a78bfa' }}/>
            {showStudents ? 'Fechar Turmas' : 'Ver Turmas'}
          </button>
        </div>

        {/* Alunos Cadastrados (showStudents) */}
        {showStudents && (
          <div className="animate-assemble" style={{ marginBottom:24 }}>
            <div className="cyber-card animate-assemble grid-responsive" style={{ padding:24, marginBottom:16 }}>
              <div>
                <label style={labelStyle}>Instrutor</label>
                <select value={selectedInstrutor} onChange={e => setSelectedInstrutor(e.target.value)} className="cyber-select" style={{ ...fieldStyle, cursor:'pointer' }}>
                  <option value="">Todos os instrutores</option>
                  {MOCK_INSTRUTORES.map(i => <option key={i.nome} value={i.nome}>{i.nome}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Cidade</label>
                <select value={selectedCidade} onChange={e => setSelectedCidade(e.target.value)} className="cyber-select" style={{ ...fieldStyle, cursor:'pointer' }}>
                  <option value="">Todas as cidades</option>
                  {MOCK_CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="cyber-card" style={{ overflow:'hidden' }}>
              <div style={{ padding:'16px 24px', borderBottom:'1px solid rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <h3 style={{ fontWeight:700, color:'#e2e8f0', fontSize:15, margin:0 }}>Alunos Cadastrados</h3>
                <span style={{ fontSize:12, background:'rgba(139,92,246,0.15)', padding:'4px 12px', borderRadius:20, color:'#c4b5fd', fontWeight:600 }}>{MOCK_ALUNOS.length} alunos</span>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(139,92,246,0.15)', color:'rgba(148,163,184,0.6)', fontSize:11, textTransform:'uppercase', letterSpacing:0.8 }}>
                      <th style={{ padding:'12px 24px' }}>Nome</th>
                      <th style={{ padding:'12px 24px' }}>E-mail</th>
                      <th style={{ padding:'12px 24px' }}>CPF</th>
                      <th style={{ padding:'12px 24px' }}>DN</th>
                      <th style={{ padding:'12px 24px' }}>Telefone</th>
                      <th style={{ padding:'12px 24px' }}>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ALUNOS.map((aluno, idx) => (
                      <tr key={aluno.id} style={{ borderBottom: idx < MOCK_ALUNOS.length - 1 ? '1px solid rgba(139,92,246,0.1)' : 'none', fontSize:13, transition:'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(139,92,246,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <td style={{ padding:'14px 24px', display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#c4b5fd,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0 }}>{aluno.nome[0]}</div>
                          <div>
                            <p style={{ fontWeight:600, color:'#e2e8f0', margin:0 }}>{aluno.nome}</p>
                            <p style={{ fontSize:11, color:'rgba(148,163,184,0.5)', marginTop:1, margin:0 }}>{aluno.turno}</p>
                          </div>
                        </td>
                        <td style={{ padding:'14px 24px', color:'rgba(148,163,184,0.8)' }}>{aluno.email}</td>
                        <td style={{ padding:'14px 24px', color:'rgba(148,163,184,0.8)', fontFamily:'monospace' }}>{aluno.cpf}</td>
                        <td style={{ padding:'14px 24px', color:'rgba(148,163,184,0.8)' }}>{aluno.dn}</td>
                        <td style={{ padding:'14px 24px', color:'rgba(148,163,184,0.8)' }}>{aluno.tel}</td>
                        <td style={{ padding:'14px 24px' }}>
                          <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background: aluno.tipo==='Soldado'?'rgba(59,130,246,0.15)':'rgba(139,92,246,0.15)', color: aluno.tipo==='Soldado'?'#60a5fa':'#c4b5fd', border: aluno.tipo==='Soldado'?'1px solid rgba(59,130,246,0.3)':'1px solid rgba(139,92,246,0.3)' }}>{aluno.tipo}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Lançamento Rápido */}
        <section className="animate-assemble" style={{ marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, paddingLeft:4 }}>
            <Zap style={{ width:18, height:18, color:'#fbbf24' }}/>
            <h2 style={{ fontSize:13, fontWeight:700, color:'rgba(148,163,184,0.6)', textTransform:'uppercase', letterSpacing:1 }}>Lançamento Rápido</h2>
          </div>
          <div className="cyber-card" style={{ padding:0, overflow:'hidden', position:'relative' }}>
            <textarea
              placeholder="Cole aqui a lista de nomes ou notas..."
              value={promptIA}
              onChange={e => setPromptIA(e.target.value)}
              style={{ width:'100%', minHeight:120, padding:20, fontSize:15, background:'transparent', border:'none', outline:'none', color:'#e2e8f0', fontWeight:500, fontFamily:'Inter, sans-serif', resize:'none' }}
            />
            <button onClick={handleLancarIA} disabled={isLoadingIA || !promptIA.trim()}
              style={{ position:'absolute', bottom:12, right:12, padding:10, borderRadius:10, background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)', color:'#a78bfa', cursor:'pointer', display:'flex' }}>
              {isLoadingIA ? <Loader2 style={{ width:18, height:18, animation:'spin 1s linear infinite' }}/> : <Sparkles style={{ width:18, height:18 }}/>}
            </button>
          </div>
        </section>

        {/* Novo Aluno Form (glass card) */}
        <section className="cyber-card animate-assemble" style={{ padding: isMobile ? 24 : 32, border:'1px solid rgba(139,92,246,0.3)', background:'rgba(22,12,40,0.5)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
            <UserPlus style={{ width:20, height:20, color:'#a78bfa' }}/>
            <h2 style={{ fontSize:20, fontWeight:700, color:'#e2e8f0', margin:0 }}>Novo Aluno</h2>
          </div>

          <div className="grid-responsive" style={{ gap:16 }}>
            <div>
              <label style={labelStyle}>Nome Completo</label>
              <input type="text" value={formData.nome} onChange={handleForm('nome')} placeholder="Digite o nome do aluno" className="cyber-input" style={fieldStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Turma Destino</label>
              <div style={{ position:'relative' }}>
                <select value={formData.turma} onChange={handleForm('turma')} className="cyber-select" style={{ ...fieldStyle, cursor:'pointer', appearance:'none' }}>
                  <option value="">Selecione uma turma</option>
                  <option value="9º Ano B">9º Ano B</option>
                  <option value="1º Médio A">1º Médio A</option>
                </select>
                <ChevronDown style={{ width:16, height:16, position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'rgba(148,163,184,0.5)' }}/>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Cidade / Residência</label>
              <input type="text" value={formData.cidade} onChange={handleForm('cidade')} placeholder="Ex: São Paulo" className="cyber-input" style={fieldStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Idade</label>
              <input type="text" value={formData.idade} onChange={handleForm('idade')} placeholder="14" className="cyber-input" style={fieldStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Nome do Tutor</label>
              <input type="text" value={formData.tutor} onChange={handleForm('tutor')} placeholder="Responsável legal" className="cyber-input" style={fieldStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Data de Nascimento</label>
              <input type="date" value={formData.dn} onChange={handleForm('dn')} className="cyber-input" style={fieldStyle}/>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <div style={{ display:'flex', gap:16, height:46, alignItems:'center', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:12, padding:'0 16px' }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, color:'#e2e8f0', fontSize:14, cursor:'pointer' }}>
                  <input type="radio" name="status" value="Ativo" checked={formData.status === 'Ativo'} onChange={handleForm('status')} style={{ accentColor:'#8b5cf6' }} />
                  Ativo
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:8, color:'#e2e8f0', fontSize:14, cursor:'pointer' }}>
                  <input type="radio" name="status" value="Pendente" checked={formData.status === 'Pendente'} onChange={handleForm('status')} style={{ accentColor:'#8b5cf6' }} />
                  Pendente
                </label>
              </div>
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <label style={labelStyle}>Observações / Comentários</label>
              <textarea value={formData.observacoes} onChange={handleForm('observacoes')} placeholder="Informações adicionais sobre o perfil do aluno..." className="cyber-input" style={{ ...fieldStyle, minHeight:100, resize:'vertical' }}/>
            </div>
          </div>

          {submitMsg && (
            <div style={{ marginTop:20, padding:'14px 20px', borderRadius:12, display:'flex', alignItems:'center', gap:12, background: submitMsg.type==='success'?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', border: `1px solid ${submitMsg.type==='success'?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}`, color: submitMsg.type==='success'?'#4ade80':'#f87171' }}>
              {submitMsg.type==='success' ? <CheckCircle2 style={{ width:20, height:20 }}/> : <AlertCircle style={{ width:20, height:20 }}/>}
              <span style={{ fontWeight:600 }}>{submitMsg.text}</span>
            </div>
          )}

          <button onClick={handleLancar} disabled={isSubmitting} className="btn-cyber"
            style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'14px 24px', borderRadius:12, fontWeight:700, fontSize:15, marginTop:24 }}>
            {isSubmitting ? <><Loader2 style={{ width:18,height:18,animation:'spin 1s linear infinite' }}/> Lançando...</> : 'Finalizar Matrícula'}
          </button>
        </section>

      </div>
    </main>
  );
}

// ============================================================
// TELA: RELATÓRIOS E FALTAS — CYBERPUNK DASHBOARD + CHATBOT
// ============================================================
function RelatoriosScreen({ isMobile }) {
  const [realData, setRealData] = useState([]);
  const [cidadeFilter, setCidadeFilter] = useState('');
  const [etapaFilter, setEtapaFilter] = useState('');
  const [turmaFilter, setTurmaFilter] = useState('');
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataSource, setDataSource] = useState('loading');
  const [showArchive, setShowArchive] = useState(false);
  const [archiveList, setArchiveList] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  
  const containerRef = useRef(null);

  const loadArchive = () => {
    try {
      const raw = localStorage.getItem('relatorios_archive');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  };

  const loadPeriod = (period) => {
    const now = new Date();
    const currentPeriod = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const periodLabel = period || currentPeriod;
    setSelectedPeriod(periodLabel);
    setIsLoadingData(true);
    setProgressLoaded(false);

    const cacheKey = 'relatorios_cache_' + periodLabel;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try { setRealData(JSON.parse(cached)); setDataSource('cache'); } catch { setRealData(MOCK_ALUNOS); setDataSource('mock'); }
      setIsLoadingData(false);
      setTimeout(() => setProgressLoaded(true), 300);
      if (!period) localStorage.setItem('relatorios_current_period', periodLabel);
      return;
    }

    fetch(`${APPS_SCRIPT_URL}?acao=listar&period=${periodLabel}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success' && d.data) {
          setRealData(d.data);
          setDataSource('live');
          try { localStorage.setItem(cacheKey, JSON.stringify(d.data)); } catch(e){}
          if (!period) localStorage.setItem('relatorios_current_period', periodLabel);
        } else {
          setRealData(MOCK_ALUNOS);
          setDataSource('mock');
        }
      })
      .catch(e => {
        console.warn('fetch failed', e);
        setRealData(MOCK_ALUNOS);
        setDataSource('mock');
      })
      .finally(() => {
        setIsLoadingData(false);
        setTimeout(() => setProgressLoaded(true), 600);
      });
  };

  useEffect(() => {
    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    window.scrollTo(0, 0);

    const savedPeriod = localStorage.getItem('relatorios_current_period');
    const savedDataKey = 'relatorios_cache_' + savedPeriod;
    if (savedPeriod && savedPeriod !== period) {
      const savedJson = localStorage.getItem(savedDataKey);
      if (savedJson) {
        const archive = loadArchive();
        if (!archive.find(a => a.period === savedPeriod)) {
          archive.push({ period: savedPeriod, storedAt: new Date().toISOString(), data: JSON.parse(savedJson) });
          try { localStorage.setItem('relatorios_archive', JSON.stringify(archive)); } catch(e) { console.warn('archive store fail', e); }
        }
      }
    }

    setArchiveList(loadArchive());
    loadPeriod(null);
  }, []);

  // GSAP: mount animation for staggered elements
  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.animate-assemble');
    gsap.fromTo(elements,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, []);

  const alunosFiltrados = realData.filter(a => {
    let match = true;
    if (cidadeFilter && a.cidade && a.cidade !== cidadeFilter) match = false;
    // O filtro de etapa/turma entraria aqui quando o realData tiver esses campos
    return match;
  });

  const totalAlunos    = alunosFiltrados.length || 1;
  const totalFaltas    = alunosFiltrados.reduce((a, b) => a + b.faltas, 0);
  const totalPresencas = alunosFiltrados.reduce((a, b) => a + (b.totalAulas - b.faltas), 0);
  const mediaAssid     = Math.round(alunosFiltrados.reduce((a, b) => a + getAssiduidade(b), 0) / totalAlunos);
  const emRisco        = alunosFiltrados.filter(a => getAssiduidade(a) < 75).length;

  const donutData = [
    { name: 'Manhã',   value: alunosFiltrados.filter(a => a.turno === 'Manhã').length,  color:'#8b5cf6' },
    { name: 'Tarde',   value: alunosFiltrados.filter(a => a.turno === 'Tarde').length,   color:'#22d3ee' },
  ];

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
    <main ref={containerRef} className="cyber-grid-bg" style={{ background:'#07060f', flex:1, minHeight:0, overflowY:'auto' }}>
      <div style={{ padding: isMobile ? '20px 16px 80px' : '28px 24px 80px', maxWidth:1280, margin:'0 auto', width:'100%' }}>

        {/* ─── PAGE HEADER ─── */}
        <div className="animate-assemble" style={{ marginBottom:32, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
              <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:'1.75rem', fontWeight:700, background:'linear-gradient(135deg, #c4b5fd 0%, #ffffff 60%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                Relatórios de Faltas
              </h2>
              {dataSource !== 'loading' && (
                <span style={{ fontSize:10, padding:'3px 10px', borderRadius:20, fontWeight:700, display:'inline-flex', alignItems:'center', gap:4,
                  background: dataSource==='live'?'rgba(34,197,94,0.15)':'rgba(245,158,11,0.15)',
                  color: dataSource==='live'?'#4ade80':'#fbbf24',
                  border: `1px solid ${dataSource==='live'?'rgba(34,197,94,0.3)':'rgba(245,158,11,0.3)'}` }}>
                  {dataSource==='live' ? <><Database style={{width:10,height:10}}/> Planilha</> : dataSource==='cache' ? 'Cache' : 'Mock'}
                </span>
              )}
            </div>
            <p style={{ color:'rgba(148,163,184,0.6)', marginTop:6, fontSize:13 }}>Visão geral da frequência e assiduidade dos alunos no período atual.</p>
          </div>
          <div className="flex-responsive" style={{ alignItems:'center', justifyContent:'flex-end' }}>
            <select value={cidadeFilter} onChange={e => setCidadeFilter(e.target.value)}
              className="cyber-select" style={{ padding:'10px 16px', fontSize:12, minWidth:150, flex: isMobile ? '1 1 100%' : '0 1 auto' }}>
              <option value="">Todas as Cidades</option>
              {MOCK_CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={etapaFilter} onChange={e => setEtapaFilter(e.target.value)}
              className="cyber-select" style={{ padding:'10px 16px', fontSize:12, minWidth:140, flex: isMobile ? '1 1 100%' : '0 1 auto' }}>
              <option value="">Todas as Etapas</option>
              <option value="1">1ª Etapa (Janeiro)</option>
              <option value="2">2ª Etapa (Fevereiro)</option>
              <option value="3">3ª Etapa (Março)</option>
              <option value="4">4ª Etapa (Abril)</option>
              <option value="5">5ª Etapa (Maio)</option>
              <option value="6">6ª Etapa (Junho)</option>
            </select>
            <select value={turmaFilter} onChange={e => setTurmaFilter(e.target.value)}
              className="cyber-select" style={{ padding:'10px 16px', fontSize:12, minWidth:140, flex: isMobile ? '1 1 100%' : '0 1 auto' }}>
              <option value="">Todas as Matérias</option>
              {MOCK_TURMAS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => loadPeriod(selectedPeriod)} style={{ padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg, #8b5cf6, #7c3aed)', color:'white', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, boxShadow:'0 4px 12px rgba(139,92,246,0.3)', flex: isMobile ? '1 1 100%' : '0 1 auto', justifyContent:'center' }}>
              <RefreshCw style={{ width:14, height:14 }}/>Atualizar
            </button>
            <button onClick={() => setShowArchive(!showArchive)} style={{ padding:'10px 20px', borderRadius:10, border:'1px solid rgba(139,92,246,0.3)', background:'rgba(139,92,246,0.1)', color:'#c4b5fd', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, flex: isMobile ? '1 1 100%' : '0 1 auto', justifyContent:'center' }}>
              <Database style={{ width:14, height:14 }}/>Arquivo
            </button>
          </div>
        </div>

        {/* ─── METRIC CARDS ─── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16, marginBottom:28 }} className="animate-assemble">
          {[
            { label:'Total de Alunos', value: totalAlunos, icon: Users, color:'#c4b5fd', sub:'ativos no período' },
            { label:'Méd. Assiduidade', value: `${mediaAssid}%`, icon: Activity, color:'#34d399', sub:'da turma geral' },
            { label:'Alunos em Risco', value: emRisco, icon: AlertTriangle, color:'#f87171', sub:'abaixo de 75%' },
            { label:'Total de Presenças', value: totalPresencas, icon: CheckCircle2, color:'#60a5fa', sub:'registradas' },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="metric-card" style={{ opacity:1, background:'rgba(139,92,246,0.06)', borderColor:'rgba(139,92,246,0.2)' }}>
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
        <div className="animate-assemble dashboard-grid" style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 320px', gap:24, marginBottom:32 }}>

          {/* Student Table */}
          <div className="cyber-card" style={{ padding:0, overflow:'hidden', background:'rgba(139,92,246,0.06)', borderColor:'rgba(139,92,246,0.2)' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(139,92,246,0.15)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:600, color:'#e2e8f0', fontSize:15 }}>Lista de Alunos</h3>
              <button style={{ fontSize:11, padding:'6px 14px', borderRadius:20, background:'rgba(139,92,246,0.15)', color:'#c4b5fd', fontWeight:600, border:'1px solid rgba(139,92,246,0.3)', cursor:'pointer' }}>Ver todos</button>
            </div>
            {/* Table header */}
            <div className="student-row-header" style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 60px 140px 60px', gap:12, padding:'10px 24px', background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(139,92,246,0.08)', fontSize:11, fontWeight:700, color:'rgba(148,163,184,0.5)', textTransform:'uppercase', letterSpacing:0.8 }}>
              <span>Aluno</span><span>Turno</span><span>Assiduidade</span><span>Faltas</span>
            </div>
            {MOCK_ALUNOS.map((aluno, idx) => {
              const assid = getAssiduidade(aluno);
              return (
                <div key={aluno.id} className="student-row" style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 60px 140px 60px', gap:12, padding:'14px 24px', borderBottom: idx < MOCK_ALUNOS.length-1 ? '1px solid rgba(139,92,246,0.06)' : 'none', alignItems:'center', transition:'all 0.2s', cursor:'default' }}
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

        {/* ─── CHART MERGED ─── */}
        <div className="cyber-card animate-assemble" style={{ padding:0, overflow:'hidden', marginBottom:28, display:'flex', flexDirection:'column' }}>
          
          {/* Chart Section */}
          <div style={{ padding:'24px 24px 16px' }}>
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
        </div>

        {/* ─── ARCHIVE PANEL ─── */}
        {showArchive && (
          <div className="animate-assemble cyber-card" style={{ padding:24, marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <h3 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, color:'#e2e8f0', fontSize:16, margin:0, display:'flex', alignItems:'center', gap:8 }}>
                <Database style={{ width:18, height:18, color:'#c4b5fd' }}/> Arquivo de Períodos
              </h3>
              <button onClick={() => setShowArchive(false)} style={{ background:'transparent', border:'none', color:'rgba(148,163,184,0.6)', cursor:'pointer', fontSize:13, fontWeight:600 }}>Fechar</button>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              <button onClick={() => {
                const now = new Date();
                loadPeriod(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`);
              }} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid rgba(139,92,246,0.3)', background: !selectedPeriod || selectedPeriod === `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}` ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)', color:'#c4b5fd', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.2s' }}>
                Período Atual
              </button>
              {archiveList.map((a, i) => (
                <button key={i} onClick={() => loadPeriod(a.period)}
                  style={{ padding:'10px 18px', borderRadius:10, border:'1px solid rgba(139,92,246,0.3)', background: selectedPeriod === a.period ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)', color:'#c4b5fd', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.2s' }}>
                  {a.period}
                </button>
              ))}
            </div>
            {archiveList.length === 0 && (
              <p style={{ color:'rgba(148,163,184,0.5)', fontSize:14, textAlign:'center', padding:20 }}>Nenhum período arquivado ainda. Os dados de meses anteriores serão arquivados automaticamente.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

// ============================================================
// APP PRINCIPAL — BRASIL.IA
// ============================================================
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState('relatorios');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const sidebarRef    = useRef(null);
  const contentRef    = useRef(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const userEmail = ADMIN_EMAIL;
  const isAdmin   = userEmail === ADMIN_EMAIL;

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current,
        { x: -320, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
    }
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.15 }
      );
    }
    if (contentRef.current) {
      contentRef.current.classList.add('mount-assemble');
      setTimeout(() => { contentRef.current && contentRef.current.classList.remove('mount-assemble'); }, 800);
    }
    setTimeout(() => {
      const fab = document.querySelector('.fab-ai');
      const toggle = document.querySelector('.desktop-ai-toggle');
      if (fab) gsap.fromTo(fab, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.15 });
      if (toggle) gsap.fromTo(toggle, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 });
    }, 300);
  }, []);

  const handleScreenChange = (id) => {
    if (!contentRef.current || id === activeScreen) return;
    // trigger CSS mount helpers for new screen
    contentRef.current.classList.add('mount-assemble');
    gsap.to(contentRef.current, {
      opacity: 0, y: 16, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setActiveScreen(id);
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }
        );
        setTimeout(() => { contentRef.current && contentRef.current.classList.remove('mount-assemble'); }, 600);
      }
    });
    if (isMobile) setIsSidebarOpen(false);
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

      {isSidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}/>
      )}

      {/* ── SIDEBAR ── */}
      <aside
        ref={sidebarRef}
        className={`sidebar-cyber ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          width: isMobile ? '100vw' : isTablet ? 240 : (isSidebarOpen ? 280 : 0),
          minWidth: isMobile ? '100vw' : isTablet ? 240 : (isSidebarOpen ? 280 : 0),
          overflow: 'hidden',
          height:'100%',
          display:'flex', flexDirection:'column',
          transition: 'width 0.3s ease, min-width 0.3s ease',
          position: isMobile ? 'fixed' : 'relative',
          zIndex: 50,
        }}>
        <div style={{ width:'100%', display:'flex', flexDirection:'column', height:'100%', maxWidth: isMobile ? '100vw' : 280 }}>

          {/* Logo */}
          <div style={{ height:68, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', borderBottom:'1px solid rgba(139,92,246,0.15)', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 0 14px rgba(139,92,246,0.4)' }}>
                <GraduationCap style={{ width:20, height:20, color:'white' }} />
              </div>
              <div style={{ lineHeight:1.1, display:'flex', flexDirection:'column' }}>
                <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:16, color:'#e2e8f0', letterSpacing:'0.5px' }}>BRASIL.IA</span>
                <span style={{ fontSize:8, fontWeight:700, color:'rgba(148,163,184,0.4)', letterSpacing:'0.5px', textTransform:'uppercase' }}>EDUCATIONAL MANAGEMENT</span>
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
          <div style={{ padding:'12px 12px 20px', borderTop:'1px solid rgba(139,92,246,0.12)', flexShrink:0, display:'flex', flexDirection:'column', gap:12 }}>
            <button onClick={() => handleScreenChange('gerar')} className="btn-cyber" style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px 16px', borderRadius:999, fontSize:13, fontWeight:700 }}>
              <Plus style={{ width:16, height:16 }}/>
              Novo Relatório
            </button>
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
            <h1 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:600, fontSize: isMobile ? 14 : 16, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth: isMobile ? '140px' : 'none' }}>{screenTitles[activeScreen]}</h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button style={{ background:'transparent', border:'none', color:'rgba(148,163,184,0.7)', cursor:'pointer', padding:4, display:'flex', position:'relative', outline:'none' }} title="Notificações">
              <Bell style={{ width:20, height:20 }}/>
              <div style={{ position:'absolute', top:2, right:2, width:6, height:6, borderRadius:'50%', background:'#f87171', border:'1px solid #0d0b1e' }}/>
            </button>
            <button style={{ background:'transparent', border:'none', color:'rgba(148,163,184,0.7)', cursor:'pointer', padding:4, display:'flex', outline:'none' }} title="Configurações">
              <Settings style={{ width:20, height:20 }}/>
            </button>
            <div style={{ width:34, height:34, borderRadius:'50%', border:'2px solid rgba(139,92,246,0.4)', overflow:'hidden', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#8b5cf6,#7c3aed)' }}>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80" alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
          </div>
        </header>

        {/* Content */}
        <div ref={contentRef} style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', minHeight:0 }}>
          {activeScreen === 'diario'     && <DiarioScreen userEmail={userEmail}/>}
          {activeScreen === 'gerar'      && <GerarRelatoriosScreen userEmail={userEmail}/>}
          {activeScreen === 'turmas'     && <TurmasScreen userEmail={userEmail} isMobile={isMobile}/>}
          {activeScreen === 'relatorios' && <RelatoriosScreen isMobile={isMobile}/>}
        </div>
      </div>

      {/* Badge BY ALAN */}
      <div className="by-alan-badge" style={{ position:'fixed', bottom:20, right: isAIChatOpen && !isMobile ? 400 : 20, zIndex:100, display:'flex', flexDirection:'column', alignItems:'center', gap:6, pointerEvents:'none', transition:'right 0.4s' }}>
        <div style={{ background:'rgba(13,11,30,0.9)', padding:6, borderRadius:14, border:'1px solid rgba(139,92,246,0.3)', boxShadow:'0 0 20px rgba(139,92,246,0.2)' }}>
          <BrasilIARobot size={32}/>
        </div>
        <div style={{ background:'rgba(255,255,255,0.08)', backdropFilter:'blur(10px)', padding:'4px 12px', borderRadius:20, border:'1px solid rgba(139,92,246,0.2)' }}>
          <span style={{ fontSize:9, fontWeight:800, color:'rgba(196,181,253,0.8)', letterSpacing:2, textTransform:'uppercase' }}>BY ALAN</span>
        </div>
      </div>

      {/* GLOBAL CHATBOT SIDEBAR & TOGGLES */}
      {activeScreen !== 'diario' && (
        <>
          <div className="fab-ai" onClick={() => setIsAIChatOpen(true)}>
             <Brain color="white" />
          </div>
          <div className="desktop-ai-toggle" onClick={() => setIsAIChatOpen(!isAIChatOpen)}>
             <Brain size={20} className="robot-pulse" />
             <span style={{ fontSize:10, fontWeight:800, marginTop:4, color:'white' }}>IA</span>
          </div>
          <GlobalChatbot isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} isMobile={isMobile} />
        </>
      )}
    </div>
  );
}
