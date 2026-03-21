"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  Scissors,
  Palette,
  Flower2,
  Drama,
  X,
  MapPin,
  Clock,
  Calendar,
  Leaf,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Données des activités                                              */
/* ------------------------------------------------------------------ */

const activities = [
  {
    title: "Ateliers Éducation Capillaire",
    description:
      "Développez votre autonomie grâce au coaching en confiance en soi capillaire. Apprenez à comprendre, entretenir et sublimer vos cheveux texturés (bouclés, frisés, ondulés, crépus).",
    image: "/images/education-hair.webp",
    alt: "Atelier d'éducation capillaire avec démonstration de soins pour cheveux texturés",
    accent: "from-afro-orange to-afro-orange/70",
    accentBg: "bg-afro-orange",
    badges: [
      { icon: Scissors, label: "Coupe & Soin" },
      { icon: Flower2, label: "Produits naturels" },
    ],
    modalContent: {
      intro:
        "Vous l'avez demandé, nous l'avons fait ! Un espace est désormais disponible pour les familles et les personnes souhaitant participer à nos ateliers capillaires en toute intimité.",
      objective:
        "Vous accompagner avec bienveillance pour mieux comprendre vos cheveux et apprendre à les entretenir en toute autonomie.",
      closing:
        "Ensemble, valorisons nos cheveux frisés, crépus et bouclés.",
      details: [
        { icon: MapPin, label: "BARREF – Château Morange, Camélias" },
        { icon: Clock, label: "Matin : 9h – 12h (sur inscription) · Après-midi : 14h – 18h (portes ouvertes)" },
        { icon: Calendar, label: "Chaque 1er samedi du mois" },
      ],
      note: "Matin sur inscription (places limitées) · Après-midi en accès libre.",
      extras: [
        "Ateliers 100% gratuits",
        "Coaching confiance en soi capillaire",
        "Produits capillaires, accessoires et matériel mis à disposition",
      ],
    },
  },
  {
    title: "Loisirs Créatifs Afro",
    description:
      "Explorez votre créativité à travers des activités inspirées de la culture afro : couture, peinture, fabrication de bijoux et bien plus encore.",
    image: "/images/loisir-creatif.webp",
    alt: "Atelier de loisirs créatifs avec fabrication de bijoux et accessoires afro",
    accent: "from-afro-magenta to-afro-magenta/70",
    accentBg: "bg-afro-magenta",
    badges: [
      { icon: Palette, label: "Arts créatifs" },
      { icon: Drama, label: "Masques & Bijoux" },
    ],
    modalContent: {
      intro:
        "Plongez dans un univers créatif inspiré de la culture afro ! Nos ateliers de loisirs créatifs sont des moments de partage, de détente et de reconnexion à nos racines culturelles.",
      objective:
        "Proposer un espace convivial où chacun·e peut explorer sa créativité tout en découvrant les arts et traditions de la culture afro.",
      closing:
        "S'entourer pour mieux s'accepter, créer ensemble et célébrer notre culture.",
      details: [
        { icon: Palette, label: "Couture, peinture, fabrication de bijoux et accessoires" },
        { icon: Drama, label: "Masques, tissage et créations inspirées de la culture afro" },
        { icon: Calendar, label: "Dates communiquées sur nos réseaux sociaux" },
      ],
      note: "Ouvert à toutes et tous, débutant·es bienvenu·es !",
      extras: [
        "Matériel fourni sur place",
        "Ambiance conviviale et bienveillante",
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */

type ModalContent = NonNullable<(typeof activities)[0]["modalContent"]>;

function ActivityModal({
  content,
  title,
  accentBg,
  onClose,
}: {
  content: ModalContent;
  title: string;
  accentBg: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl">
        {/* Barre d'accent */}
        <div
          aria-hidden="true"
          className={`h-1.5 w-full rounded-t-2xl ${accentBg}`}
        />

        {/* Bouton fermer */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full text-afro-dark/50 transition-colors hover:bg-afro-dark/5 hover:text-afro-dark"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Contenu */}
        <div className="p-6 pt-5 sm:p-8 sm:pt-6">
          <h3 className="mb-4 pr-8 font-serif text-xl font-bold text-afro-dark sm:text-2xl">
            {title}
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-afro-dark/80">
            {content.intro}
          </p>

          {/* Objectif */}
          <div className="mb-5 rounded-xl bg-afro-orange/5 p-4">
            <p className="text-sm font-semibold text-afro-orange">
              Notre objectif
            </p>
            <p className="mt-1 text-sm leading-relaxed text-afro-dark/80">
              {content.objective}
            </p>
          </div>

          {/* Détails pratiques */}
          <div className="mb-5 space-y-3">
            {content.details.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-afro-orange/10">
                  <detail.icon className="h-4 w-4 text-afro-orange" />
                </div>
                <p className="pt-1 text-sm text-afro-dark/80">
                  {detail.label}
                </p>
              </div>
            ))}
          </div>

          {/* Extras */}
          {content.extras && content.extras.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {content.extras.map((extra) => (
                <span
                  key={extra}
                  className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                >
                  <span aria-hidden="true">✓</span>
                  {extra}
                </span>
              ))}
            </div>
          )}

          {/* Note inscription */}
          <p className="mb-5 rounded-lg border border-afro-magenta/20 bg-afro-magenta/5 px-4 py-2.5 text-center text-sm font-medium text-afro-magenta">
            {content.note}
          </p>

          {/* Closing */}
          <p className="flex items-center justify-center gap-2 text-center text-sm font-medium text-afro-dark/70">
            <Leaf className="h-4 w-4 text-green-600" />
            {content.closing}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section principale                                                 */
/* ------------------------------------------------------------------ */

export default function ActivitiesSection() {
  const [openModal, setOpenModal] = useState<number | null>(null);

  return (
    <>
      <section
        id="ateliers"
        aria-labelledby="activities-title"
        className="relative z-10 py-16 md:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Titre de section */}
          <div className="mb-10 text-center md:mb-14">
            <span className="mb-3 inline-block rounded-full bg-afro-orange/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-orange">
              Ce que nous proposons
            </span>
            <h2
              id="activities-title"
              className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl"
            >
              Nos Activités
            </h2>
          </div>

          {/* Grille de cartes */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            {activities.map((activity, index) => (
              <article
                key={activity.title}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Barre d'accent en haut */}
                <div
                  aria-hidden="true"
                  className={`h-1 w-full bg-gradient-to-r ${activity.accent}`}
                />

                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden sm:h-44">
                  <Image
                    src={activity.image}
                    alt={activity.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay dégradé */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
                  />

                  {/* Pastilles icônes */}
                  <div className="absolute bottom-2.5 left-2.5 flex gap-1.5">
                    {activity.badges.map((badge) => (
                      <span
                        key={badge.label}
                        className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-afro-dark shadow-sm"
                      >
                        <badge.icon
                          className="h-3 w-3 text-afro-orange"
                          aria-hidden="true"
                        />
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <h3 className="mb-1.5 font-serif text-lg font-bold text-afro-dark">
                    {activity.title}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-afro-dark/65">
                    {activity.description}
                  </p>

                  <button
                    onClick={() =>
                      activity.modalContent ? setOpenModal(index) : null
                    }
                    className={`group/link inline-flex min-h-[44px] items-center gap-2 rounded-full ${activity.accentBg} px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md`}
                  >
                    En savoir plus
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {openModal !== null && activities[openModal].modalContent && (
        <ActivityModal
          content={activities[openModal].modalContent}
          title={activities[openModal].title}
          accentBg={activities[openModal].accentBg}
          onClose={() => setOpenModal(null)}
        />
      )}
    </>
  );
}
