import { useEffect, useState, type FormEvent } from "react";
import { useHub, useWs } from "../session";
import { Badge, Button, Card, Check, Dialog, Empty, Field, LoadError, Loading, PageHeader, Select, Status, TextArea, numOrNull, useFmt, useLoad } from "../ui";
import { UNITS, type CatalogItem } from "../types";

/**
 * Products and services: what the company sells, at its own prices. The
 * proposal writer (api/_hub/agents.ts) prices only from here, so a proposal
 * never carries a figure nobody entered.
 */
export default function Catalog() {
  const { t, repo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const [editing, setEditing] = useState<CatalogItem | "new" | null>(null);
  const { data, error, loading, reload } = useLoad(() => repo.catalog(ws.id), [ws.id, repo]);

  const unit = (u: string) => t.catalog.units[u as keyof typeof t.catalog.units] ?? u;

  return (
    <>
      <PageHeader
        title={t.catalog.title}
        sub={t.catalog.intro}
        actions={
          <Button variant="primary" onClick={() => setEditing("new")}>
            + {t.catalog.new}
          </Button>
        }
      />
      <Card as="div">
        {loading && !data ? (
          <Loading />
        ) : error || !data ? (
          <LoadError retry={reload} />
        ) : data.length === 0 ? (
          <Empty action={<Button variant="primary" onClick={() => setEditing("new")}>{t.catalog.new}</Button>}>{t.catalog.empty}</Empty>
        ) : (
          <ul className="m-0 p-0 list-none divide-y divide-[var(--line)]">
            {data.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5">
                <div className="flex-1 min-w-[14rem]">
                  <p className={`m-0 font-medium ${item.active ? "text-[var(--text-hi)]" : "text-[var(--text-mid)]"}`}>{item.name}</p>
                  {item.description && <p className="m-0 mt-0.5 text-[0.8125rem] text-[var(--text-mid)]">{item.description}</p>}
                </div>
                {!item.active && <Badge>{t.catalog.inactive}</Badge>}
                <p className="m-0 tabular-nums text-[var(--text-hi)] whitespace-nowrap">
                  {item.unit_price == null ? t.catalog.onRequest : f.money(item.unit_price)}
                  <span className="text-[0.8125rem] text-[var(--text-mid)]"> / {unit(item.unit)}</span>
                </p>
                <Button size="sm" onClick={() => setEditing(item)} aria-label={`${t.edit}: ${item.name}`}>
                  {t.edit}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <ItemDialog item={editing} onClose={() => setEditing(null)} onSaved={reload} />
    </>
  );
}

function ItemDialog({ item, onClose, onSaved }: { item: CatalogItem | "new" | null; onClose: () => void; onSaved: () => void }) {
  const { t, repo } = useHub();
  const ws = useWs();
  const existing = item && item !== "new" ? item : null;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState<CatalogItem["unit"]>("item");
  const [active, setActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    setName(existing?.name ?? "");
    setDescription(existing?.description ?? "");
    setPrice(existing?.unit_price != null ? String(existing.unit_price) : "");
    setUnit(existing?.unit ?? "item");
    setActive(existing?.active ?? true);
    setErr(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await repo.saveCatalogItem(ws.id, {
        ...(existing ? { id: existing.id } : {}),
        name: name.trim(),
        description: description.trim() || null,
        unit_price: numOrNull(price),
        unit,
        active,
      });
      onSaved();
      onClose();
    } catch {
      setErr(t.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={Boolean(item)} onClose={onClose} title={existing ? existing.name : t.catalog.new}>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.required}</p>
        <Field label={t.catalog.name} required maxLength={160} value={name} onChange={(e) => setName(e.target.value)} />
        <TextArea label={t.catalog.description} rows={3} maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t.catalog.price} hint={t.catalog.priceHint} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Select label={t.catalog.unit} value={unit} onChange={(e) => setUnit(e.target.value as CatalogItem["unit"])} options={UNITS.map((u) => ({ value: u, label: t.catalog.units[u] }))} />
        </div>
        <div>
          <Check label={t.catalog.active} checked={active} onChange={(e) => setActive(e.target.checked)} />
          <p className="m-0 mt-1 ml-7 text-[0.75rem] text-[var(--text-low)]">{t.catalog.activeHint}</p>
        </div>
        <Status message={err} tone="bad" />
        <div className="flex flex-wrap justify-between gap-2">
          {existing ? (
            <Button
              variant="danger"
              onClick={async () => {
                if (!window.confirm(t.confirmDelete(existing.name))) return;
                try {
                  await repo.deleteCatalogItem(ws.id, existing.id);
                  onSaved();
                  onClose();
                } catch {
                  setErr(t.error);
                }
              }}
            >
              {t.catalog.deleteItem}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button onClick={onClose}>{t.cancel}</Button>
            <Button type="submit" variant="primary" disabled={busy || !name.trim()}>
              {busy ? t.saving : t.save}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
