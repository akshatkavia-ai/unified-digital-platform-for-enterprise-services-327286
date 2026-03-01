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
    <section className="space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
          Portal
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {t("dashboard.title")}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">{t("dashboard.welcome")}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">{t("nav.applications")}</div>
              <div className="mt-1 text-sm text-slate-600">{t("common.comingSoon")}</div>
            </div>
            <div className="rounded-xl bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
              Module
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-slate-200 to-transparent" />
          <div className="mt-3 text-xs text-slate-500">
            Submit and track applications with workflow-driven processing.
          </div>
        </div>

        <div className="group rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">{t("nav.inspections")}</div>
              <div className="mt-1 text-sm text-slate-600">{t("common.comingSoon")}</div>
            </div>
            <div className="rounded-xl bg-cyan-500/10 px-2 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-100">
              Field
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-slate-200 to-transparent" />
          <div className="mt-3 text-xs text-slate-500">
            Plan, execute, and report inspections with mobile-ready flows.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{t("health.title")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("health.description")}</p>
          </div>

          <a
            className="focus-ring inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-cyan-700"
            href={`/${locale}/health`}
          >
            View health page
          </a>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
          <div className="text-xs font-semibold text-slate-700">What’s next</div>
          <div className="mt-1 text-xs text-slate-600">
            As modules come online, this dashboard will show shortcuts, status cards, and recent activity.
          </div>
        </div>
      </div>
    </section>
  );
}
