"use client";

import { useState, useTransition } from "react";
import { Save, Sparkles } from "lucide-react";
import { upsertHeroBanner } from "@/lib/actions";
import ImageUpload from "@/components/admin/ImageUpload";

type HeroData = {
  image: string;
  subtitle: string;
  quote: string;
  ctaLabel1: string;
  ctaLink1: string;
  ctaLabel2: string;
  ctaLink2: string;
  decorWord: string;
};

const defaults: HeroData = {
  image: "",
  subtitle: "Association Culture Afro · La Réunion",
  quote:
    "Ensemble, célébrons la beauté des cheveux crépus, frisés et bouclés, comme un héritage vivant. Transmettons, avec fierté et douceur, l\u2019âme de notre identité capillaire au naturel.",
  ctaLabel1: "Consulter l\u2019annuaire",
  ctaLink1: "#annuaire",
  ctaLabel2: "Découvrir nos pôles",
  ctaLink2: "#poles",
  decorWord: "Héritage",
};

export default function HeroAdmin({ initial }: { initial: HeroData | null }) {
  const [form, setForm] = useState<HeroData>(initial || defaults);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await upsertHeroBanner(form);
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
          Hero Banner
        </h1>
        <p className="text-sm text-afro-dark/60">
          Personnalisez la bannière d&apos;accueil du site
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-afro-dark/10 bg-white p-5 shadow-sm">
        {/* Image */}
        <ImageUpload
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
          folder="hero"
          label="Image de fond"
          placeholder="Uploader l'image du hero"
        />

        {/* Subtitle */}
        <div>
          <label className="mb-1 block text-sm font-medium text-afro-dark/70">
            Sous-titre
          </label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className={inputClass}
            placeholder="Association Culture Afro · La Réunion"
          />
        </div>

        {/* Quote */}
        <div>
          <label className="mb-1 block text-sm font-medium text-afro-dark/70">
            Citation
          </label>
          <textarea
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            rows={4}
            className="w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 py-3 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
            placeholder="Citation affichée sur le hero"
          />
        </div>

        {/* CTA buttons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-afro-dark/70">
              Bouton principal — texte
            </label>
            <input
              type="text"
              value={form.ctaLabel1}
              onChange={(e) =>
                setForm({ ...form, ctaLabel1: e.target.value })
              }
              className={inputClass}
              placeholder="Consulter l'annuaire"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-afro-dark/70">
              Bouton principal — lien
            </label>
            <input
              type="text"
              value={form.ctaLink1}
              onChange={(e) =>
                setForm({ ...form, ctaLink1: e.target.value })
              }
              className={inputClass}
              placeholder="#annuaire"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-afro-dark/70">
              Bouton secondaire — texte
            </label>
            <input
              type="text"
              value={form.ctaLabel2}
              onChange={(e) =>
                setForm({ ...form, ctaLabel2: e.target.value })
              }
              className={inputClass}
              placeholder="Découvrir nos pôles"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-afro-dark/70">
              Bouton secondaire — lien
            </label>
            <input
              type="text"
              value={form.ctaLink2}
              onChange={(e) =>
                setForm({ ...form, ctaLink2: e.target.value })
              }
              className={inputClass}
              placeholder="#poles"
            />
          </div>
        </div>

        {/* Decorative word */}
        <div className="w-64">
          <label className="mb-1 block text-sm font-medium text-afro-dark/70">
            Mot décoratif
          </label>
          <input
            type="text"
            value={form.decorWord}
            onChange={(e) => setForm({ ...form, decorWord: e.target.value })}
            className={inputClass}
            placeholder="Héritage"
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
          Apercu
        </h2>
        <div className="relative h-64 overflow-hidden rounded-2xl bg-afro-dark">
          {form.image && (
            <img
              src={form.image}
              alt="Hero preview"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-afro-dark/70 via-afro-dark/30 to-afro-dark/20" />
          <div className="relative flex h-full flex-col justify-end p-6">
            {form.subtitle && (
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
                {form.subtitle}
              </p>
            )}
            {form.quote && (
              <p className="mt-3 max-w-lg font-serif text-sm italic text-white">
                &ldquo;{form.quote}&rdquo;
              </p>
            )}
            <div className="mt-3 flex gap-3">
              {form.ctaLabel1 && (
                <span className="border border-white/50 px-3 py-1 text-[10px] uppercase text-white">
                  {form.ctaLabel1}
                </span>
              )}
              {form.ctaLabel2 && (
                <span className="text-[10px] uppercase text-white/60 underline">
                  {form.ctaLabel2}
                </span>
              )}
            </div>
            {form.decorWord && (
              <span className="absolute bottom-4 right-6 font-handwriting text-3xl text-white/10">
                {form.decorWord}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
