"use client";

import { useState, useTransition } from "react";
import { Save, Sparkles } from "lucide-react";
import { upsertSiteSettings } from "@/lib/actions";
import ImageUpload from "@/components/admin/ImageUpload";

type PartageData = {
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
};

const defaults: PartageData = {
  ogImage: "/images/illustration-partage-site.jpg",
  ogTitle: "Association Culture Afro | Éducation Capillaire à La Réunion",
  ogDescription:
    "Révélez la beauté de vos boucles naturelles. Éducation capillaire et loisirs créatifs afro à La Réunion.",
};

export default function PartageAdmin({
  initial,
}: {
  initial: PartageData | null;
}) {
  const [form, setForm] = useState<PartageData>(initial || defaults);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await upsertSiteSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  const inputClass =
    "min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30";

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-afro-dark">
          Image de partage
        </h1>
        <p className="text-sm text-afro-dark/60">
          Personnalisez l&apos;aperçu qui s&apos;affiche quand le lien du site
          est partagé (Facebook, WhatsApp, LinkedIn, etc.)
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-afro-dark/10 bg-white p-5 shadow-sm">
        {/* OG Image */}
        <ImageUpload
          value={form.ogImage}
          onChange={(url) => setForm({ ...form, ogImage: url })}
          folder="og"
          label="Image de partage (Open Graph)"
          placeholder="Uploader l'image affichée lors du partage"
        />
        <p className="text-xs text-afro-dark/40">
          Taille recommandée : 1200 × 630 px (format paysage)
        </p>

        {/* OG Title */}
        <div>
          <label className="mb-1 block text-sm font-medium text-afro-dark/70">
            Titre de partage
          </label>
          <input
            type="text"
            value={form.ogTitle}
            onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
            className={inputClass}
            placeholder="Association Culture Afro | Éducation Capillaire à La Réunion"
          />
        </div>

        {/* OG Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-afro-dark/70">
            Description de partage
          </label>
          <textarea
            value={form.ogDescription}
            onChange={(e) =>
              setForm({ ...form, ogDescription: e.target.value })
            }
            rows={3}
            className="w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 py-3 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
            placeholder="Description affichée lors du partage du lien"
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={pending}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-afro-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-afro-orange/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {pending ? "Enregistrement..." : "Enregistrer"}
          </button>
          {saved && (
            <span className="text-sm font-medium text-green-600">
              Sauvegardé !
            </span>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-afro-dark/40">
          <Sparkles className="h-4 w-4" />
          Aperçu du partage
        </h2>
        <div className="mx-auto max-w-lg overflow-hidden rounded-xl border border-afro-dark/15 bg-white shadow-sm">
          {form.ogImage && (
            <div className="aspect-[1200/630] w-full bg-afro-dark/5">
              <img
                src={form.ogImage}
                alt="Aperçu OG"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-afro-dark/30">
              assocultureafro.fr
            </p>
            <p className="mt-1 text-sm font-semibold text-afro-dark">
              {form.ogTitle || "Titre du site"}
            </p>
            <p className="mt-0.5 text-xs text-afro-dark/50">
              {form.ogDescription || "Description du site"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
