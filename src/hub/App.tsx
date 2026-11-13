import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { useHub } from "./session";
import Shell from "./Shell";
import { Loading } from "./ui";
import { SignIn, SignUp, ResetPassword, UpdatePassword } from "./pages/Auth";
import Welcome from "./pages/Welcome";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Pipeline = lazy(() => import("./pages/Pipeline"));
const LeadPage = lazy(() => import("./pages/Lead"));
const Contacts = lazy(() => import("./pages/Contacts"));
const ContactPage = lazy(() => import("./pages/Contact"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyPage = lazy(() => import("./pages/Property"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Copilot = lazy(() => import("./pages/Copilot"));
const Settings = lazy(() => import("./pages/Settings"));

/** The page title follows the screen, so tabs and screen readers can tell them apart. */
function Title() {
  const { t, ws } = useHub();
  const { pathname } = useLocation();
  useEffect(() => {
    const key = (
      [
        ["/pipeline", t.nav.pipeline],
        ["/leads", t.lead.title],
        ["/contacts", t.nav.contacts],
        ["/properties", t.nav.properties],
        ["/tasks", t.nav.tasks],
        ["/copilot", t.nav.copilot],
        ["/settings", t.nav.settings],
        ["/sign-up", t.auth.signUp],
        ["/sign-in", t.auth.signIn],
      ] as const
    ).find(([p]) => pathname.startsWith(p))?.[1];
    document.title = [key ?? t.nav.dashboard, ws?.name, `${t.brand} · DEEV`].filter(Boolean).join(" · ");
  }, [pathname, t, ws?.name]);
  return null;
}

/** /hub/demo: straight into the demo (the website's "Explore the demo" links here). */
function StartDemo() {
  const { startDemo } = useHub();
  useEffect(() => startDemo(), [startDemo]);
  return <Loading />;
}

export default function HubApp() {
  const { status, ws } = useHub();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loading />
      </div>
    );
  }

  if (status === "signed-out") {
    return (
      <>
        <Title />
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/demo" element={<StartDemo />} />
          <Route path="*" element={<Navigate to="/sign-in" replace state={{ from: location.pathname }} />} />
        </Routes>
      </>
    );
  }

  // Signed in, but no agency yet: the second step of signing up.
  if (!ws) {
    return (
      <Routes>
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="*" element={<Welcome />} />
      </Routes>
    );
  }

  return (
    <Shell>
      <Title />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/leads/:id" element={<LeadPage />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/:id" element={<ContactPage />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Shell>
  );
}
