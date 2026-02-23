import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Database, Github, Settings, FileText, 
  Bot, Send, Plus, Upload, Trash2, Cpu, ChevronDown, 
  BookOpen, Save, Menu, X, Sparkles, Lightbulb,
  PlusCircle, Layers, CheckCircle2, CircleDashed,
  BrainCircuit, Video, Presentation, Headphones,
  Globe, Code, Server, Triangle, Network, Check
} from 'lucide-react';

export default function EldonWorkstation() {
  const [activeTab, setActiveTab] = useState('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string; ai: string; variant?: string; media?: any[] }>>([
    { role: 'ai', content: 'Welcome to your Eldon Workstation. Premium APIs initialized (Gemini 3.1 Pro, Claude 4.6, Manus Connectors). What are we building today?', ai: 'system' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- INTEGRATIONS & API CONFIGURATION STATE ---
  const [integrations, setIntegrations] = useState({
    supabaseUrl: '',
    supabaseKey: '',
    githubToken: '',
    vercelToken: ''
  });
  const [configSaved, setConfigSaved] = useState(false);

  // --- AI API KEYS STATE ---
  const [aiApiKeys, setAiApiKeys] = useState<Record<string, string>>({
    'gemini': '',
    'notebooklm': '',
    'claude': '',
    'deepseek': '',
    'manus': ''
  });
  const [aiKeysSaved, setAiKeysSaved] = useState(false);

  // --- UPDATED PREMIUM AI PROVIDER STATE ---
  const [availableAIs, setAvailableAIs] = useState<Array<{ id: string; name: string; theme: string }>>([
    { id: 'master-skill', name: '✨ 3-Layer Master Skill', theme: 'bg-gradient-to-r from-amber-400 to-yellow-600 text-gray-950 font-bold' },
    { id: 'manus', name: 'Manus AI (Integrations)', theme: 'bg-gray-200 text-gray-900' },
    { id: 'gemini', name: 'Google Gemini 3.1 Pro', theme: 'bg-amber-500 text-gray-950' },
    { id: 'notebooklm', name: 'Notebook LM', theme: 'bg-yellow-600 text-white' },
    { id: 'claude', name: 'Anthropic Claude 4.6', theme: 'bg-amber-700 text-white' },
    { id: 'deepseek', name: 'DeepSeek V3', theme: 'bg-yellow-400 text-gray-900' },
  ]);
  const [selectedAI, setSelectedAI] = useState('manus');
  const [newAiName, setNewAiName] = useState('');

  // --- DYNAMIC NATIVE FEATURES TOGGLES ---
  const [enableDeepThinking, setEnableDeepThinking] = useState(true);
  const [enableGrounding, setEnableGrounding] = useState(false);
  const [requestSlides, setRequestSlides] = useState(true);
  const [requestVideo, setRequestVideo] = useState(false);
  const [requestAudio, setRequestAudio] = useState(false);
  const [useMultiAI, setUseMultiAI] = useState(true);
  const [useWeb, setUseWeb] = useState(true);
  const [useGithub, setUseGithub] = useState(true);
  const [useVercel, setUseVercel] = useState(false);
  const [useSupabase, setUseSupabase] = useState(true);
  const [useAutoExecute, setUseAutoExecute] = useState(false);

  // --- SUB-MODEL VARIANTS ---
  const [geminiVariant, setGeminiVariant] = useState('Gemini 3.1 Pro (Balanced)');
  const [claudeVariant, setClaudeVariant] = useState('Claude 4.6 Sonnet (Logic)');
  const [notebookVariant, setNotebookVariant] = useState('Standard Synthesis');

  // --- GEMINI API FEATURES & PIPELINE STATE ---
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [studyPlan, setStudyPlan] = useState("");
  const [fileSummaries, setFileSummaries] = useState<Record<number, string>>({});
  const [summarizingFileId, setSummarizingFileId] = useState<number | null>(null);
  const [pipelineState, setPipelineState] = useState({ active: false, step: 0 });

  // --- REAL FILE UPLOAD SYSTEM ---
  const [skillsFiles, setSkillsFiles] = useState<Array<{ id: number; name: string; size: string; date: string; content: string | ArrayBuffer }>>([]);
  const [history] = useState([
    { id: 1, title: 'GitHub Repo Initialization', date: '2 Hours ago', ai: 'Manus AI' },
    { id: 2, title: 'Data Architecture Analysis', date: 'Yesterday', ai: 'Gemini 3.1 Pro' }
  ]);

  const processFiles = (filesArray: FileList | File[]) => {
    Array.from(filesArray).forEach(file => {
      const reader = new FileReader();
      
      // Determine if file is text-readable
      const isText = file.type.includes('text') || file.name.match(/\.(md|csv|json|js|jsx|ts|tsx|html|css|py|cpp|txt)$/i);
      
      reader.onload = (event) => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          date: new Date().toISOString().split('T')[0],
          // Extract text if possible, otherwise store metadata note
          content: (isText ? event.target?.result : `[Binary File metadata: ${file.name}. Vector extraction required via backend.]`) as string | ArrayBuffer
        };
        setSkillsFiles(prev => [...prev, newFile]);
      };

      if (isText) {
        reader.readAsText(file);
      } else {
        // Read as Data URL to just register that we have it (for images, pdfs, etc)
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) processFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const removeFile = (id: number) => {
    setSkillsFiles(prev => prev.filter(f => f.id !== id));
    setFileSummaries(prev => {
      const newSummaries = {...prev};
      delete newSummaries[id as keyof typeof newSummaries];
      return newSummaries;
    });
  };

  // Construct Context String from Uploaded Files
  const getFileContextString = () => {
    if (skillsFiles.length === 0) return "";
    const fileContents = skillsFiles.map(f => `--- FILE: ${f.name} ---\n${f.content ? (f.content as string).substring(0, 3000) : 'Binary Content'}`).join("\n\n");
    return `\n\n[SYSTEM CONTEXT - UPLOADED FILES THE USER WANTS YOU TO READ]:\n${fileContents}\n[END SYSTEM CONTEXT]`;
  };

  // Reusable Gemini API Caller
  const callGeminiAPI = async (promptText: string) => {
    const apiKey = ""; // Canvas environment injects this securely
    const contextPrompt = getFileContextString();
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText + contextPrompt }] }] })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };

  const handleEnhancePrompt = async () => {
    if (!input.trim()) return;
    setIsEnhancing(true);
    try {
      const result = await callGeminiAPI(`Enhance the following short prompt into a detailed, professional, and clear prompt. Output ONLY the enhanced prompt text itself. Original prompt: "${input}"`);
      if (result) setInput(result.trim());
    } catch (e) {
      console.error("Failed to enhance prompt");
    }
    setIsEnhancing(false);
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const result = await callGeminiAPI(`I have uploaded several files to my AI workspace. Based ONLY on the contents of the attached files, generate a creative 3-step study or action plan. Keep it concise and format it cleanly.`);
      setStudyPlan(result);
    } catch (e) {
      setStudyPlan("Error generating plan. Please try again.");
    }
    setIsGeneratingPlan(false);
  };

  const handleSummarizeFile = async (fileId: number, fileName: string) => {
    setSummarizingFileId(fileId);
    try {
      // Find the specific file content
      const file = skillsFiles.find(f => f.id === fileId);
      const contentToSummarize = file ? (file.content as string).substring(0, 1500) : "No text content available.";
      
      const result = await callGeminiAPI(`Act as a senior developer. Provide a brief, 2-sentence executive summary of the following file content (File: "${fileName}"). Content:\n${contentToSummarize}`);
      setFileSummaries(prev => ({ ...prev, [fileId]: result }));
    } catch (e) {
      console.error("Failed to summarize file");
    }
    setSummarizingFileId(null);
  };

  const handleAddCustomAI = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAiName.trim()) return;
    const newId = newAiName.toLowerCase().replace(/\s+/g, '-');
    setAvailableAIs([...availableAIs, { 
      id: newId, 
      name: newAiName, 
      theme: 'bg-gray-400 text-gray-900'
    }]);
    setNewAiName('');
  };

  const handleSaveIntegrations = () => {
    // In a real app, send to backend here
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  const handleSaveAiKeys = () => {
    // Validate that at least one key is provided
    const hasKeys = Object.values(aiApiKeys).some(key => key.trim() !== '');
    if (!hasKeys) {
      alert('Please enter at least one API key');
      return;
    }
    // In a real app, send to backend here
    setAiKeysSaved(true);
    setTimeout(() => setAiKeysSaved(false), 3000);
  };

  useEffect(() => {
    const generateReplies = async () => {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'ai' && lastMsg.ai !== 'system' && !pipelineState.active) {
        setIsGeneratingReplies(true);
        try {
          const prompt = `Based on this AI response: "${lastMsg.content.substring(0, 500)}...", generate 3 short follow-up questions. Output ONLY a raw JSON array of 3 strings.`;
          const result = await callGeminiAPI(prompt);
          const match = result.match(/\[[\s\S]*\]/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (Array.isArray(parsed)) setSmartReplies(parsed.slice(0, 3));
          }
        } catch (e) {
          setSmartReplies([]);
        }
        setIsGeneratingReplies(false);
      } else {
        setSmartReplies([]);
      }
    };

    const timeout = setTimeout(generateReplies, 1500);
    return () => clearTimeout(timeout);
  }, [messages, pipelineState.active]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pipelineState]);

  const executeMasterPipeline = async (userMessage: string) => {
    setPipelineState({ active: true, step: 1 });
    try {
      const step1Result = await callGeminiAPI(`Act as ${claudeVariant}. Provide a rigorous initial analysis and structure for this request: "${userMessage}"`);
      setPipelineState({ active: true, step: 2 });
      
      const step2Result = await callGeminiAPI(`Act as ${geminiVariant}. Review this analysis and expand upon it: "${step1Result}"`);
      setPipelineState({ active: true, step: 3 });

      const step3Result = await callGeminiAPI(`Act as NotebookLM running in ${notebookVariant} mode. Take this deep analysis and present it beautifully as a final report: "${step2Result}".`);
      
      const mediaCards: any[] = [];
      if (requestSlides) mediaCards.push({ type: 'slides', title: 'Auto-Generated Presentation Deck', desc: 'NotebookLM generated 5 slides.' });
      if (requestVideo) mediaCards.push({ type: 'video', title: 'AI Video Summary', desc: 'NotebookLM studio processing video.' });
      if (requestAudio) mediaCards.push({ type: 'audio', title: 'Deep Dive Audio Overview', desc: 'NotebookLM Audio synthesis.' });

      setMessages((prev: any) => [...prev, { 
        role: 'ai', 
        content: `### 👁️ Layer 1: ${claudeVariant}\n${step1Result}\n\n---\n\n### 🧠 Layer 2: ${geminiVariant}\n${step2Result}\n\n---\n\n### 📓 Layer 3: NotebookLM (${notebookVariant})\n${step3Result}`, 
        ai: 'master-skill',
        variant: 'master-skill',
        media: mediaCards
      } as any]);
    } catch (e) {
      setMessages((prev: any) => [...prev, { role: 'ai', content: "Pipeline interrupted due to a network error. Please try again.", ai: 'master-skill', variant: 'master-skill' } as any]);
    }
    setPipelineState({ active: false, step: 0 });
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const newUserMsg = { role: 'user', content: input, ai: selectedAI, variant: selectedAI };
    setMessages((prev: any) => [...prev, newUserMsg as any]);
    setInput('');
    setIsLoading(true);

    if (selectedAI === 'master-skill') {
      await executeMasterPipeline(newUserMsg.content);
      return;
    }

    if (selectedAI === 'gemini') {
      try {
        const text = await callGeminiAPI(`[System Instructions: You are acting as ${geminiVariant}. Provide the response in that style]\n\nUser: ${newUserMsg.content}`);
        setMessages((prev: any) => [...prev, { role: 'ai', content: text || "No response received.", ai: 'gemini', variant: geminiVariant } as any]);
      } catch (e) {
        setMessages((prev: any) => [...prev, { role: 'ai', content: `Error connecting to Gemini API.`, ai: 'gemini', variant: 'gemini' } as any]);
      }
    } else {
      setTimeout(() => {
        const aiName = availableAIs.find(a => a.id === selectedAI)?.name || selectedAI;
        let connectorInfo = "";
        let variantName = aiName;
        
        if (selectedAI === 'manus') {
          connectorInfo = "\n\n**Manus Operations Performed:**\n" +
            (useMultiAI ? "✅ Synced with external Multi-AI agents.\n" : "") +
            (useWeb ? "✅ Live Web data extracted and processed.\n" : "") +
            (useGithub ? `✅ Code staged and pushed to GitHub (Token mapping verified).\n` : "") +
            (useVercel ? `✅ Triggered deployment via Vercel API Hook.\n` : "") +
            (useSupabase ? `✅ Database schema synced with Supabase Project.\n` : "") +
            (useAutoExecute ? "✅ Script executed in secure sandbox.\n" : "");
        } else if (selectedAI === 'notebooklm') {
           variantName = `NotebookLM (${notebookVariant})`;
           connectorInfo = "\n\n**NotebookLM Media Triggered:**\n" +
            (requestSlides ? "✅ Slide deck rendering in background.\n" : "") +
            (requestVideo ? "✅ Video Studio generating timeline.\n" : "") +
            (requestAudio ? "✅ Audio digest script being synthesized.\n" : "");
        } else if (selectedAI === 'claude') {
           variantName = claudeVariant;
           connectorInfo = "\n\n✅ Extended 200k Context utilized for this response.";
        }

        const fileStatus = skillsFiles.length > 0 ? `\n\n*Note: I have read and analyzed your ${skillsFiles.length} attached files to inform this response.*` : "";

        setMessages((prev: any) => [...prev, { 
          role: 'ai', 
          content: `[Simulation] Mock response from **${variantName}**.

In production, this routes via backend to the specific API endpoint.${connectorInfo}${fileStatus}`, 
          ai: selectedAI,
          variant: variantName
        } as any]);
        setIsLoading(false);
      }, 1500);
      return;
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAiTheme = (aiId: string) => {
    const ai = availableAIs.find(a => a.id === aiId);
    return ai ? ai.theme : 'bg-gray-600 text-white';
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const renderDynamicToolbar = () => {
    if (selectedAI === 'manus') {
      return (
        <div className="flex items-center space-x-2 md:space-x-4 max-w-4xl mx-auto w-full px-1 overflow-x-auto scrollbar-hide text-xs font-semibold text-gray-500 pb-2 border-b border-gray-800/50">
          <span className="uppercase tracking-widest hidden sm:inline text-amber-500/80">Manus Connectors:</span>
          <button onClick={() => setUseMultiAI(!useMultiAI)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${useMultiAI ? 'text-gray-900 bg-amber-500 border border-amber-400' : 'hover:text-gray-300 border border-transparent'}`}>
            <Network size={14} /> <span>Multi-AI Sync</span>
          </button>
          <button onClick={() => setUseWeb(!useWeb)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${useWeb ? 'text-gray-900 bg-amber-500 border border-amber-400' : 'hover:text-gray-300 border border-transparent'}`}>
            <Globe size={14} /> <span>Web</span>
          </button>
          <button onClick={() => setUseGithub(!useGithub)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${useGithub ? 'text-gray-900 bg-amber-500 border border-amber-400' : 'hover:text-gray-300 border border-transparent'}`}>
            <Github size={14} /> <span>GitHub</span>
          </button>
          <button onClick={() => setUseVercel(!useVercel)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${useVercel ? 'text-gray-900 bg-amber-500 border border-amber-400' : 'hover:text-gray-300 border border-transparent'}`}>
            <Triangle size={14} /> <span>Vercel</span>
          </button>
          <button onClick={() => setUseSupabase(!useSupabase)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${useSupabase ? 'text-gray-900 bg-amber-500 border border-amber-400' : 'hover:text-gray-300 border border-transparent'}`}>
            <Database size={14} /> <span>Supabase</span>
          </button>
          <button onClick={() => setUseAutoExecute(!useAutoExecute)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${useAutoExecute ? 'text-gray-900 bg-amber-500 border border-amber-400' : 'hover:text-gray-300 border border-transparent'}`}>
            <Code size={14} /> <span>Auto-Execute</span>
          </button>
        </div>
      );
    }

    if (selectedAI === 'master-skill') {
      return (
        <div className="flex flex-col space-y-2 max-w-4xl mx-auto w-full px-1 pb-2 border-b border-gray-800/50">
          <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto scrollbar-hide text-xs font-semibold">
             <span className="uppercase tracking-widest hidden sm:inline text-amber-500/80 mr-1">Engines:</span>
             <select value={claudeVariant} onChange={e => setClaudeVariant(e.target.value)} className="bg-[#1a1a1a] border border-gray-700 hover:border-amber-500/50 text-amber-400 rounded px-2 py-1 outline-none transition-colors">
                <option value="Claude 4.6 Sonnet (Logic)">Claude 4.6 Sonnet</option>
                <option value="Claude 4.6 Opus (Deep)">Claude 4.6 Opus</option>
             </select>
             <span className="text-gray-600">➔</span>
             <select value={geminiVariant} onChange={e => setGeminiVariant(e.target.value)} className="bg-[#1a1a1a] border border-gray-700 hover:border-amber-500/50 text-amber-400 rounded px-2 py-1 outline-none transition-colors">
                <option value="Gemini 3.1 Pro (Balanced)">Gemini 3.1 Pro</option>
                <option value="Gemini Deep Thinking 3.1">Gemini Thinking</option>
             </select>
             <span className="text-gray-600">➔</span>
             <select value={notebookVariant} onChange={e => setNotebookVariant(e.target.value)} className="bg-[#1a1a1a] border border-gray-700 hover:border-amber-500/50 text-amber-400 rounded px-2 py-1 outline-none transition-colors">
                <option value="Standard Synthesis">Notebook Standard</option>
                <option value="Deep Research Mode">Notebook Research</option>
             </select>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide text-xs font-semibold text-gray-500 pt-1">
            <span className="uppercase tracking-widest hidden sm:inline text-gray-600">Notebook Media:</span>
            <button onClick={() => setRequestSlides(!requestSlides)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1 rounded transition-colors ${requestSlides ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'hover:text-gray-300 border border-transparent'}`}>
              <Presentation size={14} /> <span>Gen Slides</span>
            </button>
            <button onClick={() => setRequestVideo(!requestVideo)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1 rounded transition-colors ${requestVideo ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'hover:text-gray-300 border border-transparent'}`}>
              <Video size={14} /> <span>Gen Video</span>
            </button>
          </div>
        </div>
      );
    }

    if (selectedAI === 'notebooklm') {
      return (
        <div className="flex items-center space-x-2 md:space-x-4 max-w-4xl mx-auto w-full px-1 overflow-x-auto scrollbar-hide text-xs font-semibold text-gray-500 pb-2 border-b border-gray-800/50">
          <span className="uppercase tracking-widest hidden sm:inline text-amber-500/80">NotebookLM:</span>
          <select value={notebookVariant} onChange={e => setNotebookVariant(e.target.value)} className="bg-[#1a1a1a] border border-gray-700 hover:border-amber-500/50 text-amber-400 rounded px-2 py-1.5 outline-none transition-colors">
            <option value="Standard Synthesis">Standard Synthesis</option>
            <option value="Deep Research Mode">Deep Research Mode</option>
          </select>
          <div className="h-4 border-l border-gray-700 mx-1"></div>
          <button onClick={() => setRequestSlides(!requestSlides)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${requestSlides ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'hover:text-gray-300 border border-transparent'}`}>
            <Presentation size={14} /> <span>Gen Slides</span>
          </button>
          <button onClick={() => setRequestVideo(!requestVideo)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${requestVideo ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'hover:text-gray-300 border border-transparent'}`}>
            <Video size={14} /> <span>Gen Video</span>
          </button>
          <button onClick={() => setRequestAudio(!requestAudio)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${requestAudio ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'hover:text-gray-300 border border-transparent'}`}>
            <Headphones size={14} /> <span>Gen Audio</span>
          </button>
        </div>
      );
    }

    if (selectedAI === 'gemini') {
      return (
        <div className="flex items-center space-x-2 md:space-x-4 max-w-4xl mx-auto w-full px-1 overflow-x-auto scrollbar-hide text-xs font-semibold text-gray-500 pb-2 border-b border-gray-800/50">
          <span className="uppercase tracking-widest hidden sm:inline text-amber-500/80">Gemini Engine:</span>
          <select value={geminiVariant} onChange={e => setGeminiVariant(e.target.value)} className="bg-[#1a1a1a] border border-gray-700 hover:border-amber-500/50 text-amber-400 rounded px-2 py-1.5 outline-none transition-colors">
             <option value="Gemini 3.1 Pro (Balanced)">Gemini 3.1 Pro</option>
             <option value="Gemini 3.1 Flash (Fast/Light)">Gemini 3.1 Flash</option>
             <option value="Gemini Deep Thinking 3.1">Gemini Deep Thinking</option>
          </select>
          <div className="h-4 border-l border-gray-700 mx-1"></div>
          <button onClick={() => setEnableGrounding(!enableGrounding)} className={`flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded transition-colors ${enableGrounding ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'hover:text-gray-300 border border-transparent'}`}>
            <Globe size={14} /> <span>Live Web Grounding</span>
          </button>
        </div>
      );
    }

    if (selectedAI === 'claude') {
      return (
        <div className="flex items-center space-x-2 md:space-x-4 max-w-4xl mx-auto w-full px-1 overflow-x-auto scrollbar-hide text-xs font-semibold text-gray-500 pb-2 border-b border-gray-800/50">
          <span className="uppercase tracking-widest hidden sm:inline text-amber-500/80">Claude Engine:</span>
          <select value={claudeVariant} onChange={e => setClaudeVariant(e.target.value)} className="bg-[#1a1a1a] border border-gray-700 hover:border-amber-500/50 text-amber-400 rounded px-2 py-1.5 outline-none transition-colors">
            <option value="Claude 4.6 Sonnet (Logic)">Claude 4.6 Sonnet</option>
            <option value="Claude 4.6 Opus (Deep)">Claude 4.6 Opus</option>
            <option value="Claude Fast (Quick)">Claude 4.6 Haiku</option>
          </select>
          <div className="h-4 border-l border-gray-700 mx-1"></div>
          <div className="flex-shrink-0 flex items-center space-x-1.5 px-2 py-1.5 rounded text-amber-400 bg-amber-500/10 border border-amber-500/20">
            <Server size={14} /> <span>200k Context Active</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-gray-200 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Toggle Button */}
      <button 
        className="md:hidden fixed top-3 left-3 z-50 p-2.5 bg-[#111111] text-amber-500 border border-amber-500/30 rounded-lg shadow-xl"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay Background (click to close) */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Gray & Gold Theme */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-300 md:translate-x-0 fixed md:relative z-40 w-64 md:w-72 h-full bg-[#111111] border-r border-gray-800 flex flex-col shadow-2xl`}>
        <div className="p-5 pl-16 md:pl-5 flex items-center space-x-3 border-b border-gray-800 bg-[#0a0a0a]">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center font-extrabold text-gray-950 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            E
          </div>
          <span className="font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
            Eldon Workstation
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={<MessageSquare size={18} />} label="Active Workspace" active={activeTab === 'chat'} onClick={() => switchTab('chat')} />
          <SidebarItem icon={<Database size={18} />} label="History & Data" active={activeTab === 'history'} onClick={() => switchTab('history')} />
          <SidebarItem icon={<BookOpen size={18} />} label="AI Skills & Files" active={activeTab === 'skills'} onClick={() => switchTab('skills')} />
          <div className="pt-6 pb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-3">Connections</p>
          </div>
          <SidebarItem icon={<Settings size={18} />} label="Settings & APIs" active={activeTab === 'settings'} onClick={() => switchTab('settings')} />
        </nav>

        <div className="p-4 border-t border-gray-800 bg-[#0a0a0a]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-gray-950 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              <span className="text-xs font-bold">PRO</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200">Premium User</p>
              <p className="text-[10px] text-amber-500 tracking-wider uppercase">v3.1 & v4.6 Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#0d0d0d] relative w-full md:w-auto">
        
        {/* VIEW: CHAT WORKSPACE */}
        {activeTab === 'chat' && (
          <>
            {/* Header / AI Selector */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-4 md:px-6 bg-[#111111]/80 backdrop-blur-md sticky top-0 z-10 shadow-sm pl-16 md:pl-6">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-400 text-sm hidden md:block">Target Engine:</span>
                <div className="relative group">
                  <select 
                    value={selectedAI} 
                    onChange={(e) => setSelectedAI(e.target.value)}
                    className={`appearance-none bg-[#1a1a1a] border border-gray-700 hover:border-amber-500/50 py-1.5 pl-3 pr-8 rounded-md text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer transition-colors font-medium max-w-[150px] md:max-w-none truncate ${selectedAI === 'master-skill' ? 'text-amber-400' : 'text-gray-200'}`}
                  >
                    {availableAIs.map(ai => (
                      <option key={ai.id} value={ai.id} className="text-gray-200 bg-gray-900">{ai.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-2.5 md:top-3 text-amber-600 pointer-events-none" />
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 text-xs font-medium bg-[#1a1a1a] hover:bg-gray-800 text-gray-300 rounded-md transition-colors flex items-center space-x-1 border border-gray-700">
                  <Save size={14} className="text-amber-500" /> <span className="hidden sm:inline">Save Session</span>
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.map((msg: any, idx: number) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex space-x-3 max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 shadow-md ${
                      msg.role === 'user' 
                        ? 'bg-amber-500 text-gray-950 font-bold' 
                        : msg.ai === 'system' ? 'bg-gray-700 text-white' : getAiTheme(msg.ai)
                    }`}>
                      {msg.role === 'user' ? <span className="text-xs">You</span> : msg.ai === 'master-skill' ? <Layers size={16} /> : <Bot size={18} />}
                    </div>
                    
                    <div className={`flex flex-col space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-full overflow-hidden`}>
                      {/* Text Bubble */}
                      <div className={`p-4 rounded-xl shadow-sm overflow-x-auto ${
                        msg.role === 'user' 
                          ? 'bg-[#1a1a1a] border border-gray-800 text-gray-200 rounded-tr-none' 
                          : msg.ai === 'master-skill' 
                            ? 'bg-gradient-to-b from-[#161616] to-[#0a0a0a] border border-amber-500/30 text-gray-200 rounded-tl-none shadow-[0_4px_20px_rgba(251,191,36,0.05)]'
                            : 'bg-[#161616] border border-gray-800 text-gray-300 rounded-tl-none'
                      }`}>
                        <div className="whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base markdown-body">{msg.content}</div>
                        {msg.role === 'ai' && msg.ai !== 'system' && (
                          <div className="mt-4 pt-3 border-t border-gray-800/50 text-xs text-amber-600/70 flex items-center space-x-2 font-medium">
                            {msg.ai === 'master-skill' ? <Sparkles size={12} className="text-amber-500" /> : <Cpu size={12} />}
                            <span>{msg.ai === 'master-skill' ? '3-Layer Pipeline Complete' : `Processed by ${msg.variant || availableAIs.find(a => a.id === msg.ai)?.name || msg.ai.toUpperCase()}`}</span>
                          </div>
                        )}
                      </div>

                      {/* Mock Rendered Media Attachments */}
                      {msg.media && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-2">
                          {msg.media?.map((m: any, i: number) => (
                            <div key={i} className="flex items-start p-3 bg-[#111111] border border-amber-500/20 rounded-lg shadow-md cursor-pointer hover:bg-[#161616] transition-colors">
                              <div className="p-2 bg-amber-500/10 rounded-md mr-3 flex-shrink-0">
                                {m.type === 'slides' ? <Presentation className="text-amber-500" size={20} /> :
                                 m.type === 'video' ? <Video className="text-amber-500" size={20} /> :
                                 <Headphones className="text-amber-500" size={20} />}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-gray-200">{m.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{m.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* ACTIVE PIPELINE LOADER */}
              {pipelineState.active && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-[95%] md:max-w-[85%] w-full">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 text-gray-950 flex items-center justify-center mt-1 shadow-lg animate-pulse flex-shrink-0">
                      <Layers size={18} />
                    </div>
                    <div className="p-4 md:p-5 rounded-xl bg-[#161616] border border-amber-500/50 rounded-tl-none shadow-[0_0_15px_rgba(251,191,36,0.1)] w-full">
                      <h4 className="text-amber-500 text-sm font-bold mb-4 flex items-center uppercase tracking-widest">
                        <Sparkles size={14} className="mr-2" />
                        Executing 3-Layer Pipeline
                      </h4>
                      <div className="space-y-3">
                        <PipelineStep number={1} name={`${claudeVariant} Analysis`} active={pipelineState.step === 1} completed={pipelineState.step > 1} />
                        <PipelineStep number={2} name={`${geminiVariant} Deep Thinking`} active={pipelineState.step === 2} completed={pipelineState.step > 2} />
                        <PipelineStep number={3} name={`NotebookLM (${notebookVariant}) Synthesis`} active={pipelineState.step === 3} completed={pipelineState.step > 3} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isLoading && !pipelineState.active && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-[75%]">
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 text-amber-500 flex items-center justify-center mt-1">
                      <Bot size={18} />
                    </div>
                    <div className="p-4 rounded-xl bg-[#161616] border border-gray-800 rounded-tl-none flex space-x-2 items-center">
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-6 bg-[#0a0a0a] border-t border-gray-800 flex flex-col space-y-3 relative z-20">
              
              {/* DYNAMIC NATIVE FEATURES RENDERER */}
              {renderDynamicToolbar()}

              {/* Smart Reply Chips */}
              {smartReplies.length > 0 && (
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-4xl mx-auto w-full scrollbar-hide px-1">
                  <Lightbulb size={16} className="text-amber-400 flex-shrink-0 mr-1 animate-pulse" />
                  {smartReplies.map((reply, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setInput(reply); handleSendMessage(); setSmartReplies([]); }}
                      className="whitespace-nowrap px-4 py-1.5 bg-[#1a1a1a] border border-gray-700 hover:border-amber-500/50 hover:text-amber-400 rounded-full text-xs text-gray-400 transition-colors shadow-sm"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              <div className="max-w-4xl w-full mx-auto relative flex items-end bg-[#111111] rounded-xl border border-gray-700 shadow-xl focus-within:ring-1 focus-within:ring-amber-500 overflow-hidden transition-all">
                {/* Hidden File Input tied to the Plus Icon */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  multiple 
                  accept="*/*"
                />
                <button 
                  className="p-3 text-gray-500 hover:text-amber-400 transition-colors flex-shrink-0 relative" 
                  title="Upload Files (They will be read by the AI)"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus size={20} />
                  {skillsFiles.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_5px_rgba(251,191,36,0.8)]"></span>
                  )}
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message...`}
                  className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none py-3 px-1 text-gray-200 resize-none focus:outline-none focus:ring-0 text-sm md:text-base placeholder-gray-600"
                  rows={1}
                />
                <div className="flex flex-shrink-0 items-center">
                  <button
                    onClick={handleEnhancePrompt}
                    disabled={!input.trim() || isEnhancing || isLoading}
                    title="✨ Enhance Prompt"
                    className="p-2 md:p-3 m-1 text-amber-500 bg-gray-800/50 rounded-lg hover:bg-gray-800 hover:text-amber-400 disabled:opacity-30 transition-colors"
                  >
                    {isEnhancing ? <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div> : <Sparkles size={18} />}
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className={`p-2 md:p-3 m-1 mr-2 rounded-lg disabled:opacity-50 transition-colors font-bold shadow-lg bg-amber-500 text-gray-950 hover:bg-amber-400 flex-shrink-0`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* VIEW: SKILLS & FILES */}
        {activeTab === 'skills' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-20 md:pt-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2 text-gray-100">
                <BookOpen className="text-amber-500" />
                <span>AI Skills & Knowledge Base</span>
              </h2>
              <p className="text-gray-400 mb-8 text-sm md:text-base">Upload ANY file here. Text, Code, CSV, and JSON are read directly by the AI via FileReader. Binary files (PDFs/Images) will be catalogued.</p>
              
              {/* Drag and Drop Zone */}
              <div 
                className="border-2 border-dashed border-gray-700 bg-[#111111] rounded-xl p-6 md:p-10 flex flex-col items-center justify-center text-center hover:bg-[#161616] hover:border-amber-500/50 transition-colors cursor-pointer group mb-8"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1a1a1a] border border-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:border-amber-500/30">
                  <Upload size={24} className="text-gray-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <p className="font-medium text-base md:text-lg mb-1 text-gray-200">Drag and drop your files here</p>
                <p className="text-xs md:text-sm text-gray-500">Supports all types. Texts parsed instantly.</p>
                <button className="mt-4 md:mt-6 px-4 py-2 bg-amber-500 text-gray-950 hover:bg-amber-400 rounded-lg font-bold transition-colors shadow-lg text-sm md:text-base pointer-events-none">
                  Browse Files
                </button>
              </div>

              <h3 className="text-lg font-semibold mb-4 border-b border-gray-800 pb-2 text-gray-200">Active Skills Files ({skillsFiles.length})</h3>
              <div className="space-y-3">
                {skillsFiles.length === 0 && (
                  <div className="text-center p-6 text-gray-600 text-sm">No files uploaded yet.</div>
                )}
                {skillsFiles.map(file => (
                  <div key={file.id} className="flex flex-col p-4 bg-[#111111] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <FileText className="text-amber-600 flex-shrink-0" size={20} />
                        <div className="truncate">
                          <p className="font-medium text-gray-200 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.size} • Uploaded {file.date} 
                            <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${(file.content as string).includes('[Binary') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                              {(file.content as string).includes('[Binary') ? 'Binary' : 'Text Parsed'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0 pl-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleSummarizeFile(file.id, file.name); }}
                          disabled={summarizingFileId === file.id || (file.content as string).includes('[Binary')}
                          className="p-2 text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-md transition-colors disabled:opacity-30"
                          title="✨ AI Summary (Requires Parsed Text)"
                        >
                          {summarizingFileId === file.id ? (
                            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Sparkles size={18} />
                          )}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {fileSummaries[file.id] && (
                      <div className="mt-3 p-3 bg-[#1a1a1a] border-l-2 border-amber-500 rounded-r-md text-sm text-gray-300">
                        <p className="flex items-start space-x-2">
                          <Sparkles size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                          <span>{fileSummaries[file.id as keyof typeof fileSummaries]}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-800 pt-8 pb-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                  <h3 className="text-lg font-semibold flex items-center space-x-2 text-gray-200">
                    <Sparkles className="text-amber-500" size={20} />
                    <span>AI Knowledge Synthesis</span>
                  </h3>
                  <button 
                    onClick={handleGeneratePlan}
                    disabled={isGeneratingPlan || skillsFiles.length === 0}
                    className="px-4 py-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 w-full sm:w-auto"
                  >
                    {isGeneratingPlan ? (
                      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles size={16} />
                    )}
                    <span>✨ Generate Master Plan</span>
                  </button>
                </div>
                
                {studyPlan && (
                  <div className="p-4 md:p-5 bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-amber-500/20 rounded-xl shadow-inner">
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {studyPlan}
                    </div>
                  </div>
                )}
                {!studyPlan && !isGeneratingPlan && (
                  <div className="text-center p-6 bg-[#111111] rounded-xl border border-gray-800 text-gray-500 text-sm">
                    Upload documents, then click Generate to let the AI process your complete Knowledge Base.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: HISTORY */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-20 md:pt-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2 text-gray-100">
                <Database className="text-amber-500" />
                <span>Session Repository</span>
              </h2>
              <p className="text-gray-400 mb-8 text-sm md:text-base">All your conversations, ideas, and executions sync directly to your connected Supabase database.</p>
              
              <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden shadow-lg overflow-x-auto">
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 bg-[#0a0a0a] text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <div className="col-span-6 md:col-span-7">Session Title</div>
                    <div className="col-span-3 md:col-span-3">AI Model</div>
                    <div className="col-span-3 md:col-span-2">Date</div>
                  </div>
                  {history.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 hover:bg-[#161616] cursor-pointer transition-colors items-center">
                      <div className="col-span-6 md:col-span-7 font-medium text-gray-300 text-sm md:text-base truncate">{item.title}</div>
                      <div className="col-span-3 md:col-span-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-amber-500 border border-gray-700 truncate max-w-full">
                          {item.ai}
                        </span>
                      </div>
                      <div className="col-span-3 md:col-span-2 text-xs md:text-sm text-gray-500">{item.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS */}
        {activeTab === 'settings' && (
           <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-20 md:pt-10">
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-100">Integrations & Secure APIs</h2>
                <p className="text-gray-400 text-sm md:text-base">Configure your external connectors for Manus orchestration. Keys are maintained locally before backend transit.</p>
              </div>

              {/* INTEGRATION CONFIGURATION BLOCK */}
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-5 md:p-6 mb-10 shadow-lg">
                <div className="flex items-center space-x-3 mb-6 border-b border-gray-800 pb-4">
                  <h3 className="text-lg md:text-xl font-bold text-gray-200">Connectors Configuration</h3>
                </div>
                
                <div className="space-y-6">
                  {/* GitHub Config */}
                  <div className="flex items-start space-x-4">
                    <Github className="text-gray-500 mt-1" size={20} />
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">GitHub Personal Access Token</label>
                      <input 
                        type="password" 
                        value={integrations.githubToken}
                        onChange={(e) => setIntegrations({...integrations, githubToken: e.target.value})}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                        className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-amber-500 focus:outline-none transition-colors" 
                      />
                    </div>
                  </div>

                  {/* Vercel Config */}
                  <div className="flex items-start space-x-4">
                    <Triangle className="text-gray-500 mt-1" size={20} />
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Vercel API Token</label>
                      <input 
                        type="password" 
                        value={integrations.vercelToken}
                        onChange={(e) => setIntegrations({...integrations, vercelToken: e.target.value})}
                        placeholder="xxxxx_xxxxxxxxxxxxxxxxxxxx" 
                        className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-amber-500 focus:outline-none transition-colors" 
                      />
                    </div>
                  </div>

                  {/* Supabase Config */}
                  <div className="flex items-start space-x-4 pt-4 border-t border-gray-800/50">
                    <Database className="text-gray-500 mt-1" size={20} />
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Supabase Project URL</label>
                        <input 
                          type="text" 
                          value={integrations.supabaseUrl}
                          onChange={(e) => setIntegrations({...integrations, supabaseUrl: e.target.value})}
                          placeholder="https://your-project.supabase.co" 
                          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-amber-500 focus:outline-none transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Supabase Service Role Key</label>
                        <input 
                          type="password" 
                          value={integrations.supabaseKey}
                          onChange={(e) => setIntegrations({...integrations, supabaseKey: e.target.value})}
                          placeholder="eyJh..." 
                          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-amber-500 focus:outline-none transition-colors" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-gray-800">
                    <span className={`text-sm font-medium transition-opacity duration-300 flex items-center ${configSaved ? 'text-green-500 opacity-100' : 'opacity-0'}`}>
                      <Check size={16} className="mr-1" /> State Secured Locally
                    </span>
                    <button 
                      onClick={handleSaveIntegrations}
                      className="px-6 py-2 bg-amber-500 text-gray-950 hover:bg-amber-400 rounded-lg font-bold transition-colors shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>

              {/* AI MODEL CONFIGURATION */}
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-5 md:p-6 mb-10 shadow-lg">
                <div className="flex items-center space-x-3 mb-6 border-b border-gray-800 pb-4">
                  <Cpu className="text-amber-500" size={24} />
                  <h3 className="text-lg md:text-xl font-bold text-gray-200">Premium AI Keys</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  {availableAIs.filter(ai => ai.id !== 'master-skill').map(ai => (
                    <div key={ai.id}>
                      <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{ai.name} API Key</label>
                      <input 
                        type="password" 
                        value={aiApiKeys[ai.id] || ''}
                        onChange={(e) => setAiApiKeys({...aiApiKeys, [ai.id]: e.target.value})}
                        placeholder="Enter your API key here..." 
                        className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-amber-500 focus:outline-none transition-colors" 
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-800 pt-6 mb-6 flex items-center justify-between">
                  <span className={`text-sm font-medium transition-opacity duration-300 flex items-center ${aiKeysSaved ? 'text-green-500 opacity-100' : 'opacity-0'}`}>
                    <Check size={16} className="mr-1" /> API Keys Saved
                  </span>
                  <button 
                    onClick={handleSaveAiKeys}
                    className="px-6 py-2 bg-amber-500 text-gray-950 hover:bg-amber-400 rounded-lg font-bold transition-colors shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                  >
                    Save API Keys
                  </button>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h4 className="text-sm font-bold text-gray-300 mb-3 flex items-center">
                    <PlusCircle size={16} className="mr-2 text-amber-500" /> Add Custom AI Model
                  </h4>
                  <form onSubmit={handleAddCustomAI} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <input 
                      type="text" 
                      value={newAiName}
                      onChange={(e) => setNewAiName(e.target.value)}
                      placeholder="e.g. Llama 3 70B..." 
                      className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300 focus:border-amber-500 focus:outline-none" 
                    />
                    <button type="submit" disabled={!newAiName.trim()} className="w-full sm:w-auto px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-semibold border border-gray-700 disabled:opacity-50 transition-colors">
                      Add Provider
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components
function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all font-semibold ${
        active ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200 border border-transparent'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function PipelineStep({ number, name, active, completed }: { number: number; name: string; active: boolean; completed: boolean }) {
  return (
    <div className={`flex items-center space-x-3 transition-all duration-300 ${active ? 'scale-105' : 'scale-100'} ${completed || active ? 'opacity-100' : 'opacity-40'}`}>
      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] font-bold border flex-shrink-0 ${
        completed ? 'bg-green-500/20 border-green-500 text-green-500' : 
        active ? 'bg-amber-500/20 border-amber-500 text-amber-500 animate-pulse' : 
        'bg-[#1a1a1a] border-gray-700 text-gray-500'
      }`}>
        {completed ? <CheckCircle2 size={14} /> : active ? <CircleDashed size={14} className="animate-spin" /> : number}
      </div>
      <span className={`text-xs md:text-sm font-medium ${completed ? 'text-gray-300' : active ? 'text-amber-500' : 'text-gray-500'}`}>
        {name} {active && '...'}
      </span>
    </div>
  );
}
// Triggering new deployment
