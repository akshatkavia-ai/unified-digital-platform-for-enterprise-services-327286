import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { createT, getDictionary } from "@/i18n/server";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const dict = await getDictionary(locale);
  const t = createT(dict);

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">{t("dashboard.title")}</h1>
        <p className="mt-1 text-sm text-slate-600">{t("dashboard.welcome")}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-800">{t("nav.applications")}</div>
          <div className="mt-1 text-sm text-slate-600">{t("common.comingSoon")}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-800">{t("nav.inspections")}</div>
          <div className="mt-1 text-sm text-slate-600">{t("common.comingSoon")}</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold text-slate-900">{t("health.title")}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("health.description")}</p>
        <div className="mt-3">
          <a
            className="text-sm font-medium text-blue-700 underline underline-offset-4 hover:text-blue-800"
            href={`/${locale}/health`}
          >
            View health page
          </a>
        </div>
      </div>
    </section>
  );
}
