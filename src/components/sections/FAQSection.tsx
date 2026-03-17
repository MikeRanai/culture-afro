type FAQ = {
  id: string;
  question: string;
  answer: string;
};

const fallbackFaqs: FAQ[] = [
  { id: "1", question: "Les ateliers sont-ils ouverts à tous ?", answer: "Oui ! Nos ateliers sont ouverts à toutes et tous, du plus petit à l'adulte, quel que soit votre type de cheveux ou votre niveau de connaissance." },
  { id: "2", question: "Combien coûte la participation aux ateliers ?", answer: "Nos ateliers capillaires sont 100% gratuits. Les produits capillaires, accessoires et matériel sont mis à disposition sur place." },
  { id: "3", question: "Où et quand se déroulent les ateliers capillaires ?", answer: "Les ateliers ont lieu à la BARRE F – Château Morange, Saint-Denis, chaque 1er samedi du mois de 9h à 12h. Sur inscription uniquement, places limitées." },
  { id: "4", question: "Où peut-on vous retrouver en dehors des ateliers ?", answer: "On est présentes sur tout le territoire : festivals, pop-up, journées découvertes, boutiques solidaires, dans les quartiers… Partout où l'échange et le partage ont leur place. Suivez-nous sur nos réseaux pour les prochaines dates !" },
  { id: "5", question: "Comment devenir bénévole ?", answer: "Il suffit de remplir le formulaire dans la section Engagement ci-dessus, ou de nous contacter directement par email ou sur nos réseaux sociaux. On vous accueille avec plaisir !" },
  { id: "6", question: "Faut-il être membre pour participer ?", answer: "Non, vous pouvez assister à un premier atelier sans adhésion. Si l'aventure vous plaît, l'adhésion annuelle est proposée à un tarif accessible." },
];

export default function FAQSection({ faqs }: { faqs?: FAQ[] }) {
  const data = faqs && faqs.length > 0 ? faqs : fallbackFaqs;

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 inline-block rounded-full bg-afro-orange/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-afro-orange">
            Besoin d&apos;infos ?
          </span>
          <h2
            id="faq-title"
            className="font-serif text-3xl font-bold text-afro-dark sm:text-4xl"
          >
            Questions Fréquentes
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {data.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-2xl bg-white shadow-md transition-shadow duration-300 open:shadow-lg [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold text-afro-dark transition-colors hover:text-afro-orange">
                <span className="text-sm sm:text-base">{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-afro-dark/30 transition-transform duration-300 group-open:rotate-180"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-5 pt-0">
                <p className="text-sm leading-relaxed text-afro-dark/60">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
