"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { loginAction } from "@/lib/auth-actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      action={formAction}
      className="rounded-2xl bg-white p-6 shadow-md sm:p-8"
      aria-label="Formulaire de connexion"
    >
      {/* Message d'erreur */}
      {state?.error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {state.error}
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50"
        >
          Adresse email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
          placeholder="admin@cultureafro.re"
          className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark placeholder:text-afro-dark/35 transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
        />
      </div>

      {/* Mot de passe */}
      <div className="mb-6">
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-afro-dark/50"
        >
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            className="min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 pr-12 text-base text-afro-dark placeholder:text-afro-dark/35 transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-1 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center text-afro-dark/30 transition-colors hover:text-afro-dark/60"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-afro-magenta px-6 py-3 font-bold text-white shadow-lg shadow-afro-magenta/25 transition-all duration-300 hover:bg-afro-magenta/90 hover:shadow-xl disabled:opacity-50"
      >
        {pending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Connexion...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Se connecter
          </>
        )}
      </button>
    </form>
  );
}
