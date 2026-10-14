import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Languages,
  CheckCircle2,
  FileText,
  RotateCw,
} from 'lucide-react';
import { CopilotMessage, PipelineStats, Settlement } from '../types/setu.ts';

interface CopilotPanelProps {
  stats: PipelineStats;
  settlements: Settlement[];
  onOpenSitrep: () => void;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  stats,
  settlements,
  onOpenSitrep,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        'SETU Copilot active. Grounded exclusively on Sentinel-1 SAR change layers, Copernicus DEM elevation profiles, and OpenStreetMap pre-event road topology. Ask tactical questions or request bilingual briefs.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    {
      label: 'Which bridges cut off Timure & Rasuwagadhi?',
      prompt: 'Which specific bridges were severed that cut off Timure and Rasuwagadhi?',
      lang: 'en' as const,
    },
    {
      label: 'नेपालीमा सम्पर्कविहीन बस्ती विवरण (Isolated Villages in Nepali)',
      prompt: 'भोटेकोशी करिडोरमा कुन कुन बस्तीहरू सम्पर्कविहीन छन् र कति नागरिक अलपत्र परेका छन्?',
      lang: 'ne' as const,
    },
    {
      label: 'Total flooded & debris area (km²)',
      prompt: 'What is the breakdown of flooded water area versus debris flow area in square kilometers?',
      lang: 'en' as const,
    },
    {
      label: 'Hospital access from Syaphrubesi',
      prompt: 'Can patients from Syaphrubesi reach Dhunche District Hospital by road?',
      lang: 'en' as const,
    },
  ];

  const handleSend = async (userPrompt: string = input, chosenLang: 'en' | 'ne' = language) => {
    if (!userPrompt.trim() || loading) return;

    const userMessage: CopilotMessage = {
      id: String(Date.now()),
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/copilot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          language: chosenLang,
        }),
      });

      if (!response.ok) {
        throw new Error('API server error');
      }

      const data = await response.json();

      const assistantMessage: CopilotMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditReport: data.auditReport,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: CopilotMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content:
          'Error connecting to SETU intelligence server. Please ensure the dev server is active and retry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FCFAF7] border-l border-[#E3E0DD] text-[#423D38]">
      {/* Header */}
      <div className="p-4 border-b border-[#E3E0DD] bg-[#F3F4F6] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FE6E00]" />
            <h2 className="text-sm font-bold text-[#423D38] tracking-tight">
              Bilingual Situation-Report Copilot
            </h2>
          </div>
          <p className="text-xs text-[#797067] mt-0.5">
            Strict numerical grounding · Zero invented statistics
          </p>
        </div>

        {/* Language Switch */}
        <div className="flex items-center gap-1 p-0.5 bg-[#EDEBE9] border border-[#E3E0DD] rounded-lg">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
              language === 'en'
                ? 'bg-[#FE6E00] text-white shadow-sm'
                : 'text-[#797067] hover:text-[#423D38]'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ne')}
            className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
              language === 'ne'
                ? 'bg-[#FE6E00] text-white shadow-sm'
                : 'text-[#797067] hover:text-[#423D38]'
            }`}
          >
            नेपाली
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#FE6E00]/15 border border-[#FE6E00]/30 text-[#423D38] font-medium'
                    : 'bg-white border border-[#E3E0DD] text-[#423D38] shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Strict Numerical Validator Audit Tag (Only on Assistant) */}
                {m.auditReport && (
                  <div className="mt-2.5 pt-2 border-t border-[#E3E0DD] text-[11px]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#016630]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00C758]" />
                      <span>
                        Numerical AST Audit:{' '}
                        {m.auditReport.passed ? 'Verified 100% Grounded' : 'Warning: Unverified'}
                      </span>
                    </div>

                    {m.auditReport.tokens.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {m.auditReport.tokens.map((tok, idx) => (
                          <span
                            key={idx}
                            className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                              tok.isVerified
                                ? 'bg-[#DCFCE7] border border-[#016630]/20 text-[#016630]'
                                : 'bg-[#FB2C36]/15 border border-[#FB2C36]/30 text-[#FB2C36]'
                            }`}
                            title={tok.matchedField || 'Unverified number'}
                          >
                            {tok.token} → {tok.matchedField ? '✓ ' + tok.matchedField : '✗ Unverified'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#797067] mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#797067] p-3 bg-white rounded-xl border border-[#E3E0DD] shadow-sm">
            <RotateCw className="w-3.5 h-3.5 text-[#FE6E00] animate-spin" />
            <span>Consulting spatial layer facts & auditing numerical tokens...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Strip */}
      <div className="p-2 border-t border-[#E3E0DD] bg-[#F3F4F6] overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => {
              setLanguage(qp.lang);
              handleSend(qp.prompt, qp.lang);
            }}
            className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-[#EDEBE9] border border-[#E3E0DD] hover:border-[#FE6E00] text-[#423D38] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-[#E3E0DD] bg-[#F3F4F6] flex items-center gap-2">
        <input
          type="text"
          placeholder={
            language === 'ne'
              ? 'उद्धार टोलीका लागि प्रश्न सोध्नुहोस्...'
              : 'Ask a tactical rescue question...'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-white border border-[#E3E0DD] rounded-lg px-3 py-2 text-xs text-[#423D38] placeholder-[#797067] focus:outline-none focus:border-[#FE6E00] focus:ring-1 focus:ring-[#FE6E00]"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="px-3.5 py-2 bg-[#FE6E00] hover:bg-[#FF6B00] disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center shrink-0 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
