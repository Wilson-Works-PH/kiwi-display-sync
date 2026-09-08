import { useEffect } from "react";
import "@fontsource-variable/material-symbols-rounded";
import "./c.css";
import { CFooter, Logo } from "./CSections";

const EFFECTIVE = "8 September 2026";
const COMPANY = "Kiwi Technologies";
const EMAIL = "info@kiwi.com.ph";

/**
 * /privacy — the public privacy policy the app stores require. The product is
 * "Kiwi Display Sync" (user, 2026-09-08; the CMS is live at cms.kiwi.com.ph). Everything here
 * was checked against the CMS backend (2026-09-08): the player's register /
 * heartbeat / screenshot payloads, the account fields, the audit log, and the
 * third-party services in package.json (AWS S3 + SES, MongoDB Atlas, MQTT).
 * If the apps start collecting something new, this page changes in the same
 * pull request.
 */
export default function PrivacyPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Privacy Policy — Kiwi";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="c-root antialiased">
      <header className="font-header sticky top-0 z-50 border-b border-plum-950/[0.06] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-8 lg:h-16">
          <a
            href="/"
            aria-label="Kiwi home"
            className="flex min-h-[44px] items-center"
          >
            <Logo />
          </a>
          <a
            href="/"
            className="flex min-h-[44px] items-center gap-1 text-[14px] font-semibold text-plum-950/70 hover:text-plum-950"
          >
            <span
              className="c-icon"
              style={{ fontSize: 18 }}
              aria-hidden="true"
            >
              arrow_back
            </span>
            Back to site
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-12 sm:px-8 lg:py-20">
        <p className="font-header text-[12px] font-bold uppercase tracking-[0.18em] text-leaf-600">
          Legal
        </p>
        <h1 className="mt-2 text-[34px] font-bold leading-[1.05] tracking-[-0.03em] text-plum-950 lg:text-[48px]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-[14px] text-plum-950/55">
          Effective {EFFECTIVE}
        </p>

        <div className="c-prose mt-8">
          <p>
            This policy explains what {COMPANY} (“Kiwi”, “we”) collects when you
            use Kiwi Display Sync, our digital signage platform, why we collect
            it, and the choices you have. It covers three things:
          </p>
          <ul>
            <li>
              <strong>The Kiwi Display Sync web app</strong> at cms.kiwi.com.ph,
              where teams manage screens, media, layouts and schedules.
            </li>
            <li>
              <strong>The Kiwi Display Sync app for Android</strong>, which runs
              on Kiwi displays and plays the content published from the web app
              (the “player”).
            </li>
            <li>
              <strong>This website</strong>, kiwi.com.ph and its pages.
            </li>
          </ul>
          <p>
            We process personal data in line with the Philippine Data Privacy
            Act of 2012 (Republic Act No. 10173) and its implementing rules.
          </p>

          <h2>Information we collect</h2>
          <h3>Account information (web app)</h3>
          <p>
            When an organisation administrator invites you, we create an account
            with your name and email address. We store your password as a salted
            hash, never in plain text. If you turn on two-factor authentication
            we store the data needed to verify your codes. We record when you
            last signed in and your account preferences, such as the interface
            theme.
          </p>
          <h3>Content you upload</h3>
          <p>
            Images, videos, PDFs, fonts and the layouts, campaigns and schedules
            you build are stored so they can be played on your organisation’s
            screens. This content belongs to your organisation. Do not upload
            personal data you do not have the right to display.
          </p>
          <h3>Activity and security records (web app)</h3>
          <p>
            The web app keeps an audit log of actions taken in a workspace, such
            as publishing a layout or authorising a display, with the account
            that performed them and the time. Sign-in sessions may record the
            browser and network address they were opened from, so that you can
            review and revoke them.
          </p>
          <h3>Device information (Android app on displays)</h3>
          <p>
            The Android app that runs on displays does not have user accounts
            and does not collect information about the people who look at a
            screen. It reports information about the display device itself so
            that operators can see it is online and healthy:
          </p>
          <ul>
            <li>
              a hardware identifier and the pairing code used to link the
              display to a workspace;
            </li>
            <li>
              device model, app version, Android version, screen size and
              language setting;
            </li>
            <li>
              network addresses of the device (local and public IP address, MAC
              address);
            </li>
            <li>
              storage used and available, and which published content version is
              ready;
            </li>
            <li>
              crash diagnostics: the type and message of the last crash and the
              start of its stack trace;
            </li>
            <li>
              periodic screenshots of what the display is currently showing, so
              operators can confirm the right content is on screen. These
              capture the screen’s own output only; the app does not use a
              camera or microphone.
            </li>
          </ul>
          <p>
            The Android app does not collect precise location, contacts, photos,
            or any data from other apps on the device, and it shows no
            advertising.
          </p>
          <h3>This website</h3>
          <p>
            The marketing site does not use analytics or advertising trackers
            and sets no cookies of its own. If you contact us through a form or
            email, we keep what you send us to reply.
          </p>

          <h2>How we use it</h2>
          <ul>
            <li>
              to provide the service: pairing displays, delivering content to
              them, and showing operators their status;
            </li>
            <li>
              to keep accounts secure: authentication, two-factor verification,
              session review and revocation;
            </li>
            <li>
              to diagnose problems: crash reports and health data from displays;
            </li>
            <li>
              to enforce plan limits and bill the organisation that subscribes;
            </li>
            <li>to respond when you contact us.</li>
          </ul>
          <p>
            Our legal bases are the contract with the organisation that
            subscribes to Kiwi, our legitimate interest in running a secure and
            reliable service, and consent where the law requires it.
          </p>

          <h2>Who we share it with</h2>
          <p>
            We do not sell personal data. We share it only with providers that
            run parts of the service for us:
          </p>
          <ul>
            <li>
              cloud hosting and object storage for uploaded media (Amazon Web
              Services);
            </li>
            <li>a managed database service (MongoDB Atlas);</li>
            <li>
              transactional email delivery for invitations and security messages
              (Amazon SES);
            </li>
            <li>
              a messaging broker that carries commands between the CMS and
              displays.
            </li>
          </ul>
          <p>
            These providers process data on our instructions. Some of them store
            data outside the Philippines; where they do, we rely on their
            contractual safeguards. We may also disclose data when the law
            requires it.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Account data is kept while the account exists and deleted or
            anonymised when the account or the organisation’s subscription ends,
            unless we must keep it longer for legal or billing reasons. Display
            health data and screenshots are overwritten as new reports arrive.
            Audit logs are kept for the life of the workspace so administrators
            can review what happened.
          </p>

          <h2>How we protect it</h2>
          <p>
            Data travels over encrypted connections. Passwords are hashed.
            Access inside a workspace is controlled by roles and folder
            permissions set by your administrator, and two-factor authentication
            is available to every account.
          </p>

          <h2>Your rights</h2>
          <p>
            Under the Data Privacy Act you may ask to access, correct or delete
            your personal data, to object to or restrict its processing, and to
            receive a copy of it. Account holders can update their name and
            security settings in the web app themselves; for anything else,
            write to us at the address below. You may also lodge a complaint
            with the National Privacy Commission of the Philippines.
          </p>

          <h2>Children</h2>
          <p>
            Kiwi Display Sync is a business service. It is not directed at
            children and we do not knowingly collect personal data from anyone
            under 18.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            When we change this policy we update the effective date above.
            Material changes are also announced to workspace administrators in
            the web app.
          </p>

          <h2>Contact</h2>
          <p>
            {COMPANY}
            <br />
            Jafer Place, 19 Eisenhower St, San Juan City, 1502 Metro Manila,
            Philippines
            <br />
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · +63 969 170 2299
          </p>
        </div>
      </main>

      <CFooter />
    </div>
  );
}
