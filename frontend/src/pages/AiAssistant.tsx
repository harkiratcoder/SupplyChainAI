import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';

export const AiAssistant: React.FC = () => {
  const navigate = useNavigate();
  const { chatMessages, sendChatMessage, clearChat, isAiTyping } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const samplePrompts = [
    {
      title: 'Analyze Stockout Risks',
      prompt: 'Which products are at critical stockout risk right now and what suppliers should we use to reorder?',
    },
    {
      title: 'Evaluate Supplier Rates',
      prompt: 'Compare our active supplier prices and lead times across all food and sanitation lines.',
    },
    {
      title: 'Pending PO Audit',
      prompt: 'Audit all purchase orders currently pending approval and summarize the required expenditures.',
    },
    {
      title: 'Packaging Restock Plan',
      prompt: 'Check stock levels for Corrugated Cartons and recommend a procurement order batch.',
    }
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-3">
      {/* Header */}
      <PageHeader
        title="AI Procurement Copilot"
        subtitle="Conversational agent with autonomous inventory telemetry and supplier database tool calling."
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Gemini 2.5 Agent Active
            </span>
            <button
              type="button"
              onClick={clearChat}
              className="btn-secondary text-xs py-1.5"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        }
      />

      {/* Main Chat Container */}
      <div className="sc-card flex-1 flex flex-col overflow-hidden">
        {/* Agent Info Sub-bar */}
        <div className="px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-brand-600 dark:text-blue-400" />
              <span className="font-mono text-slate-700 dark:text-slate-300">Tools:</span>
              <span className="font-mono text-[11px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                get_low_stock_inventory
              </span>
              <span className="font-mono text-[11px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                get_product_suppliers
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Human-in-the-loop Guardrails Armed</span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-slate-900 dark:bg-slate-700 text-white'
                      : 'bg-brand-600 text-white'
                  }`}
                >
                  {isUser ? 'JD' : <Bot className="w-4 h-4" />}
                </div>

                {/* Content Bubble */}
                <div className="flex-1 space-y-2">
                  <div className={`flex items-center gap-2 ${isUser ? 'justify-end' : ''}`}>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isUser ? 'You (Procurement Lead)' : 'SupplyChain AI Copilot'}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{msg.timestamp}</span>
                  </div>

                  {/* Tool Execution Cards */}
                  {msg.tools && msg.tools.length > 0 && (
                    <div className="space-y-1.5 my-2">
                      {msg.tools.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-lg bg-slate-100/90 dark:bg-slate-800/90 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono"
                        >
                          <Terminal className="w-3.5 h-3.5 text-brand-600 dark:text-blue-400 shrink-0" />
                          <span className="font-semibold text-brand-700 dark:text-blue-400">{t.tool_name}()</span>
                          <span className="text-slate-400 dark:text-slate-500">&rarr;</span>
                          <span className="text-slate-600 dark:text-slate-300 text-[11px] font-sans truncate">
                            {t.summary}
                          </span>
                          <span className="ml-auto inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3 h-3 mr-0.5" /> OK
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bubble text */}
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Action Recommendation Card */}
                  {msg.actionRecommendation && (
                    <div className="rounded-xl border border-brand-200 dark:border-blue-900/60 bg-brand-50/50 dark:bg-blue-950/40 p-3.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-blue-400" />
                          <span className="text-xs font-bold text-brand-900 dark:text-blue-300">
                            {msg.actionRecommendation.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          {msg.actionRecommendation.details}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (msg.actionRecommendation?.type === 'PO_APPROVAL') {
                            navigate('/purchase-orders');
                          } else {
                            navigate('/procurement');
                          }
                        }}
                        className="btn-primary text-xs py-1.5 px-3 shrink-0"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isAiTyping && (
            <div className="flex gap-3 max-w-xl">
              <div className="h-8 w-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-4 shadow-xs text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="flex space-x-1">
                  <span className="h-2 w-2 rounded-full bg-brand-400 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Calling inventory database tools & computing quote matrix...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/30">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0">Try asking:</span>
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendChatMessage(sp.prompt)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-brand-700 dark:hover:text-white transition-colors shadow-2xs font-medium"
              >
                {sp.title}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about inventory runways, supplier lead times, or draft purchase orders..."
            className="form-input flex-1 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAiTyping}
            className="btn-primary py-2 px-4 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
