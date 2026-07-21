import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowRight, Droplets, Loader, Calculator } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import MlzeniKalkulator from '@/components/poradce/MlzeniKalkulator';
import { setSEO } from '@/lib/seo';

const SUGGESTED_QUESTIONS = [
  'Hledám ochlazení pro veřejný park',
  'Chci mlžnou instalaci na soukromou zahradu',
  'Potřebuji systém pro dětské hřiště',
  'Plánuji event s mlžným prvkem',
  'Hledám řešení pro průmyslový prostor',
];

const DROPDOWN_OPTIONS = [
  { label: 'Brána GATE', value: 'Brána GATE' },
  { label: 'Brána LINEA CE', value: 'Brána LINEA CE' },
  { label: 'Mlžítko MRAK', value: 'Mlžítko MRAK' },
  { label: 'Mlžný strom OŠTĚV', value: 'Mlžný strom OŠTĚV' },
  { label: 'Mlžítko AURA', value: 'Mlžítko AURA' },
  { label: 'Mlžítko Y-ARMIST J70', value: 'Mlžítko Y-ARMIST J70' },
  { label: 'Mlžítko BENDY 60', value: 'Mlžítko BENDY 60' },
  { label: 'Mlžítko LÍZÁTKO', value: 'Mlžítko LÍZÁTKO' },
  { label: '🛠️ Zakázková výroba mlžítka dle vašich požadavků', value: '🛠️ Zakázková výroba mlžítka dle vašich požadavků' },
];

export default function Poradce() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [sentDropdowns, setSentDropdowns] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setSEO({
      title: 'AI Mlžný poradce — Vyberte si ideální mlžný systém pro mlžítko - Mlžidla.cz',
      description: 'Popište svůj prostor, potřeby a náš AI poradce vám doporučí vhodný mlžítko neboli popište vaše požadavky mlžného systému. Zadáním vybraného mlžítka nebo požadavků k zakázkové výrobě okamžitě vytvoříme žádost o cenovou nabídku vašeho mlžítka.',
      canonicalPath: '/poradce',
    });
  }, []);

  const startConversation = async (firstMessage) => {
    setStarting(true);
    try {
      const conv = await base44.agents.createConversation({
        agent_name: 'produktovy_poradce',
        metadata: { name: 'Výběr mlžítka' },
      });
      setConversation(conv);
      base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages || []);
        setLoading(false);
      });
      setLoading(true);
      await base44.agents.addMessage(conv, { role: 'user', content: firstMessage });
    } finally {
      setStarting(false);
    }
  };

  const sendMessage = async (customText) => {
    const text = typeof customText === 'string' ? customText.trim() : input.trim();
    if (!text || loading) return;
    if (typeof customText !== 'string') setInput('');
    if (!conversation) {
      await startConversation(text);
      return;
    }
    setLoading(true);
    await base44.agents.addMessage(conversation, { role: 'user', content: text });
  };

  const handleSuggestion = (question) => {
    if (!starting && !loading) startConversation(question);
  };

  const handleDropdownSelect = async (messageIndex, value) => {
    if (!value || loading || starting || sentDropdowns[messageIndex]) return;
    setSentDropdowns((previous) => ({ ...previous, [messageIndex]: value }));
    await sendMessage(value);
  };

  const isAssistantTyping = loading && messages.length > 0 && messages[messages.length - 1]?.role === 'user';

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-5">
            <Droplets size={26} className="text-slate-700" />
          </div>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">AI Poradce</p>
          <h1 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-3">Najdeme ideální řešení pro vás</h1>
          <p className="text-slate-500 text-sm">Popište svůj prostor, potřeby - a náš poradce vám doporučí optimální mlžný systém pro vaše mlžítko.</p>
        </motion.div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>
          <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: '520px' }}>
            {messages.length === 0 && !starting && (
              <div className="h-full flex flex-col items-center justify-center gap-6 py-8">
                <p className="text-slate-400 text-sm text-center">Nevíte si rady s výběrem? Chcete zažádat o cenu a nabídku vhodného mlžítka?</p>
                <div className="flex flex-col gap-2 w-full max-w-sm">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button key={question} onClick={() => handleSuggestion(question)} className="text-left px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm hover:border-slate-300 hover:text-slate-900 transition-all">
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {starting && <div className="flex justify-center py-8"><Loader size={20} className="animate-spin text-slate-300" /></div>}

            {messages.map((message, index) => {
              const contentUpper = (message.content || '').toUpperCase();
              const hasDropdownTrigger = contentUpper.includes('TRIGGER_DROPDOWN_COMPONENT') || contentUpper.includes('[TRIGGER_DROPDOWN') || contentUpper.includes('TRIGGER_DROPDOWN');
              const cleanedContent = (message.content || '')
                .replace(/\[?TRIGGER_DROPDOWN_COMPONENT\]?/gi, '')
                .replace(/\[?TRIGGER_DROPDOWN\]?/gi, '');
              const selectedValue = sentDropdowns[index];

              return (
                <div key={index} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                    {message.role !== 'user' && (
                      <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                        <Droplets size={13} className="text-slate-700" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.role === 'user' ? 'bg-slate-900 text-white font-medium' : 'bg-white border border-slate-200 text-slate-700'}`}>
                      {message.role === 'user' ? <p>{message.content}</p> : <ReactMarkdown className="prose prose-sm max-w-none">{cleanedContent}</ReactMarkdown>}
                    </div>
                  </div>

                  {message.role !== 'user' && hasDropdownTrigger && (
                    <div className="ml-9 w-full max-w-xs">
                      <select
                        value={selectedValue || ''}
                        onChange={(event) => handleDropdownSelect(index, event.target.value)}
                        disabled={loading || !!selectedValue}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm shadow-sm focus:border-slate-400 focus:outline-none disabled:opacity-60 transition-all cursor-pointer font-medium"
                      >
                        <option value="" disabled>{selectedValue ? `Zvoleno: ${selectedValue}` : 'Vyberte si produkt ze seznamu...'}</option>
                        {!selectedValue && DROPDOWN_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}

            {isAssistantTyping && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0"><Droplets size={13} className="text-slate-700" /></div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 p-4 flex gap-3">
            <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && !event.shiftKey && sendMessage()} placeholder="Popište váš prostor nebo potřeby..." disabled={loading || starting} className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none disabled:opacity-50" />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading || starting} className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-40 transition-all flex-shrink-0">
              {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>


        <div className="mt-6 text-center">
          <p className="text-slate-400 text-xs mb-3">Jste připraveni na nezávaznou poptávku?</p>
          <Link to="/kontakt" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-900 text-sm border border-slate-200 rounded-full hover:bg-slate-100 hover:border-slate-300 transition-all">
            Kontaktovat Mlžidla.cz <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}