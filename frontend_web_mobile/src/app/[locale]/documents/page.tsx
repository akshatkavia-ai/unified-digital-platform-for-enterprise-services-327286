import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { createT, getDictionary } from "@/i18n/server";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const dict = await getDictionary(locale);
  const t = createT(dict);

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-slate-900">{t("nav.documents")}</h1>
      <p className="text-sm text-slate-600">{t("common.comingSoon")}</p>
    </section>
  );
}
