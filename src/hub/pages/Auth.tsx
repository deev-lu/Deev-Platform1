import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { useHub } from "../session";
import { hubConfigured, supabase } from "../supabase";
import { Brand, DemoBanner, LangSelect, ThemeButton } from "../Shell";
import { Button, Field, Status } from "../ui";

const MIN_PASSWORD = 10;

/** The frame of every signed-out screen: brand and promise on one side, the form on the other. */
function AuthFrame({ title, children }: { title: string; children: ReactNode }) {
  const { t, startDemo } = useHub();
  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner />
      <header className="flex items-center justify-between gap-3 h-16 px-4 sm:px-8">
        <a href="/" className="rounded-full">
          <Brand />
        </a>
        <div className="flex items-center gap-2">
          <LangSelect />
          <ThemeButton />
        </div>
      </header>
      <main id="main" className="flex-1 grid lg:grid-cols-2 gap-10 px-4 sm:px-8 py-8 lg:py-16 max-w-[1200px] w-full mx-auto">
        <section className="flex flex-col justify-center order-2 lg:order-1">
          <p className="m-0 font-brand text-[var(--text-hi)] text-[clamp(2rem,1.2rem+2.6vw,3.25rem)] leading-[1.05] tracking-[-0.03em]">
            {t.brand}
          </p>
          <p className="mt-4 mb-0 text-[1.0625rem] leading-relaxed text-[var(--text)] max-w-[44ch]">{t.auth.intro}</p>
          <p className="mt-4 mb-0 text-[0.875rem] text-[var(--text-mid)] max-w-[52ch]">{t.auth.early}</p>
          <div className="mt-8">
            <Button onClick={startDemo}>{t.demo.start}</Button>
          </div>
        </section>
        <section className="order-1 lg:order-2 flex items-center">
          <div className="w-full max-w-md mx-auto rounded-[var(--radius-2)] border border-[var(--line)] bg-[var(--surface-1)] p-6 sm:p-8">
            <h1 className="m-0 mb-6 font-brand text-[1.5rem] text-[var(--text-hi)] leading-tight">{title}</h1>
            {hubConfigured ? children : <NotConfigured />}
          </div>
        </section>
      </main>
    </div>
  );
}

function NotConfigured() {
  const { t, startDemo } = useHub();
  return (
    <div className="flex flex-col gap-4">
      <p className="m-0 text-[var(--text)]">{t.auth.notConfigured}</p>
      <Button variant="primary" onClick={startDemo}>
        {t.demo.start}
      </Button>
    </div>
  );
}

export function SignIn() {
  const { t } = useHub();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await supabase().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setErr(error.status === 400 ? t.auth.wrong : t.error);
  };

  return (
    <AuthFrame title={t.auth.signInTitle}>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label={t.auth.email} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label={t.auth.password} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Status message={err} tone="bad" />
        <Button type="submit" variant="primary" disabled={busy || !email || !password}>
          {busy ? t.loading : t.auth.signIn}
        </Button>
        <div className="flex flex-wrap justify-between gap-2 text-[0.875rem]">
          <Link to="/reset" className="text-[var(--signal-text)] underline underline-offset-2">
            {t.auth.forgot}
          </Link>
          <span className="text-[var(--text-mid)]">
            {t.auth.noAccount}{" "}
            <Link to="/sign-up" className="text-[var(--signal-text)] underline underline-offset-2">
              {t.auth.signUp}
            </Link>
          </span>
        </div>
      </form>
    </AuthFrame>
  );
}

export function SignUp() {
  const { t } = useHub();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const doneRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD) {
      setErr(t.auth.weak);
      return;
    }
    setBusy(true);
    setErr(null);
    const { data, error } = await supabase().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() }, emailRedirectTo: `${window.location.origin}/hub/` },
    });
    setBusy(false);
    if (error) {
      setErr(/password/i.test(error.message) ? t.auth.weak : t.error);
      return;
    }
    try {
      sessionStorage.setItem("hub-owner-name", name.trim());
    } catch {
      /* the name is asked again on the next step */
    }
    // With email confirmation on, there is no session yet: say where to look.
    if (!data.session) setSent(true);
  };

  return (
    <AuthFrame title={t.auth.signUpTitle}>
      {sent ? (
        <p ref={doneRef} tabIndex={-1} role="status" className="m-0 text-[var(--text)] outline-none">
          {t.auth.checkEmail}
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">{t.required}</p>
          <Field label={t.auth.name} autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Field label={t.auth.email} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Field
            label={t.auth.password}
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD}
            hint={t.auth.passwordHint}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="m-0 text-[0.8125rem] text-[var(--text-mid)]">
            {t.auth.terms}{" "}
            <a href="/legal#data-protection" className="text-[var(--signal-text)] underline underline-offset-2">
              {t.auth.privacy}
            </a>
          </p>
          <Status message={err} tone="bad" />
          <Button type="submit" variant="primary" disabled={busy || !name.trim() || !email || !password}>
            {busy ? t.loading : t.auth.signUp}
          </Button>
          <p className="m-0 text-[0.875rem] text-[var(--text-mid)]">
            {t.auth.haveAccount}{" "}
            <Link to="/sign-in" className="text-[var(--signal-text)] underline underline-offset-2">
              {t.auth.signIn}
            </Link>
          </p>
        </form>
      )}
    </AuthFrame>
  );
}

export function ResetPassword() {
  const { t } = useHub();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await supabase().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/hub/update-password` });
    setBusy(false);
    // The same answer whether or not the account exists: no account probing.
    setMsg(t.auth.resetSent);
  };
  return (
    <AuthFrame title={t.auth.resetTitle}>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label={t.auth.email} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Status message={msg} />
        <Button type="submit" variant="primary" disabled={busy || !email}>
          {t.auth.resetSend}
        </Button>
        <Link to="/sign-in" className="text-[0.875rem] text-[var(--signal-text)] underline underline-offset-2">
          {t.back}
        </Link>
      </form>
    </AuthFrame>
  );
}

export function UpdatePassword() {
  const { t } = useHub();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad: boolean } | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD) {
      setMsg({ text: t.auth.weak, bad: true });
      return;
    }
    setBusy(true);
    const { error } = await supabase().auth.updateUser({ password });
    setBusy(false);
    if (error) setMsg({ text: t.error, bad: true });
    else {
      setMsg({ text: t.auth.passwordSet, bad: false });
      setTimeout(() => navigate("/"), 1200);
    }
  };
  return (
    <AuthFrame title={t.auth.setPassword}>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field
          label={t.auth.newPassword}
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD}
          hint={t.auth.passwordHint}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Status message={msg?.text ?? null} tone={msg?.bad ? "bad" : "neutral"} />
        <Button type="submit" variant="primary" disabled={busy || !password}>
          {t.auth.setPassword}
        </Button>
      </form>
    </AuthFrame>
  );
}
