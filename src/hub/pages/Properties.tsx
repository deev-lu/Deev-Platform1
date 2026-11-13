import { useState } from "react";
import { Link } from "react-router";
import { useHub, useWs } from "../session";
import { Badge, Card, Empty, LoadError, Loading, PageHeader, Select, useFmt, useLoad } from "../ui";
import { PROPERTY_STATUSES, type Property } from "../types";

const STATUS_TONE: Record<Property["status"], "neutral" | "good" | "warn" | "signal" | "bad"> = {
  draft: "neutral",
  available: "good",
  under_offer: "warn",
  sold: "signal",
  rented: "signal",
  withdrawn: "bad",
};

export default function Properties() {
  const { t, repo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const [status, setStatus] = useState<string>("");
  const { data, error, loading, reload } = useLoad(() => repo.properties(ws.id), [ws.id, repo]);

  const list = (data ?? []).filter((p) => !status || p.status === status);

  return (
    <>
      <PageHeader
        title={t.props.title}
        actions={
          <Link to="/properties/new" className="inline-flex items-center h-11 px-5 rounded-full bg-[var(--signal)] text-white font-medium text-[0.875rem] hover:bg-[#1747c4]">
            + {t.props.new}
          </Link>
        }
      />
      <div className="max-w-xs mb-5">
        <Select
          label={t.props.status}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[{ value: "", label: t.props.all }, ...PROPERTY_STATUSES.map((s) => ({ value: s, label: t.props.statuses[s] }))]}
        />
      </div>
      {loading && !data ? (
        <Loading />
      ) : error || !data ? (
        <LoadError retry={reload} />
      ) : list.length === 0 ? (
        <Card as="div">
          <Empty
            action={
              <Link to="/properties/new" className="inline-flex items-center h-11 px-5 rounded-full bg-[var(--signal)] text-white font-medium text-[0.875rem]">
                {t.props.new}
              </Link>
            }
          >
            {t.props.empty}
          </Empty>
        </Card>
      ) : (
        <ul className="m-0 p-0 list-none grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((p) => (
            <li key={p.id} className="relative flex flex-col gap-2 rounded-[var(--radius-2)] border border-[var(--line)] bg-[var(--surface-1)] p-5 hover:border-[var(--line-strong)] transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.75rem] text-[var(--text-low)]">
                  {t.props.kinds[p.kind]} · {t.props.deals[p.deal]}
                  {p.reference ? ` · ${p.reference}` : ""}
                </span>
                <Badge tone={STATUS_TONE[p.status]}>{t.props.statuses[p.status]}</Badge>
              </div>
              <h2 className="m-0 text-[1.0625rem] font-semibold leading-snug">
                <Link to={`/properties/${p.id}`} className="text-[var(--text-hi)] after:absolute after:inset-0 hover:underline underline-offset-2">
                  {p.title}
                </Link>
              </h2>
              <p className="m-0 font-brand text-[1.25rem] text-[var(--text-hi)] tabular-nums">
                {f.money(p.price)}
                {p.deal === "rent" && p.price != null && <span className="text-[0.8125rem] font-sans text-[var(--text-mid)]"> {t.props.perMonth}</span>}
              </p>
              <p className="m-0 text-[0.875rem] text-[var(--text-mid)]">
                {[p.surface_m2 != null && `${f.num(p.surface_m2)} m²`, p.bedrooms ? `${t.props.bedrooms}: ${p.bedrooms}` : null, p.city].filter(Boolean).join(" · ") || "–"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
