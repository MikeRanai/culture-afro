"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/actions";

type Item = {
  id: string;
  name: string;
  quote: string;
  image: string;
  sortOrder: number;
  active: boolean;
};

const empty = { name: "", quote: "", image: "", sortOrder: 0 };

export default function TestimonialsAdmin({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function startEdit(item: Item) {
    setAdding(false);
    setEditing(item.id);
    setForm({
      name: item.name,
      quote: item.quote,
      image: item.image,
      sortOrder: item.sortOrder,
    });
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
      if (adding) {
        await createTestimonial(form);
      } else if (editing) {
        await updateTestimonial(editing, form);
      }
      cancel();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTestimonial(id);
      setConfirmDelete(null);
    });
  }

  function handleToggle(item: Item) {
    startTransition(async () => {
      await updateTestimonial(item.id, { active: !item.active });
    });
  }

  const showForm = adding || editing;

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-afro-dark">
            Témoignages
          </h1>
          <p className="text-sm text-afro-dark/60">
            {items.length} témoignage{items.length > 1 ? "s" : ""}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={startAdd}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-afro-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-afro-orange/90"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-afro-dark/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-afro-dark/40">
            {adding ? "Nouveau témoignage" : "Modifier le témoignage"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">
                Nom
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
                placeholder="Prénom du témoin"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">
                Image (URL)
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
                placeholder="/images/testimonial-x.jpg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">
                Citation
              </label>
              <textarea
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                rows={3}
                className="min-h-[44px] w-full resize-none rounded-xl border border-afro-dark/10 bg-afro-light px-4 py-3 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
                placeholder="Le témoignage..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">
                Ordre
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
                }
                className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={pending || !form.name || !form.quote}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-afro-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-afro-orange/90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {pending ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              onClick={cancel}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-afro-dark/10 px-5 py-2.5 text-sm font-medium text-afro-dark/60 transition-colors hover:bg-afro-dark/5"
            >
              <X className="h-4 w-4" />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-afro-dark/10 py-16 text-center">
          <MessageSquareQuoteIcon className="mx-auto mb-3 h-12 w-12 text-afro-dark/20" />
          <p className="text-sm text-afro-dark/40">Aucun témoignage</p>
          <button
            onClick={startAdd}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-afro-orange hover:underline"
          >
            <Plus className="h-4 w-4" />
            Ajouter le premier
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group rounded-2xl bg-white p-4 shadow-sm transition-all sm:p-5 ${
                !item.active ? "opacity-60" : ""
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                {/* Image preview */}
                {item.image && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-afro-dark/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-afro-dark">
                    {item.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-afro-dark/60">
                    {item.quote}
                  </p>
                </div>
                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleToggle(item)}
                    disabled={pending}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark/30 transition-colors hover:bg-afro-dark/5 hover:text-afro-dark/60"
                    aria-label={item.active ? "Désactiver" : "Activer"}
                    title={item.active ? "Désactiver" : "Activer"}
                  >
                    {item.active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark/30 transition-colors hover:bg-afro-orange/10 hover:text-afro-orange"
                    aria-label="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {confirmDelete === item.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={pending}
                        className="min-h-[44px] rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="min-h-[44px] px-2 py-2 text-xs text-afro-dark/40 hover:text-afro-dark"
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(item.id)}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark/30 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Supprimer"
                    >
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

function MessageSquareQuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
      />
    </svg>
  );
}
