type FAQ = {
  id: string;
  question: string;
  answer: string;
};

const fallbackFaqs: FAQ[] = [
  { id: "1", question: "Les ateliers sont-ils ouverts à tous ?", answer: "Oui ! Nos interventions associatives sont gratuites et ouvertes à toutes et tous, du plus petit à l'adulte, quel que soit votre type de cheveux ou votre niveau de connaissance." },
  { id: "2", question: "Combien coûte la participation aux ateliers ?", answer: "Nos ateliers capillaires sont 100% gratuits. Les produits capillaires, accessoires et matériel sont mis à disposition sur place." },
  { id: "3", question: "Où et quand se déroulent les ateliers capillaires ?", answer: "Les ateliers BarreF ont lieu au Château Morange, Camélias, chaque 1er samedi du mois. Le matin de 9h à 12h sur inscription (places limitées) et l'après-midi de 14h à 18h en portes ouvertes." },
  { id: "4", question: "Où peut-on vous retrouver en dehors des ateliers ?", answer: "On est présentes sur tout le territoire : festivals, pop-up, journées découvertes, dans les quartiers… Suivez-nous sur nos réseaux sociaux pour être tenu·e au courant des prochains événements !" },
  { id: "5", question: "Comment devenir bénévole ?", answer: "Contactez-nous par email à associationcultureafro@gmail.com ou sur nos réseaux sociaux. Coiffeuses ou passionnées, venez apprendre sur les textures de cheveux, partager vos compétences et échanger avec le public !" },
  { id: "6", question: "Quels sont les avantages de l'adhésion ?", answer: "En tant qu'adhérent·e, l'association soutient vos projets sociaux ou commerciaux, offre de la visibilité à votre activité, et vous êtes informé·e en priorité des événements. L'adhésion se fait via notre page HelloAsso." },
  { id: "7", question: "Comment soutenir l'association ?", answer: "Vous pouvez devenir bénévole, adhérer à l'association, ou faire un don via notre page HelloAsso. Chaque geste compte pour maintenir nos ateliers gratuits !" },
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
