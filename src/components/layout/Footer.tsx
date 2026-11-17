import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { Logo } from "@/components/brand/Logo";
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
          <h2 className="text-h3 max-w-sm">Entérate primero de nuevas fragancias y ofertas.</h2>
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

      {/* Cierre editorial: logo completo */}
      <div className="flex justify-center border-t border-line py-16 md:py-20">
        <Logo variant="full" className="w-56 md:w-72" />
      </div>

      <div className="bg-[#140205]">
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
