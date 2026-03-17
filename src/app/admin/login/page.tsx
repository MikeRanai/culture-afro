import LoginForm from "./LoginForm";

export const metadata = {
  title: "Connexion Admin | Culture Afro",
  robots: "noindex, nofollow",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-afro-light px-4">
      <div className="w-full max-w-md">
        {/* Logo + Titre */}
        <div className="mb-8 text-center">
          <img
            src="/images/logo-culture-afro.svg"
            alt="Logo Culture Afro"
            className="mx-auto mb-4 h-16 w-auto"
            width={64}
            height={64}
          />
          <h1 className="font-serif text-2xl font-bold text-afro-dark">
            Espace Administrateur
          </h1>
          <p className="mt-1 text-sm text-afro-dark/60">
            Connectez-vous pour gérer le site
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
