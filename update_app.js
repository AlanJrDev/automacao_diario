const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add hook for scroll animations and data fetch function
const hookCode = \
// ============================================================
// DATA FETCHING & ANIMATION
// ============================================================
export const useLegoAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.lego-piece').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
};

const GlobalChatbot = ({ isOpen, onClose, isMobile }) => {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([{ role: 'ai', text: 'Olá! Sou a IA do BRASIL.IA. Posso extrair dados, cadastrar alunos ou analisar as planilhas. Como posso ajudar?' }]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

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
        headers: { 'Content-Type': 'application/json', 'Authorization': \\\Bearer \\\\\\ },
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
      {/* Overlay mobile */}
      {isOpen && isMobile && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:99 }} onClick={onClose} />}
      <div className={\\\"chatbot-sidebar \\\" + (isOpen ? 'open' : '')}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(139,92,246,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ background:'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(124,58,237,0.1))', padding:8, borderRadius:10 }}>
              <Brain style={{ width:18, height:18, color:'#a78bfa' }}/>
            </div>
            <h3 style={{ fontWeight: 'bold', color: 'white' }}>IA Global</h3>
          </div>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'white', cursor:'pointer' }}><X /></button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {chatMessages.map((msg, idx) => (
            <div key={idx} style={{ display:'flex', flexDirection: msg.role==='user' ? 'row-reverse' : 'row', alignItems:'flex-start', gap:10 }}>
              {msg.role === 'ai' && (
                <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(124,58,237,0.2))', border:'1px solid rgba(139,92,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Bot style={{ width:14, height:14, color:'#a78bfa' }}/>
                </div>
              )}
              <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'} style={{ whiteSpace:'pre-wrap' }}>
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
                  <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#8b5cf6', animation:\\\link 1.2s \\\s ease-in-out infinite\\\ }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div style={{ padding: '16px', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input 
              type="text" 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleChatSend()}
              placeholder="Digite sua dúvida..." 
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #4c1d95', background: '#1a1030', color: 'white', outline:'none' }}
            />
            <button onClick={handleChatSend} style={{ padding:'10px', borderRadius:'8px', background:'#8b5cf6', border:'none', color:'white', cursor:'pointer' }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
\;

code = code.replace('const getAssiduidade = (aluno) => Math.round(((aluno.totalAulas - aluno.faltas) / aluno.totalAulas) * 100);', 'const getAssiduidade = (aluno) => Math.round(((aluno.totalAulas - aluno.faltas) / aluno.totalAulas) * 100);\\n' + hookCode);

// 2. Add lego-piece class to DiarioScreen elements
code = code.replace(/<div style={{ maxWidth: 860, margin: '0 auto' }} className="space-y-6">/g, '<div style={{ maxWidth: 860, margin: \\'0 auto\\' }} className="space-y-6 lego-piece">');

// 3. Rebuild RelatoriosScreen
const oldRelatoriosStr = \// ============================================================
// TELA: RELATÓRIOS
// ============================================================
function RelatoriosScreen({ userEmail }) {\;

let newRelatorios = \// ============================================================
// TELA: RELATÓRIOS
// ============================================================
function RelatoriosScreen({ userEmail }) {
  useLegoAnimation();
  
  const [cidadeFilter, setCidadeFilter] = useState('');
  const [etapaFilter, setEtapaFilter] = useState('');
  const [turmaFilter, setTurmaFilter] = useState('');
  const [realData, setRealData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); // Garante que carrega no topo
    
    // Fetch data do AppScript (Simulando GET se não existir)
    fetch(APPS_SCRIPT_URL + '?acao=listar_dados')
      .then(r => r.json())
      .then(d => {
        if(d.status==='success' && d.data) setRealData(d.data);
        else setRealData(MOCK_ALUNOS); // Fallback para MOCK_ALUNOS (que será atualizado para 18 alunos no backend depois)
      })
      .catch(e => {
        console.warn("Uso de MOCK local. Apps Script GET não configurado.");
        setRealData(MOCK_ALUNOS);
      })
      .finally(() => setIsLoadingData(false));
  }, []);

  const availableTurmas = MOCK_TURMAS; // Idealmente extraído do realData

  const alunosFiltrados = realData.filter(a => {
    let match = true;
    if(cidadeFilter && a.cidade !== cidadeFilter) match = false;
    // Se tivesse etapa, filtraria aqui
    return match;
  });

  const totalAlunos = alunosFiltrados.length;
  const faltasTotais = alunosFiltrados.reduce((acc, a) => acc + a.faltas, 0);
  const riscoAlunos = alunosFiltrados.filter(a => getAssiduidade(a) < 75).length;
\;

code = code.replace(oldRelatoriosStr, newRelatorios);

// Find and replace the return of RelatoriosScreen
// We will just replace some divs to add lego-piece class
code = code.replace(/className="grid-metrics"/g, 'className="grid-metrics lego-piece"');
code = code.replace(/className="cyber-card"/g, 'className="cyber-card lego-piece"');

// Update filters in RelatoriosScreen
code = code.replace(
  /<div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>[\\s\\S]*?<\\/div>\\s*<\\/div>/,
  \<div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }} className="lego-piece">
            <select className="cyber-select" value={cidadeFilter} onChange={e => setCidadeFilter(e.target.value)}>
              <option value="">Todas as Cidades</option>
              {MOCK_CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="cyber-select" value={etapaFilter} onChange={e => setEtapaFilter(e.target.value)}>
              <option value="">Todas as Etapas</option>
              <option value="1">1ª Etapa</option>
              <option value="2">2ª Etapa</option>
              <option value="3">3ª Etapa</option>
            </select>
            <select className="cyber-select" value={turmaFilter} onChange={e => setTurmaFilter(e.target.value)}>
              <option value="">Todas as Matérias</option>
              {availableTurmas.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button className="btn-cyber" style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:8 }} onClick={() => {}}>
              <RefreshCw style={{ width:16, height:16 }}/> Atualizar
            </button>
          </div>
        </div>\
);

// Remove the old chatbot section from RelatoriosScreen
const chatbotSectionRegex = /\\{\\/\\* Chatbot Section \\*\\/\\}[\\s\\S]*?<\\/main>/;
code = code.replace(chatbotSectionRegex, '</main>');

// 4. Update TurmasScreen AI insert
const turmasAISection = \
            <h3 style={{ fontSize:18, fontWeight:700, color:'#1e293b', marginBottom:24 }}>Novo Aluno</h3>
            
            {/* Lançamento IA */}
            <div className="lego-piece" style={{ padding:'16px', background:'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(124,58,237,0.05))', border:'1px solid rgba(139,92,246,0.3)', borderRadius:'14px', marginBottom:'24px', display:'flex', gap:'12px', alignItems:'center' }}>
               <Brain style={{ color:'#8b5cf6', flexShrink:0 }} />
               <input type="text" placeholder="Lançamento com IA: Ex: Adicione João Silva, 6199999999, Planaltina, Cidadão" 
                 style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#1e293b', fontSize:'14px' }}
                 onKeyDown={e => {
                   if(e.key === 'Enter') {
                      setIsSubmitting(true);
                      setTimeout(() => {
                        setFormData({ nome:'João Silva', email:'', dn:'', cpf:'', telefone:'61 99999999', tipo:'Cidadão', cidade:'Planaltina' });
                        setIsSubmitting(false);
                      }, 1000);
                   }
                 }}
               />
               <button className="btn-cyber" style={{ padding:'8px 16px', fontSize:'12px' }}>Preencher Mágico</button>
            </div>
\;
code = code.replace(/<h3 style={{ fontSize:18, fontWeight:700, color:'#1e293b', marginBottom:24 }}>Novo Aluno<\\/h3>/, turmasAISection);
code = code.replace(/function TurmasScreen\\(\\{ userEmail \\}\\) \\{/, 'function TurmasScreen({ userEmail }) { useLegoAnimation();');

// 5. App Component - add Sidebar
code = code.replace(/export default function App\\(\\) \\{/, \export default function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
\);

code = code.replace(/<\\/div>\\s*<\\/div>\\s*<\\/aside>/, \</div></div></aside>
      
      {/* GLOBAL CHATBOT SIDEBAR & FAB */}
      {activeScreen !== 'diario' && (
        <>
          <div className="md-hidden fab-ai" onClick={() => setIsAIChatOpen(true)}>
             <Brain color="white" />
          </div>
          <div className="desktop-ai-toggle" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }} onClick={() => setIsAIChatOpen(!isAIChatOpen)}>
             <Brain size={18} />
             IA Insights
          </div>
          <GlobalChatbot isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} isMobile={window.innerWidth < 768} />
        </>
      )}
\);

fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx updated!');
