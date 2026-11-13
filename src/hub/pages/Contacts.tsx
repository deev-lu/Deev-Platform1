import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useHub, useWs } from "../session";
import { Badge, Button, Card, Empty, Field, LoadError, Loading, PageHeader, fullName, useFmt, useLoad } from "../ui";
import { ContactDialog } from "../forms";

export default function Contacts() {
  const { t, repo } = useHub();
  const ws = useWs();
  const f = useFmt();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [adding, setAdding] = useState(false);

  // Search as you type, without a query per keystroke.
  useEffect(() => {
    const id = setTimeout(() => setTerm(q), 250);
    return () => clearTimeout(id);
  }, [q]);

  const { data, error, loading, reload } = useLoad(() => repo.contacts(ws.id, term), [ws.id, term, repo]);

  return (
    <>
      <PageHeader
        title={t.contacts.title}
        actions={
          <Button variant="primary" onClick={() => setAdding(true)}>
            + {t.contacts.new}
          </Button>
        }
      />
      <div className="max-w-sm mb-5">
        <Field label={t.search} type="search" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <Card as="div">
        {loading && !data ? (
          <Loading />
        ) : error || !data ? (
          <LoadError retry={reload} />
        ) : data.length === 0 ? (
          <Empty action={!term && <Button variant="primary" onClick={() => setAdding(true)}>{t.contacts.new}</Button>}>{term ? t.contacts.noResults : t.contacts.empty}</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[0.9375rem]">
              <caption className="sr-only">{t.contacts.title}</caption>
              <thead>
                <tr className="text-[0.75rem] text-[var(--text-low)]">
                  <th scope="col" className="font-medium pb-2 pr-4">{t.contacts.first}</th>
                  <th scope="col" className="font-medium pb-2 pr-4">{t.contacts.kind}</th>
                  <th scope="col" className="font-medium pb-2 pr-4 hidden md:table-cell">{t.contacts.email}</th>
                  <th scope="col" className="font-medium pb-2 pr-4 hidden md:table-cell">{t.contacts.phone}</th>
                  <th scope="col" className="font-medium pb-2 hidden sm:table-cell">{t.contacts.source}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  <tr key={c.id} className="border-t border-[var(--line)]">
                    <td className="py-3 pr-4">
                      <Link to={`/contacts/${c.id}`} className="font-medium text-[var(--text-hi)] hover:underline underline-offset-2">
                        {fullName(c)}
                      </Link>
                      <div className="text-[0.75rem] text-[var(--text-low)]">{f.date(c.created_at)}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge>{t.contacts.kinds[c.kind]}</Badge>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell text-[var(--text)] break-all">{c.email ?? "–"}</td>
                    <td className="py-3 pr-4 hidden md:table-cell text-[var(--text)]">{c.phone ?? "–"}</td>
                    <td className="py-3 hidden sm:table-cell text-[var(--text-mid)]">{c.source ?? "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <ContactDialog open={adding} onClose={() => setAdding(false)} onSaved={(id) => navigate(`/contacts/${id}`)} />
    </>
  );
}
