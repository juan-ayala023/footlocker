import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { Logo, Wordmark } from "@/components/brand/Logo";
import { MountainRange } from "@/components/brand/MountainRange";
import { FooterGroup } from "@/components/layout/FooterGroup";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { footerNav, site } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="newsletter" className="relative mt-32 overflow-hidden border-t border-line">
      <div className="container-page grid gap-16 pt-20 pb-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="eyebrow mb-6 text-stone">Newsletter</p>
          <h2 className="text-h3 max-w-sm">Sé el primero en enterarte del próximo drop.</h2>
          <NewsletterForm />
        </div>

        <div className="-mt-6 grid md:col-span-7 md:mt-0 md:grid-cols-3 md:gap-8">
          {footerNav.map((group) => (
            <FooterGroup key={group.title} title={group.title} links={group.links} />
          ))}
        </div>
      </div>

      <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-2 pb-12 text-sm text-stone">
        <a href={site.social.instagram} target="_blank" rel="noreferrer" className="hover:text-bone">
          Instagram @{site.instagramHandle}
        </a>
        <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-bone">
          WhatsApp
        </a>
        <Link href="/ayuda#contacto" className="hover:text-bone">
          Contáctanos
        </Link>
      </div>

      {/* Cierre editorial: logo enorme sobre la cordillera */}
      <div className="relative">
        <MountainRange className="h-40 md:h-64" />
        <div className="absolute inset-0 flex items-end justify-center pb-6 md:pb-10">
          <div className="flex flex-col items-center gap-3">
            <Logo className="w-40 md:w-56" />
            <Wordmark className="text-sm md:text-base" />
          </div>
        </div>
      </div>

      <div className="bg-[#0e0e0e]">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. Todos los derechos reservados.
          </p>
          <p className="eyebrow">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
