import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin | Culture Afro",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasSession = !!cookieStore.get("admin_session")?.value;

  // Page de login : layout minimal sans sidebar
  if (!hasSession) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-afro-light">
      <AdminSidebar />
      <main className="lg:ml-64">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
