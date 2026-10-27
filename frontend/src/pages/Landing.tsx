import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Boxes,
  Bot,
  CheckCircle2,
  Building2,
  BarChart3,
  AlertTriangle,
  FileCheck2,
  Menu,
  X,
  ChevronRight,
  Terminal,
  Check
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTabPrompt, setActiveTabPrompt] = useState(0);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const exampleQuestions = [
    {
      query: 'Which products are at risk?',
      agentResponse:
        'Found 2 critical stockouts: Orange Juice (JUC-001) has only 2.67 days runway, and Nitrile Gloves (PPE-202) has 3.0 days. Reorder threshold breached.',
      tool: 'get_low_stock_inventory()',
      toolResult: 'Retrieved 2 items <= safety buffer',
    },
    {
      query: 'Find suppliers for sugar',
      agentResponse:
        'Identified 2 contracted suppliers for White Sugar (SUG-001): XYZ Traders ($42.80/kg, 4-day lead, MOQ 100) and ABC Foods ($44.00/kg, 2-day lead, MOQ 50).',
      tool: 'get_product_suppliers(product_id=3)',
      toolResult: '2 vendor rate contracts returned',
    },
    {
      query: 'Which supplier has the shortest lead time?',
      agentResponse:
        'PQR Industrial Supplies leads with 2-day guaranteed dispatch (99.1% on-time SLA), followed by ABC Foods with 2-3 day refrigerated cold chain.',
      tool: 'get_supplier_performance()',
      toolResult: 'Benchmark complete: Avg 2.4 days',
    },
    {
      query: 'Create a purchase recommendation',
      agentResponse:
        'Drafted PO-2026-001 for 136L of Orange Juice from ABC Foods ($11,560.00). Queued in inbox for manager authorization before transmission.',
      tool: 'create_draft_order(supplier_id=1)',
      toolResult: 'PO #101 created with status PENDING_APPROVAL',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 scroll-smooth selection:bg-brand-500 selection:text-white">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs group-hover:bg-brand-700 transition-colors">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                SupplyChain<span className="text-brand-600">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block -mt-1">
                Enterprise SCM
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-slate-900 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-slate-900 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('ai-procurement')}
              className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              AI Procurement
            </button>
            <button
              onClick={() => scrollToSection('analytics')}
              className="hover:text-slate-900 transition-colors"
            >
              Analytics
            </button>
          </nav>

          {/* Desktop Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-brand-600"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-brand-600"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('ai-procurement')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-brand-600"
            >
              AI Procurement
            </button>
            <button
              onClick={() => scrollToSection('analytics')}
              className="block w-full text-left py-2 text-sm font-medium text-slate-700 hover:text-brand-600"
            >
              Analytics
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg"
              >
                Login
              </Link>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-primary w-full text-xs py-2.5 justify-center"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-brand-700 text-xs font-semibold mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Enterprise AI Procurement Platform</span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              <span className="text-slate-500 font-normal">FastAPI & Gemini Ready</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
              Smarter Procurement.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Better Supply Chains.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Monitor inventory, evaluate suppliers, automate procurement decisions and collaborate with an AI supply-chain agent.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="btn-primary text-sm py-3 px-6 font-semibold shadow-md w-full sm:w-auto"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary text-sm py-3 px-6 font-semibold w-full sm:w-auto bg-white shadow-xs"
              >
                <span>Explore Dashboard</span>
              </button>
            </div>
          </div>

          {/* Product Dashboard Preview Visual */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    SupplyChain AI / Command Center
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Agent Sentry Active
                  </span>
                </div>
              </div>

              {/* Mock Dashboard Surface */}
              <div className="p-5 sm:p-6 bg-slate-50/50 space-y-5">
                {/* 1. Inventory KPIs strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Active Stockout Risks
                    </span>
                    <span className="text-xl font-bold text-rose-600 mt-0.5 block">
                      2 Critical
                    </span>
                    <span className="text-[10px] text-slate-500">&lt; 3 days runway left</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Pending Approvals
                    </span>
                    <span className="text-xl font-bold text-amber-600 mt-0.5 block">
                      2 Orders
                    </span>
                    <span className="text-[10px] text-slate-500">$12,352.00 in queue</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Verified Suppliers
                    </span>
                    <span className="text-xl font-bold text-slate-800 mt-0.5 block">
                      4 Partners
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">97.0% on-time SLA</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Catalog SKUs
                    </span>
                    <span className="text-xl font-bold text-brand-700 mt-0.5 block">
                      8 Monitored
                    </span>
                    <span className="text-[10px] text-slate-500">100% telemetry sync</span>
                  </div>
                </div>

                {/* 2. Low Stock Warning & Procurement Recommendation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Critical Warning card */}
                  <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-rose-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Low Stock Alert
                      </span>
                      <span className="text-[11px] font-bold text-rose-700 font-mono">
                        2.67d Runway
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Cold-Pressed Orange Juice
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">SKU: JUC-001</p>
                    </div>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg space-y-1">
                      <div className="flex justify-between">
                        <span>Current Stock:</span>
                        <strong className="text-slate-900">32 Litres</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Burn Rate:</span>
                        <span className="text-slate-700">12 Litres/day</span>
                      </div>
                      <div className="flex justify-between text-rose-700 font-medium">
                        <span>Stock Depletion:</span>
                        <span>In ~64 Hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Procurement Recommendation & Supplier Info */}
                  <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-brand-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-600" />
                        <span className="text-xs font-bold uppercase text-brand-900">
                          AI Reorder Recommendation
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        96% Sourcing Match
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">
                          Recommended Supplier
                        </span>
                        <span className="font-bold text-slate-900 text-sm block mt-0.5">
                          ABC Foods Ltd.
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          2-day lead time • 98.2% on-time SLA
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">
                          Batch Optimization
                        </span>
                        <span className="font-bold text-slate-900 text-sm block mt-0.5">
                          136 Litres ($85.00/L)
                        </span>
                        <span className="text-brand-700 font-semibold text-[11px]">
                          Total: $11,560.00 (14-day buffer target)
                        </span>
                      </div>
                    </div>

                    {/* AI Activity & Human approval pill */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
                        <Terminal className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>Tool: get_product_suppliers(id=5)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Pending Human Approval
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate('/purchase-orders')}
                          className="btn-primary text-xs py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve PO</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust / Value Section */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="h-9 w-9 rounded-lg bg-blue-100 text-brand-700 flex items-center justify-center shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Real-Time Inventory Intelligence
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Dynamic burn-rate algorithms calculate exact days-to-stockout across every warehouse SKU.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Multi-Supplier Comparison
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Automatically benchmarks contracted price books, lead times, and MOQs before placing orders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  AI-Powered Procurement
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Generates precise replenishment orders targeting your exact operational safety buffer.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Human-Controlled Purchasing
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Strict governance keeps draft POs paused until authorized by designated managers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Enterprise Features
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Everything Your Supply Chain Needs to Operate Autonomously
            </p>
            <p className="mt-4 text-base text-slate-600">
              A comprehensive modular suite designed for wholesale, manufacturing, and distribution enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Inventory Monitoring */}
            <div className="sc-card p-6 sc-card-hover group">
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Inventory Monitoring
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Live stock levels, safety buffers, and burn rate telemetry that identify critical stockout risks days before inventory hits zero.
              </p>
            </div>

            {/* 2. Supplier Intelligence */}
            <div className="sc-card p-6 sc-card-hover group">
              <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Supplier Intelligence
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Track supplier on-time delivery rates, contracted unit pricing, fulfillment lead times, and payment terms in one unified vendor directory.
              </p>
            </div>

            {/* 3. Procurement Recommendations */}
            <div className="sc-card p-6 sc-card-hover group">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Procurement Recommendations
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Autonomous order sizing based on consumption velocity and supplier MOQs, delivering lowest-cost vendor matches instantly.
              </p>
            </div>

            {/* 4. Purchase Order Management */}
            <div className="sc-card p-6 sc-card-hover group">
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Purchase Order Management
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Complete order lifecycle tracking with human approval verification, electronic vendor dispatch, and receipt stock updates.
              </p>
            </div>

            {/* 5. AI Assistant */}
            <div className="sc-card p-6 sc-card-hover group">
              <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                AI Assistant
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Collaborate directly with an agentic assistant equipped with real database function calling to audit stockouts and draft reorders.
              </p>
            </div>

            {/* 6. Analytics & Forecasting */}
            <div className="sc-card p-6 sc-card-hover group">
              <div className="h-11 w-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Analytics & Forecasting
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Visual dashboards for monthly procurement spend, supplier performance benchmarks, and quantified cost-arbitrage savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Seamless Workflow
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              How SupplyChain AI Protects Your Operations
            </p>
            <p className="mt-4 text-base text-slate-600">
              A continuous four-stage closed loop ensuring critical stock never runs dry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 01 */}
            <div className="sc-card p-6 relative">
              <div className="text-3xl font-extrabold text-brand-600 font-mono mb-3">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Monitor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects to inventory telemetry to track on-hand balances, warehouse locations, and daily burn rates 24/7.
              </p>
            </div>

            {/* Step 02 */}
            <div className="sc-card p-6 relative">
              <div className="text-3xl font-extrabold text-brand-600 font-mono mb-3">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Analyze
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates days of runway and detects items breaching safety reorder levels before stockouts disrupt operations.
              </p>
            </div>

            {/* Step 03 */}
            <div className="sc-card p-6 relative">
              <div className="text-3xl font-extrabold text-brand-600 font-mono mb-3">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Recommend
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates vendor pricing, lead times, and MOQs to draft the optimal reorder batch from the best supplier.
              </p>
            </div>

            {/* Step 04 */}
            <div className="sc-card p-6 relative">
              <div className="text-3xl font-extrabold text-brand-600 font-mono mb-3">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Approve
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Managers review order line items and authorize transmission with a single click, keeping human oversight intact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI Procurement Section */}
      <section id="ai-procurement" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Autonomous Intelligence
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Meet Your AI Procurement Agent
            </p>
            <p className="mt-4 text-base text-slate-600">
              Not a generic chatbot. A domain-specific agent that queries your real inventory databases and contracted vendor rates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Explanation & Example Questions */}
            <div className="lg:col-span-5 space-y-6">
              <div className="sc-card p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Agentic SCM Function Calling
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The SupplyChain AI Agent is powered by Google Gemini with verified tool interfaces. It directly retrieves live stock balances, calculates burn runway, benchmarks vendor quotes, and prepares draft orders.
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                    Click to test sample agent queries:
                  </span>
                  <div className="space-y-2">
                    {exampleQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTabPrompt(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                          activeTabPrompt === idx
                            ? 'bg-brand-50/80 border-brand-300 text-brand-800 shadow-2xs font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">"{q.query}"</span>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeTabPrompt === idx ? 'text-brand-600' : 'text-slate-400'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/ai-assistant')}
                    className="btn-primary text-xs py-2 px-4 w-full justify-center"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Open Live AI Procurement Copilot</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic AI Conversation Preview */}
            <div className="lg:col-span-7">
              <div className="sc-card rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                {/* Agent Header */}
                <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">SupplyChain AI Copilot</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Model: gemini-2.5-flash • Active Tools: 2
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Ready
                  </span>
                </div>

                {/* Conversation Body */}
                <div className="p-6 bg-slate-50/70 space-y-4">
                  {/* User query */}
                  <div className="flex justify-end">
                    <div className="bg-brand-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-xs max-w-md shadow-2xs font-medium">
                      {exampleQuestions[activeTabPrompt].query}
                    </div>
                  </div>

                  {/* Tool Execution Card */}
                  <div className="rounded-lg bg-slate-100 border border-slate-200/90 px-3.5 py-2 text-xs font-mono text-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <Terminal className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="font-semibold text-brand-700">
                        {exampleQuestions[activeTabPrompt].tool}
                      </span>
                      <span className="text-slate-400">&rarr;</span>
                      <span className="text-slate-600 text-[11px] font-sans truncate">
                        {exampleQuestions[activeTabPrompt].toolResult}
                      </span>
                    </div>
                    <span className="inline-flex items-center text-[10px] text-emerald-600 font-bold ml-2">
                      <Check className="w-3 h-3 mr-0.5" /> OK
                    </span>
                  </div>

                  {/* Agent Response */}
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-white border border-slate-200/90 p-4 text-xs text-slate-800 shadow-2xs leading-relaxed max-w-lg">
                      <p>{exampleQuestions[activeTabPrompt].agentResponse}</p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Human-in-the-loop protection armed
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate('/purchase-orders')}
                          className="text-[11px] font-semibold text-brand-600 hover:underline flex items-center gap-1"
                        >
                          View Action &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Metrics Section */}
      <section id="analytics" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Proven Performance
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Quantifiable Business Impact
            </p>
            <p className="mt-3 text-xs text-slate-400">
              *Illustrative enterprise benchmark metrics based on automated sourcing and stockout prevention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="sc-card p-8 bg-slate-50/50">
              <div className="text-5xl font-extrabold text-brand-600 font-mono tracking-tight">
                32%
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                Faster Procurement Decisions
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Automated quote benchmarking eliminates manual quote requests and spreadsheet comparisons.
              </p>
            </div>

            <div className="sc-card p-8 bg-slate-50/50">
              <div className="text-5xl font-extrabold text-emerald-600 font-mono tracking-tight">
                18%
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                Lower Procurement Overhead
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Contracted rate arbitrage and optimal batch sizing eliminate emergency expedited freight fees.
              </p>
            </div>

            <div className="sc-card p-8 bg-slate-50/50">
              <div className="text-5xl font-extrabold text-indigo-600 font-mono tracking-tight">
                24/7
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                Inventory Monitoring
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Autonomous agent sentry continuously scans stock depletion velocity to safeguard production lines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-10 sm:p-14 text-white shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Turn procurement data into smarter decisions.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Connect your inventory, evaluate suppliers, and eliminate stockouts with autonomous procurement intelligence.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white text-brand-700 hover:bg-blue-50 font-bold text-sm shadow-md transition-colors"
              >
                Start Using SupplyChain AI
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400 font-semibold text-sm transition-colors"
              >
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand column */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="text-base font-bold tracking-tight">SupplyChain AI</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Autonomous procurement and inventory intelligence for modern wholesale and manufacturing enterprises.
              </p>
              <div className="pt-2 text-xs text-slate-500">
                &copy; {new Date().getFullYear()} SupplyChain AI Inc. All rights reserved.
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/inventory" className="hover:text-white transition-colors">Inventory Monitoring</Link></li>
                <li><Link to="/suppliers" className="hover:text-white transition-colors">Supplier Intelligence</Link></li>
                <li><Link to="/procurement" className="hover:text-white transition-colors">Procurement AI</Link></li>
                <li><Link to="/purchase-orders" className="hover:text-white transition-colors">Purchase Orders</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Spend Analytics</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Company
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Capabilities</a></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Live Demo</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Customer Portal</Link></li>
              </ul>
            </div>

            {/* Resources & Legal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/settings" className="hover:text-white transition-colors">API Documentation</Link></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
                <li><span className="hover:text-white cursor-pointer transition-colors">Security & SOC2</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
