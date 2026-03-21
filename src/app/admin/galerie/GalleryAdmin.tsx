"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff, ImageIcon } from "lucide-react";
import { createGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/actions";
import ImageUpload from "@/components/admin/ImageUpload";

type Item = {
  id: string;
  src: string;
  alt: string;
  legend: string;
  tall: boolean;
  sortOrder: number;
  active: boolean;
};

const empty = { src: "", alt: "", legend: "", tall: false, sortOrder: 0 };

export default function GalleryAdmin({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function startEdit(item: Item) {
    setAdding(false);
    setEditing(item.id);
    setForm({ src: item.src, alt: item.alt, legend: item.legend, tall: item.tall, sortOrder: item.sortOrder });
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
      const data = { ...form, legend: form.legend || undefined };
      if (adding) await createGalleryImage(data);
      else if (editing) await updateGalleryImage(editing, data);
      cancel();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteGalleryImage(id);
      setConfirmDelete(null);
    });
  }

  function handleToggle(item: Item) {
    startTransition(() => updateGalleryImage(item.id, { active: !item.active }));
  }

  const showForm = adding || editing;

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-afro-dark">Galerie</h1>
          <p className="text-sm text-afro-dark/60">{items.length} image{items.length > 1 ? "s" : ""}</p>
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
            {adding ? "Nouvelle image" : "Modifier l'image"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <ImageUpload value={form.src} onChange={(url) => setForm({ ...form, src: url })} folder="galerie" label="Photo" placeholder="Uploader ou glisser une image" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Description (alt)</label>
              <input type="text" value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" placeholder="Description de l'image" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Légende (optionnel)</label>
              <input type="text" value={form.legend} onChange={(e) => setForm({ ...form, legend: e.target.value })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" placeholder="Ex : Atelier coiffure — BarreF 2024" />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex min-h-[44px] cursor-pointer items-center gap-2">
                <input type="checkbox" checked={form.tall} onChange={(e) => setForm({ ...form, tall: e.target.checked })} className="h-4 w-4 rounded border-afro-dark/20 text-afro-orange focus:ring-afro-orange/30" />
                <span className="text-sm text-afro-dark/70">Image haute (portrait)</span>
              </label>
            </div>
            <div className="w-32">
              <label className="mb-1 block text-sm font-medium text-afro-dark/70">Ordre</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={handleSave} disabled={pending || !form.src || !form.alt} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-afro-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-afro-orange/90 disabled:opacity-50">
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
          <ImageIcon className="mx-auto mb-3 h-12 w-12 text-afro-dark/20" />
          <p className="text-sm text-afro-dark/40">Aucune image dans la galerie</p>
          <button onClick={startAdd} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-afro-orange hover:underline">
            <Plus className="h-4 w-4" />
            Ajouter la première
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className={`group relative overflow-hidden rounded-xl bg-white shadow-sm ${!item.active ? "opacity-60" : ""}`}>
              <div className="relative aspect-square">
                <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                {item.tall && (
                  <span className="absolute left-2 top-2 rounded bg-afro-dark/60 px-1.5 py-0.5 text-[10px] font-medium text-white">Portrait</span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-afro-dark">{item.legend || item.alt}</p>
                <div className="mt-2 flex items-center gap-1">
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
    </>
  );
}
