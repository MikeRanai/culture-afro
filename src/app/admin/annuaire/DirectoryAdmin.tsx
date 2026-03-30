"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, BookOpen, ExternalLink } from "lucide-react";
import { createDirectoryEntry, updateDirectoryEntry, deleteDirectoryEntry } from "@/lib/actions";
import ImageUpload from "@/components/admin/ImageUpload";

type Item = {
  id: string;
  name: string;
  description: string;
  logo: string;
  url: string | null;
  category: string;
  sortOrder: number;
  active: boolean;
};

const categories = [
  { value: "salons", label: "Coiffeurs & Salons" },
  { value: "produits", label: "Produits & Soins" },
  { value: "partenaires_techniques", label: "Partenaires Techniques" },
];

const empty = { name: "", description: "", logo: "", url: "", category: "salons", sortOrder: 0 };

export default function DirectoryAdmin({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function startEdit(item: Item) {
    setAdding(false);
    setEditing(item.id);
    setForm({ name: item.name, description: item.description, logo: item.logo, url: item.url || "", category: item.category, sortOrder: item.sortOrder });
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
      const data = { ...form, url: form.url || undefined, description: form.description || undefined, logo: form.logo || undefined };
      if (adding) await createDirectoryEntry(data);
      else if (editing) await updateDirectoryEntry(editing, { ...data, url: form.url || null });
      cancel();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteDirectoryEntry(id);
      setConfirmDelete(null);
    });
  }

  function handleToggle(item: Item) {
    startTransition(() => updateDirectoryEntry(item.id, { active: !item.active }));
  }

  const showForm = adding || editing;

  const grouped = categories.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.category === cat.value),
  }));

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-afro-dark">Annuaire</h1>
          <p className="text-sm text-afro-dark/60">{items.length} entrée{items.length > 1 ? "s" : ""}</p>
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
            {adding ? "Nouvelle entrée" : "Modifier l'entrée"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Nom</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" placeholder="Nom du partenaire" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Catégorie</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30">
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Description courte (optionnel)</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" placeholder="Ex : Marque alliée du cheveu texturé" />
            </div>
            <div>
              <ImageUpload value={form.logo} onChange={(url) => setForm({ ...form, logo: url })} folder="logos" label="Logo" placeholder="Uploader ou glisser un logo" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Site web (optionnel)</label>
              <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" placeholder="https://..." />
            </div>
            <div className="w-32">
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Ordre</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleSave} disabled={pending || !form.name} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-afro-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-afro-orange/90 disabled:opacity-50">
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
          <BookOpen className="mx-auto mb-3 h-12 w-12 text-afro-dark/20" />
          <p className="text-sm text-afro-dark/40">Aucune entrée dans l&apos;annuaire</p>
          <button onClick={startAdd} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-afro-orange hover:underline">
            <Plus className="h-4 w-4" />
            Ajouter la première
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.value}>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-afro-dark/40">{group.label}</h2>
              {group.items.length === 0 ? (
                <p className="py-4 text-sm text-afro-dark/30">Aucune entrée dans cette catégorie</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {group.items.map((item) => (
                    <div key={item.id} className={`group rounded-2xl bg-white p-4 shadow-sm sm:p-5 ${!item.active ? "opacity-60" : ""}`}>
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-afro-dark/10 bg-white p-1">
                          {item.logo ? (
                            <img src={item.logo} alt={item.name} className="h-full w-full object-contain" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-afro-dark/5 text-xs font-bold text-afro-dark/30">
                              {item.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-afro-dark">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-afro-dark/50">{item.description}</p>
                          )}
                          {item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-afro-orange hover:underline">
                              Site web <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button onClick={() => handleToggle(item)} disabled={pending} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark/30 transition-colors hover:bg-afro-dark/5 hover:text-afro-dark/60" aria-label={item.active ? "Désactiver" : "Activer"}>
                            {item.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          <button onClick={() => startEdit(item)} className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark/30 transition-colors hover:bg-afro-orange/10 hover:text-afro-orange" aria-label="Modifier">
                            <Pencil className="h-4 w-4" />
                          </button>
                          {confirmDelete === item.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDelete(item.id)} disabled={pending} className="min-h-[44px] rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600">Oui</button>
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
            </div>
          ))}
        </div>
      )}
    </>
  );
}
