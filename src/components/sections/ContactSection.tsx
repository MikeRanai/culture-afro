"use client";

import { Mail, MapPin, Clock, Phone, Send, Loader2, CheckCircle } from "lucide-react";
import { useState, FormEvent } from "react";

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
  { id: "4", type: "hours", title: "Disponibilité", value: "Lun – Sam, 9h – 18h", href: null },
];

export default function ContactSection({
  contactInfos,
}: {
  contactInfos?: ContactInfoData[];
}) {
  const infos = contactInfos && contactInfos.length > 0 ? contactInfos : fallbackInfos;
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
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
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
          <div className="flex flex-col gap-6 lg:col-span-2">
            {infos.map((info) => {
              const Icon = iconMap[info.type] || Phone;
              const Content = (
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-afro-orange/10">
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
                  className="min-h-[44px] rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {Content}
                </a>
              ) : (
                <div key={info.id} className="rounded-2xl bg-white p-4 shadow-md">
                  {Content}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8 lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              aria-label="Formulaire de contact"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50">Nom</label>
                  <input id="contact-name" name="name" type="text" required placeholder="Votre nom" autoComplete="name" className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark placeholder:text-afro-dark/35 transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50">Email</label>
                  <input id="contact-email" name="email" type="email" inputMode="email" required placeholder="Votre email" autoComplete="email" className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark placeholder:text-afro-dark/35 transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50">Sujet</label>
                <input id="contact-subject" name="subject" type="text" required placeholder="De quoi souhaitez-vous parler ?" className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark placeholder:text-afro-dark/35 transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50">Message</label>
                <textarea id="contact-message" name="message" rows={4} required placeholder="Votre message..." className="min-h-[44px] w-full resize-none rounded-xl border border-afro-dark/10 bg-afro-light px-4 py-3 text-base text-afro-dark placeholder:text-afro-dark/35 transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30" />
              </div>

              {status === "sent" && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Message envoyé avec succès !
                </div>
              )}

              {status === "error" && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full bg-afro-magenta px-8 py-3 font-bold text-white shadow-lg shadow-afro-magenta/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-afro-magenta/30 disabled:opacity-60 disabled:hover:scale-100"
              >
                {status === "sending" ? (
                  <>
                    Envoi en cours...
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Envoyer
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
