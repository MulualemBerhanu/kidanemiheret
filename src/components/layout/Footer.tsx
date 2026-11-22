import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/data/site";
import { brandImages } from "@/data/images";
import { navRoutes } from "@/data/nav";
import { churchDocuments } from "@/data/documents";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tSite = await getTranslations("site");
  const { address, phone, email, social } = siteConfig;

  return (
    <footer className="relative overflow-hidden bg-charcoal border-t border-gold/20">
      <div className="relative z-10 px-4 pt-2" aria-hidden>
        <div
          className="h-12 w-full opacity-40"
          style={{
            backgroundImage: `url(${brandImages.cross})`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-2xl text-ivory">{tSite("shortName")}</p>
          <p className="mt-2 max-w-md text-sm text-ivory/50">{tSite("footerTagline")}</p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">{t("visit")}</h4>
            <p className="text-ivory/70 leading-relaxed">
              {address.street}
              <br />
              {address.city}, {address.state} {address.zip}
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">{t("contact")}</h4>
            <p className="text-ivory/70">
              <a href={`tel:${phone.replace(/\D/g, "")}`} className="hover:text-gold transition-colors">
                {phone}
              </a>
              <br />
              <a href={`mailto:${email}`} className="hover:text-gold transition-colors">
                {email}
              </a>
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">{t("resources")}</h4>
            <ul className="space-y-2 text-ivory/70">
              <li>
                <Link href="/register" className="hover:text-gold transition-colors">
                  {t("membershipRegister")}
                </Link>
              </li>
              <li>
                <Link href="/about#bylaws" className="hover:text-gold transition-colors">
                  {t("bylaws")}
                </Link>
              </li>
              <li>
                <a
                  href={churchDocuments.bylawsEnglish}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  {t("bylawsEnglishPdf")}
                </a>
              </li>
              <li>
                <a
                  href={churchDocuments.bylawsAmharic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  {t("bylawsAmharicPdf")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">{t("connect")}</h4>
            <ul className="flex flex-wrap gap-4">
              {Object.entries(social).map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ivory/70 uppercase text-xs tracking-widest hover:text-gold transition-colors"
                  >
                    {t(`social.${key}` as "social.youtube")}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-12 flex flex-wrap justify-center gap-6 border-t border-gold/10 pt-8">
          {navRoutes.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-xs uppercase tracking-widest text-ivory/50 hover:text-gold transition-colors"
              >
                {tNav(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-center text-xs text-ivory/40">
            © {new Date().getFullYear()} {tSite("name")}. {t("copyright")}
          </p>
          <a
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-[2px] border border-gold/25 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-ivory/55 transition hover:border-gold/50 hover:text-gold"
          >
            {t("adminLogin")}
          </a>
        </div>
      </div>
    </footer>
  );
}
