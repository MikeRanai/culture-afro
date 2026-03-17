"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, HelpCircle } from "lucide-react";
import { createFaq, updateFaq, deleteFaq } from "@/lib/actions";

type Item = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active: boolean;
};

const empty = { question: "", answer: "", sortOrder: 0 };

export default function FaqAdmin({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function startEdit(item: Item) {
    setAdding(false);
    setEditing(item.id);
    setForm({ question: item.question, answer: item.answer, sortOrder: item.sortOrder });
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
      if (adding) await createFaq(form);
      else if (editing) await updateFaq(editing, form);
      cancel();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteFaq(id);
      setConfirmDelete(null);
    });
  }

  function handleToggle(item: Item) {
    startTransition(() => updateFaq(item.id, { active: !item.active }));
  }

  const showForm = adding || editing;

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-afro-dark">FAQ</h1>
          <p className="text-sm text-afro-dark/60">
            {items.length} question{items.length > 1 ? "s" : ""}
          </p>
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
            {adding ? "Nouvelle question" : "Modifier la question"}
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Question</label>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
                placeholder="La question..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Réponse</label>
              <textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                rows={4}
                className="min-h-[44px] w-full resize-none rounded-xl border border-afro-dark/10 bg-afro-light px-4 py-3 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
                placeholder="La réponse..."
              />
            </div>
            <div className="w-32">
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Ordre</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleSave} disabled={pending || !form.question || !form.answer} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-afro-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-afro-orange/90 disabled:opacity-50">
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
          <HelpCircle className="mx-auto mb-3 h-12 w-12 text-afro-dark/20" />
          <p className="text-sm text-afro-dark/40">Aucune question</p>
          <button onClick={startAdd} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-afro-orange hover:underline">
            <Plus className="h-4 w-4" />
            Ajouter la première
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className={`group rounded-2xl bg-white p-4 shadow-sm sm:p-5 ${!item.active ? "opacity-60" : ""}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-afro-dark">{item.question}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-afro-dark/60">{item.answer}</p>
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
