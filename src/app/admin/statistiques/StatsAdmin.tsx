"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, BarChart3 } from "lucide-react";
import { createStat, updateStat, deleteStat } from "@/lib/actions";

type Item = {
  id: string;
  value: string;
  label: string;
  icon: string;
  color: string;
  sortOrder: number;
  active: boolean;
};

const iconOptions = ["Users", "CalendarDays", "MapPin", "Award", "Heart", "Star", "TrendingUp", "Globe"];
const colorOptions = [
  { value: "orange", label: "Orange" },
  { value: "magenta", label: "Magenta" },
  { value: "amber", label: "Ambre (Africa)" },
  { value: "tangerine", label: "Tangerine (Africa)" },
  { value: "gold", label: "Or (Africa)" },
  { value: "navy", label: "Bleu Navy (Africa)" },
];

const empty = { value: "", label: "", icon: "Users", color: "orange", sortOrder: 0 };

export default function StatsAdmin({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function startEdit(item: Item) {
    setAdding(false);
    setEditing(item.id);
    setForm({ value: item.value, label: item.label, icon: item.icon, color: item.color, sortOrder: item.sortOrder });
  }

  function startAdd() {
    setEditing(null);
    setAdding(true);
    setForm({ ...empty, sortOrder: items.length });
  }

  function cancel() {
    setEditing(null);
    setAdding(false);
    setForm(empty);
  }

  function handleSave() {
    startTransition(async () => {
      if (adding) await createStat(form);
      else if (editing) await updateStat(editing, form);
      cancel();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteStat(id);
      setConfirmDelete(null);
    });
  }

  function handleToggle(item: Item) {
    startTransition(() => updateStat(item.id, { active: !item.active }));
  }

  const showForm = adding || editing;

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-afro-dark">Statistiques</h1>
          <p className="text-sm text-afro-dark/60">{items.length} statistique{items.length > 1 ? "s" : ""}</p>
        </div>
        {!showForm && (
          <button onClick={startAdd} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-afro-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-afro-orange/90">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-afro-dark/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-afro-dark/40">
            {adding ? "Nouvelle statistique" : "Modifier la statistique"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Valeur</label>
              <input type="text" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" placeholder="150+" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Libellé</label>
              <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" placeholder="Membres actifs" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Icône</label>
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30">
                {iconOptions.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Couleur</label>
              <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30">
                {colorOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="w-32">
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Ordre</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleSave} disabled={pending || !form.value || !form.label} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-afro-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-afro-orange/90 disabled:opacity-50">
              <Save className="h-4 w-4" />
              {pending ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button onClick={cancel} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-afro-dark/10 px-5 py-2.5 text-sm font-medium text-afro-dark/60 transition-colors hover:bg-afro-dark/5">
              <X className="h-4 w-4" />
              Annuler
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-afro-dark/10 py-16 text-center">
          <BarChart3 className="mx-auto mb-3 h-12 w-12 text-afro-dark/20" />
          <p className="text-sm text-afro-dark/40">Aucune statistique</p>
          <button onClick={startAdd} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-afro-orange hover:underline">
            <Plus className="h-4 w-4" />
            Ajouter la première
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className={`group rounded-2xl bg-white p-4 shadow-sm sm:p-5 ${!item.active ? "opacity-60" : ""}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  item.color === "magenta" ? "bg-afro-magenta/10 text-afro-magenta" :
                  item.color === "amber" ? "bg-afro-amber/10 text-afro-amber" :
                  item.color === "tangerine" ? "bg-afro-tangerine/10 text-afro-tangerine" :
                  item.color === "gold" ? "bg-afro-gold/10 text-afro-gold" :
                  item.color === "navy" ? "bg-afro-navy/10 text-afro-navy" :
                  "bg-afro-orange/10 text-afro-orange"
                }`}>
                  <span className="text-xs font-bold">{item.icon.slice(0, 3)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-afro-dark">{item.value}</p>
                  <p className="text-sm text-afro-dark/60">{item.label}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => handleToggle(item)} disabled={pending} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark/30 transition-colors hover:bg-afro-dark/5 hover:text-afro-dark/60" aria-label={item.active ? "Désactiver" : "Activer"}>
                    {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => startEdit(item)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark/30 transition-colors hover:bg-afro-orange/10 hover:text-afro-orange" aria-label="Modifier">
                    <Pencil className="h-4 w-4" />
                  </button>
                  {confirmDelete === item.id ? (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleDelete(item.id)} disabled={pending} className="min-h-[44px] rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600">Confirmer</button>
                      <button onClick={() => setConfirmDelete(null)} className="min-h-[44px] px-2 py-2 text-xs text-afro-dark/40 hover:text-afro-dark">Non</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(item.id)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark/30 transition-colors hover:bg-red-50 hover:text-red-500" aria-label="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
