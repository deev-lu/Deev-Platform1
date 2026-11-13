import { useState } from "react";
import { useHub, useWs } from "../session";
import { Card, LoadError, Loading, PageHeader, Select, useLoad } from "../ui";
import { TaskQuickAdd } from "../forms";
import { TaskList } from "../widgets";

export default function Tasks() {
  const { t, repo } = useHub();
  const ws = useWs();
  const [show, setShow] = useState<"open" | "all">("open");
  const { data, error, loading, reload } = useLoad(() => repo.tasks(ws.id, { open: show === "open" }), [ws.id, show, repo]);
  return (
    <>
      <PageHeader title={t.tasks.title} />
      <div className="flex flex-col gap-4 sm:gap-6">
        <Card as="div">
          <TaskQuickAdd links={{}} onSaved={reload} />
        </Card>
        <Card
          title={show === "open" ? t.tasks.open : t.tasks.all}
          actions={
            <div className="w-44">
              <Select
                label={t.tasks.title}
                value={show}
                onChange={(e) => setShow(e.target.value as "open" | "all")}
                options={[
                  { value: "open", label: t.tasks.open },
                  { value: "all", label: t.tasks.all },
                ]}
              />
            </div>
          }
        >
          {loading && !data ? <Loading /> : error || !data ? <LoadError retry={reload} /> : <TaskList tasks={data} onChange={reload} showLinks />}
        </Card>
      </div>
    </>
  );
}
