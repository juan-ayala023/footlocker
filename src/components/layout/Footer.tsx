import { TransitionLink as Link } from "@/components/motion/TransitionLink";
import { Logo, Wordmark } from "@/components/brand/Logo";
import { MountainRange } from "@/components/brand/MountainRange";
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

        {footerNav.map((group) => (
          <div key={group.title} className="md:col-span-2 md:col-start-auto">
            <p className="eyebrow mb-6 text-stone">{group.title}</p>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mist transition-colors duration-500 hover:text-sand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-3">
          <p className="eyebrow mb-6 text-stone">Síguenos</p>
          <ul className="space-y-3">
            <li>
              <a href={site.social.instagram} target="_blank" rel="noreferrer" className="text-sm text-mist transition-colors duration-500 hover:text-sand">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.social.tiktok} target="_blank" rel="noreferrer" className="text-sm text-mist transition-colors duration-500 hover:text-sand">
                TikTok
              </a>
            </li>
          </ul>
        </div>
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
