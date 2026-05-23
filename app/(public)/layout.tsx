import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { AuroraMesh } from "@/components/common/AuroraMesh";
import { getAbout, getContact, getHero } from "@/lib/cms/queries";

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [hero, about, contact] = await Promise.all([getHero(), getAbout(), getContact()]);
  const siteName = about?.fullName || hero?.fullName || "Portfolio";

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#0B1320" }}>
      <AuroraMesh variant="dark" />
      <ScrollToTop />
      <Header siteName={siteName} />
      <main className="relative w-full pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-12 xl:px-16">
          {children}
        </div>
      </main>
      <Footer about={about} contact={contact} />
    </div>
  );
}
