import React, { useEffect, useMemo, useState } from 'react';
import {
  Loader, TrendingUp, TrendingDown, DollarSign, Target, Users, Activity as ActivityIcon,
  Phone, Mail, Calendar, FileText, CheckCircle, Clock, AlertCircle, ChevronRight,
  Search, Plus, Filter, Building2, ArrowUpRight, Award, Briefcase,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CrmKpiBar from '@/components/admin/crm/CrmKpiBar';
import CrmPipelineBoard from '@/components/admin/crm/CrmPipelineBoard';
import CrmClientDirectory from '@/components/admin/crm/CrmClientDirectory';
import CrmRevenueChart from '@/components/admin/crm/CrmRevenueChart';
import CrmActivityFeed from '@/components/admin/crm/CrmActivityFeed';

const money = (v) => new Intl.NumberFormat('cs-CZ').format(Number(v || 0));

export default function AdminCRM() {
  const [loading, setLoading] = useState(true);
  const [poptavky, setPoptavky] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [view, setView] = useState('overview');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [popt, cont, ord, pros, act] = await Promise.allSettled([
        base44.entities.Poptavka.list('-created_date', 200),
        base44.entities.ContactInquiry.list('-created_date', 200),
        base44.entities.ProjectOrder.list('-created_date', 200),
        base44.entities.LinkedInProspect.list('-created_date', 200),
        base44.entities.CrmActivity.list('-created_date', 200),
      ]);
      setPoptavky(popt.status === 'fulfilled' ? popt.value || [] : []);
      setContacts(cont.status === 'fulfilled' ? cont.value || [] : []);
      setOrders(ord.status === 'fulfilled' ? ord.value || [] : []);
      setProspects(pros.status === 'fulfilled' ? pros.value || [] : []);
      setActivities(act.status === 'fulfilled' ? act.value || [] : []);
      setLoading(false);
    };
    load();
  }, []);

  // Unified leads
  const allLeads = useMemo(() => {
    const leads = [
      ...poptavky.map((p) => ({
        id: p.id, source: 'poptavka', name: p.jmeno, email: p.email, phone: p.telefon,
        company: p.firma, product: p.produkt, message: p.zprava, status: p.status,
        offer_status: p.offer_status || 'nova_poptavka', created_date: p.created_date, total: 0,
      })),
      ...contacts.map((c) => ({
        id: c.id, source: 'contact', name: c.name, email: c.email, phone: '',
        company: '', product: '', message: c.message, status: c.status,
        offer_status: 'nova_poptavka', created_date: c.created_date, total: 0,
      })),
    ];
    return leads.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  }, [poptavky, contacts]);

  // Pipeline stage mapping
  const pipelineStages = useMemo(() => {
    const stages = {
      lead: { label: 'Lead', color: 'text-white/40 border-white/10 bg-white/5', deals: [], value: 0 },
      qualified: { label: 'Kvalifikováno', color: 'text-sky-400 border-sky-400/30 bg-sky-400/10', deals: [], value: 0 },
      proposal: { label: 'Nabídka odeslána', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10', deals: [], value: 0 },
      negotiation: { label: 'Vyjednávání', color: 'text-violet-400 border-violet-400/30 bg-violet-400/10', deals: [], value: 0 },
      won: { label: 'Vyhráno', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', deals: [], value: 0 },
      lost: { label: 'Ztraceno', color: 'text-red-400 border-red-400/30 bg-red-400/10', deals: [], value: 0 },
    };

    // Leads without offers → LEAD stage
    const ordersByInquiry = {};
    orders.forEach((o) => {
      if (o.inquiry_id) {
        if (!ordersByInquiry[o.inquiry_id]) ordersByInquiry[o.inquiry_id] = [];
        ordersByInquiry[o.inquiry_id].push(o);
      }
    });

    allLeads.forEach((lead) => {
      const linkedOrders = ordersByInquiry[lead.id] || [];
      if (linkedOrders.length === 0) {
        // No offer yet → LEAD or QUALIFIED based on offer_status
        if (lead.offer_status === 'koncept' || lead.offer_status === 'k_overeni') {
          stages.qualified.deals.push({ ...lead, type: 'lead' });
        } else {
          stages.lead.deals.push({ ...lead, type: 'lead' });
        }
      }
    });

    // Orders → pipeline stages
    orders.forEach((order) => {
      const deal = {
        id: order.id, source: 'order', name: order.client_name, email: order.client_email,
        phone: order.client_phone, company: order.client_company, product: order.product_name,
        quote_number: order.quote_number, total: Number(order.total_price) || 0,
        status: order.status, created_date: order.created_date, issued_at: order.issued_at,
        valid_until: order.valid_until, type: 'deal',
      };
      switch (order.status) {
        case 'draft':
        case 'pending_approval':
          stages.qualified.deals.push(deal);
          stages.qualified.value += deal.total;
          break;
        case 'sent':
        case 'viewed':
          stages.proposal.deals.push(deal);
          stages.proposal.value += deal.total;
          break;
        case 'extension_requested':
        case 'approved':
          stages.negotiation.deals.push(deal);
          stages.negotiation.value += deal.total;
          break;
        case 'in_production':
        case 'ready':
        case 'delivered':
          stages.won.deals.push(deal);
          stages.won.value += deal.total;
          break;
        case 'expired':
        case 'rejected':
          stages.lost.deals.push(deal);
          stages.lost.value += deal.total;
          break;
        default:
          stages.qualified.deals.push(deal);
          stages.qualified.value += deal.total;
      }
    });

    return stages;
  }, [allLeads, orders]);

  // KPIs
 const kpis = useMemo(() => {
    const pipelineValue = ['qualified', 'proposal', 'negotiation'].reduce(
      (sum, key) => sum + pipelineStages[key].value, 0
    );
    const wonValue = pipelineStages.won.value;
    const wonCount = pipelineStages.won.deals.length;
    const lostCount = pipelineStages.lost.deals.length;
    const activeDeals = ['qualified', 'proposal', 'negotiation'].reduce(
      (sum, key) => sum + pipelineStages[key].deals.length, 0
    );
    const totalClosed = wonCount + lostCount;
    const winRate = totalClosed > 0 ? Math.round((wonCount / totalClosed) * 100) : 0;
    const avgDeal = wonCount > 0 ? Math.round(wonValue / wonCount) : 0;
    const totalLeads = allLeads.length;
    const totalProspects = prospects.length;
    const openActivities = activities.filter((a) => a.status === 'planned' || a.status === 'overdue').length;

    return { pipelineValue, wonValue, wonCount, activeDeals, winRate, avgDeal, totalLeads, totalProspects, openActivities, lostCount };
  }, [pipelineStages, allLeads, prospects, activities]);

  // Unified clients (deduplicated by email)
  const clients = useMemo(() => {
    const map = {};
    const addClient = (email, name, phone, company, source, created_date) => {
      if (!email) return;
      const key = email.toLowerCase().trim();
      if (!map[key]) {
        map[key] = { email: key, name, phone, company, sources: [], firstSeen: created_date, lastSeen: created_date, orderCount: 0, totalValue: 0 };
      }
      if (name && !map[key].name) map[key].name = name;
      if (phone && !map[key].phone) map[key].phone = phone;
      if (company && !map[key].company) map[key].company = company;
      if (!map[key].sources.includes(source)) map[key].sources.push(source);
      if (created_date) {
        if (!map[key].firstSeen || new Date(created_date) < new Date(map[key].firstSeen)) map[key].firstSeen = created_date;
        if (!map[key].lastSeen || new Date(created_date) > new Date(map[key].lastSeen)) map[key].lastSeen = created_date;
      }
    };

    allLeads.forEach((l) => addClient(l.email, l.name, l.phone, l.company, l.source, l.created_date));
    orders.forEach((o) => {
      addClient(o.client_email, o.client_name, o.client_phone, o.client_company, 'order', o.created_date);
      const key = (o.client_email || '').toLowerCase().trim();
      if (key && map[key]) {
        map[key].orderCount++;
        map[key].totalValue += Number(o.total_price) || 0;
      }
    });
    prospects.forEach((p) => addClient(p.email, p.name, p.phone, p.organization, 'prospect', p.created_date));

    return Object.values(map).sort((a, b) => new Date(b.lastSeen || 0) - new Date(a.lastSeen || 0));
  }, [allLeads, orders, prospects]);

  if (loading) return <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-cyan/40" /></div>;

  const VIEWS = [
    { id: 'overview', label: 'Přehled', icon: ActivityIcon },
    { id: 'pipeline', label: 'Pipeline', icon: Target },
    { id: 'clients', label: 'Klienti', icon: Users },
    { id: 'activities', label: 'Aktivity', icon: Calendar },
  ];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-white text-xl font-heading font-medium flex items-center gap-2">
            <Briefcase size={20} className="text-cyan" /> CRM Corporate
          </h2>
          <p className="text-white/40 text-xs mt-1">Kompletní přehled prodejní pipeline, klientů a aktivit</p>
        </div>
        <div className="flex gap-2">
          {VIEWS.map((v) => {
            const Icon = v.icon;
            return (
              <button key={v.id} onClick={() => setView(v.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${view === v.id ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
                <Icon size={13} /> {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview */}
      {view === 'overview' && (
        <>
          <CrmKpiBar kpis={kpis} />
          <CrmRevenueChart orders={orders} />
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
            <CrmPipelineBoard stages={pipelineStages} compact />
            <CrmActivityFeed activities={activities} clients={clients} compact />
          </div>
        </>
      )}

      {/* Pipeline */}
      {view === 'pipeline' && <CrmPipelineBoard stages={pipelineStages} />}

      {/* Clients */}
      {view === 'clients' && <CrmClientDirectory clients={clients} activities={activities} orders={orders} />}

      {/* Activities */}
      {view === 'activities' && <CrmActivityFeed activities={activities} clients={clients} />}
    </div>
  );
}