import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Legal() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06060a] transition-colors duration-300">
      {/* Simple top nav */}
      <div className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/[0.07] bg-white/90 dark:bg-[#06060a]/90 ">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#2563F6] dark:hover:text-[#3CE7FC] transition-colors duration-200 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DEEV
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <img src={logo} alt="DEEV" className="h-7 w-auto object-contain" />
            <span className="text-lg font-extrabold tracking-tight text-[var(--signal)]">
              Deev
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2px] bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-6">
              Legal Information
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-slate-900 dark:text-white mb-4 tracking-tight">
              Terms &amp;{" "}
              <span className=" text-[var(--signal)]">
                Legal Notice
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Last updated: May 2025
            </p>
          </div>

          {/* Company Info Card */}
          <div className="rounded-lg bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.09] overflow-hidden mb-10 dark:shadow-none">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#3CE7FC] to-[#2563F6]" />
            <div className="p-8">
              <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-6">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Trade Name", value: "Deev" },
                  { label: "Legal Entity", value: "Lux VR States Sàrl-s." },
                  { label: "Directors", value: "FALCHERO Fabio & KETTEL Sven" },
                  { label: "Address", value: "17, rue de Sélange, L-4965 Clemency, Luxembourg" },
                  { label: "Email", value: "contact@deev.lu" },
                  { label: "Phone", value: "+352 691 786 002 / +352 691 388 887" },
                  { label: "VAT Number", value: "LU33936811" },
                  { label: "Trade Register", value: "B266033" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      {item.label}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

            <Section title="1. Services">
              <p>
                Deev (Lux VR States Sàrl-s.) provides digital agency services including but not limited to: web design
                and development, AI integration, digital marketing, e-commerce solutions, and related consulting.
                All services are subject to a separate service agreement between Deev and the client.
              </p>
            </Section>

            <Section title="2. Eligibility">
              <p>
                By engaging our services, you confirm that you are at least 18 years of age and have the legal capacity
                to enter into binding contracts. Businesses must be duly registered entities. Deev reserves the right
                to decline any project request at its sole discretion.
              </p>
            </Section>

            <Section title="3. Purchases &amp; Payment">
              <p>
                All prices are quoted in EUR and are exclusive of VAT unless otherwise stated. An initial deposit
                (typically 50%) is required before work commences. The remaining balance is due upon project
                completion or as defined in the project agreement. Invoices are payable within 14 days of issue.
                Late payments may incur interest charges in accordance with Luxembourg law.
              </p>
            </Section>

            <Section title="4. SME Digital &amp; SME AI Subsidies">
              <p>
                Eligible Luxembourg-based SMEs may benefit from government subsidies under the SME Digital and
                SME AI programmes, which can cover up to 70% of qualifying investment costs. Projects must fall
                within the eligible cost range (€3,000–€25,000). Deev can assist with the subsidy application
                process; however, approval is at the sole discretion of the relevant government body. Deev does not
                guarantee subsidy approval.
              </p>
            </Section>

            <Section title="5. Pricing &amp; Changes">
              <p>
                Deev reserves the right to update service pricing at any time. Price changes will not affect
                projects already under contract. Any scope changes or additions requested by the client after
                contract signing may result in additional charges, which will be agreed upon in writing before
                implementation.
              </p>
            </Section>

            <Section title="6. Intellectual Property">
              <p>
                Upon full and final payment, the client receives full ownership of all custom deliverables produced
                for their project. Deev retains the right to display the work in its portfolio unless otherwise
                agreed in writing. All third-party assets, libraries, or software used remain subject to their
                respective licenses.
              </p>
            </Section>

            <Section title="7. Cookies &amp; Tracking">
              <p>
                Our website uses essential cookies necessary for its operation, as well as optional analytics
                cookies to help us understand how visitors use the site. By continuing to use this website, you
                consent to our use of essential cookies. You may control optional cookies through your browser
                settings or our cookie preferences panel.
              </p>
              <p className="mt-3">
                For analytics we use Google Analytics 4 (Google Ireland Limited) with Google Consent Mode.
                Before you make a choice, and if you decline, the tag runs in a consent-denied state: no
                cookies are set and no identifier is stored on your device. In that state Google receives
                only a cookieless signal (including your IP address and browser type) which is used for
                aggregated, statistical measurement of page views.
              </p>
              <p className="mt-3">
                If you accept analytics cookies in our banner, analytics storage is enabled and Google
                Analytics sets cookies to measure page views and how visitors navigate the site. Advertising
                storage, ad personalisation and ad user data remain disabled at all times, we run no
                advertising products on this site. You can withdraw your consent at any time by clearing this
                site&rsquo;s data in your browser, which will show the consent banner again.
              </p>
            </Section>

            <Section title="8. Data Protection &amp; GDPR">
              <p>
                Deev processes personal data in accordance with Regulation (EU) 2016/679 (GDPR) and applicable
                Luxembourg data protection legislation. Personal data collected through this website or in the
                course of providing services is used solely for delivering our services, communicating with clients,
                and fulfilling legal obligations. Data is never sold to third parties.
              </p>
              <p className="mt-3">
                You have the right to access, correct, or request deletion of your personal data. To exercise these
                rights, contact us at{" "}
                <a href="mailto:contact@deev.lu" className="text-[#2563F6] dark:text-[#3CE7FC] hover:underline font-medium">
                  contact@deev.lu
                </a>
                . Data is retained only for as long as necessary to fulfill the purposes for which it was collected
                or as required by law.
              </p>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                Deev's total liability to any client arising from or in connection with a project shall not exceed
                the total fees paid by that client under the relevant project agreement. Deev is not liable for any
                indirect, consequential, or incidental damages. Nothing in these terms limits Deev's liability for
                fraud or gross negligence.
              </p>
            </Section>

            <Section title="10. Governing Law &amp; Jurisdiction">
              <p>
                These terms and any disputes arising from them shall be governed by and construed in accordance with
                the laws of the Grand Duchy of Luxembourg. Any disputes shall be subject to the exclusive
                jurisdiction of the courts of Luxembourg City.
              </p>
            </Section>

            <Section title="11. Contact">
              <p>For any questions regarding these terms, please contact:</p>
              <div className="mt-3 pl-4 border-l-2 border-[#3CE7FC]/50 text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-semibold">Lux VR States Sàrl-s. (Deev)</p>
                <p>17, rue de Sélange, L-4965 Clemency</p>
                <p>Grand Duchy of Luxembourg</p>
                <p>
                  <a href="mailto:contact@deev.lu" className="text-[#2563F6] dark:text-[#3CE7FC] hover:underline font-medium">
                    contact@deev.lu
                  </a>
                </p>
                <p>+352 691 786 002</p>
              </div>
            </Section>

          </div>

          {/* Back button */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/[0.07]">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-md font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "var(--signal)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to DEEV
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] p-8 dark:shadow-none">
      <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4 tracking-tight">{title}</h2>
      <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-[0.95rem]">{children}</div>
    </div>
  );
}
