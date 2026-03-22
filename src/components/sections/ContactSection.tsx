"use client";

import { Mail, MapPin, Clock, Phone, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef, FormEvent } from "react";

type ContactInfoData = {
  id: string;
  type: string;
  title: string;
  value: string;
  href: string | null;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  email: Mail,
  location: MapPin,
  hours: Clock,
};

const fallbackInfos: ContactInfoData[] = [
  { id: "1", type: "phone", title: "Téléphone", value: "+262 692 25 90 07", href: "tel:+262692259007" },
  { id: "2", type: "email", title: "Email", value: "associationcultureafro@gmail.com", href: "mailto:associationcultureafro@gmail.com" },
  { id: "3", type: "location", title: "Localisation", value: "Saint-Denis, La Réunion", href: null },
];

export default function ContactSection({
  contactInfos,
}: {
  contactInfos?: ContactInfoData[];
}) {
  const infos = contactInfos && contactInfos.length > 0 ? contactInfos : fallbackInfos;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot : si rempli, c'est un bot
    if (formData.get("website")) {
      setStatus("sent");
      return;
    }

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Erreur lors de l'envoi.");
      }

      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    }
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-afro-warm py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ─── En-tête ─── */}
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 inline-block rounded-full bg-afro-magenta/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-magenta">
            Parlons-en
          </span>
          <h2
            id="contact-title"
            className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl"
          >
            Nous Contacter
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-afro-dark/60">
            Une question, une idée de partenariat ou simplement envie de
            discuter&nbsp;? On vous répond rapidement.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          {/* ─── Infos de contact ─── */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {infos.map((info) => {
              const Icon = iconMap[info.type] || Phone;
              const Content = (
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-afro-orange/15 to-afro-magenta/10">
                    <Icon className="h-5 w-5 text-afro-orange" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-afro-dark/40">
                      {info.title}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-afro-dark">
                      {info.value}
                    </p>
                  </div>
                </div>
              );

              return info.href ? (
                <a
                  key={info.id}
                  href={info.href}
                  className="min-h-[44px] rounded-2xl border border-afro-dark/5 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-afro-orange/20"
                >
                  {Content}
                </a>
              ) : (
                <div
                  key={info.id}
                  className="rounded-2xl border border-afro-dark/5 bg-white p-5 shadow-sm"
                >
                  {Content}
                </div>
              );
            })}

            {/* ─── Horaires indicatifs ─── */}
            <div className="mt-2 rounded-2xl border border-afro-magenta/10 bg-afro-magenta/5 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-afro-magenta/60">
                Délai de réponse
              </p>
              <p className="mt-1 text-sm text-afro-dark/70">
                Nous répondons généralement sous <strong className="text-afro-dark">48 heures</strong> ouvrées.
              </p>
            </div>
          </div>

          {/* ─── Formulaire ─── */}
          <div className="rounded-2xl border border-afro-dark/5 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              aria-label="Formulaire de contact"
            >
              {/* Honeypot anti-spam — invisible pour les humains */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Ne pas remplir</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50"
                  >
                    Nom <span className="text-afro-magenta">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Votre nom"
                    autoComplete="name"
                    className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark placeholder:text-afro-dark/35 transition-all duration-200 focus:border-afro-orange focus:outline-none focus:ring-2 focus:ring-afro-orange/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50"
                  >
                    Email <span className="text-afro-magenta">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    required
                    placeholder="Votre email"
                    autoComplete="email"
                    className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark placeholder:text-afro-dark/35 transition-all duration-200 focus:border-afro-orange focus:outline-none focus:ring-2 focus:ring-afro-orange/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50"
                >
                  Sujet <span className="text-afro-magenta">*</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="De quoi souhaitez-vous parler ?"
                  className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark placeholder:text-afro-dark/35 transition-all duration-200 focus:border-afro-orange focus:outline-none focus:ring-2 focus:ring-afro-orange/20"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50"
                >
                  Message <span className="text-afro-magenta">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Votre message..."
                  className="min-h-[44px] w-full resize-none rounded-xl border border-afro-dark/10 bg-afro-light px-4 py-3 text-base text-afro-dark placeholder:text-afro-dark/35 transition-all duration-200 focus:border-afro-orange focus:outline-none focus:ring-2 focus:ring-afro-orange/20"
                />
              </div>

              {/* ─── Messages de statut ─── */}
              {status === "sent" && (
                <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Message envoyé avec succès !</p>
                    <p className="mt-0.5 text-xs text-green-600">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {errorMsg}
                </div>
              )}

              {/* ─── Bouton d'envoi ─── */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-afro-magenta to-afro-orange px-8 py-3 font-bold text-white shadow-lg shadow-afro-magenta/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-afro-magenta/30 disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === "sending" ? (
                  <>
                    Envoi en cours...
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>

              <p className="text-xs text-afro-dark/40">
                En envoyant ce formulaire, vous acceptez que vos données soient utilisées
                uniquement pour répondre à votre demande, conformément à notre{" "}
                <a href="/mentions-legales" className="underline hover:text-afro-magenta transition-colors">
                  politique de confidentialité
                </a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
