import { useEffect } from "react";
import "@fontsource-variable/material-symbols-rounded";
import "./c.css";
import { CFooter, Logo } from "./CSections";

const EFFECTIVE = "8 September 2026";
const SUPERSEDES = "3 September 2026";
const COMPANY = "Kiwi Technologies";
const EMAIL = "info@kiwi.com.ph";
const DPO_EMAIL = "dpo@kiwi.com.ph";
const PHONE = "+63 969 170 2299";
const DELETE_REQUEST_URL = "https://kiwi.com.ph/contact/";
const NPC_REGISTRATION = "PIC-005-743-2026";

/**
 * /privacy — the public privacy policy the app stores require. The product is
 * "Kiwi Display Sync" (user, 2026-09-08; the CMS is live at cms.kiwi.com.ph).
 *
 * MERGED VERSION (2026-09-08): the CMS team's revised draft ("Kiwi Display Sync
 * Privacy Policy — Revised Draft, September 8, 2026") supplied the legal
 * scaffolding — DPO contact, lawful bases and consent mechanics, breach
 * notification, retention periods, deletion procedure, the full DPA rights list,
 * marketing, permissions, NPC registration, governing law. The data inventory,
 * the description of the Android app, the processor list and the cross-border
 * note come from this site's earlier page, which was checked against the CMS
 * backend (player register / heartbeat / screenshot payloads, account fields,
 * audit log, the third-party services in use: AWS S3 + SES, MongoDB Atlas, MQTT).
 *
 * Still to be confirmed by the CMS team before publishing (their draft asserts
 * these; the code can't verify them):
 *   - the DPO mailbox (dpo@kiwi.com.ph) is live and monitored;
 *   - the NPC registration wording — their draft says the registration is
 *     "under Wilson Works Trading Inc."; the registered entity must be the
 *     actual personal information controller;
 *   - the 30-day deletion and 6-month log retention commitments — nothing in
 *     the product automates them yet, so a process must own them;
 *   - the deletion path: there is NO in-app or self-serve account deletion in
 *     the web app or the Android player (their draft described "Settings >
 *     Account > Delete Account", which does not exist), so this page offers
 *     the email / web request route only.
 * If the apps start collecting something new, this page changes in the same
 * pull request.
 */
export default function PrivacyPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Privacy Policy — Kiwi Display Sync";
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
          Kiwi Display Sync Privacy Policy
        </h1>
        <p className="mt-3 text-[14px] text-plum-950/55">
          Effective {EFFECTIVE} · Supersedes the version dated {SUPERSEDES}
        </p>

        <div className="c-prose mt-8">
          <p>
            This Privacy Policy explains how {COMPANY} (“Kiwi”, “we”, “us” or
            “our”) collects, uses, shares and protects information when you use
            Kiwi Display Sync, our digital signage platform. It covers three
            things:
          </p>
          <ul>
            <li>
              <strong>The Kiwi Display Sync web app</strong> at cms.kiwi.com.ph
              (“Kiwi CMS”), where teams manage screens, media, layouts and
              schedules.
            </li>
            <li>
              <strong>The Kiwi Display Sync app for Android</strong>, available
              on Google Play, which runs on display hardware and plays the
              content published from the web app (the “player”). It has no user
              accounts of its own; it is paired to a workspace with a claim code.
            </li>
            <li>
              <strong>This website</strong>, kiwi.com.ph and its pages.
            </li>
          </ul>
          <p>
            We process personal data in line with the Philippine Data Privacy
            Act of 2012 (Republic Act No. 10173, the “DPA”) and its Implementing
            Rules and Regulations. By using the App, the web app or this
            website you agree to the practices described here; where the law
            requires your affirmative consent, we obtain it separately as
            described in Section 4.
          </p>

          <h2>1. Who we are and how to contact us</h2>
          <p>
            Kiwi Display Sync is developed and published by {COMPANY}, based in
            the Philippines.
          </p>
          <ul>
            <li>
              Address: Jafer Place, 19 Eisenhower St, San Juan City, 1502 Metro
              Manila, Philippines
            </li>
            <li>
              Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>Phone: {PHONE}</li>
            <li>Office hours: Monday to Friday, 9:00 AM – 5:00 PM</li>
          </ul>

          <h2>2. Data Protection Officer</h2>
          <p>
            Our Data Protection Officer handles data subject requests and any
            concern that general support cannot resolve, including complaints
            about how your information is handled:{" "}
            <a href={`mailto:${DPO_EMAIL}`}>{DPO_EMAIL}</a>.
          </p>

          <h2>3. Information we collect</h2>
          <h3>Account information (web app)</h3>
          <p>
            When an organisation administrator invites you, we create an account
            with your name and email address, and any business details your
            organisation records about its workspace. We store your password as
            a salted hash, never in plain text. If you turn on two-factor
            authentication we store the data needed to verify your codes. We
            record when you last signed in and your account preferences, such as
            the interface theme.
          </p>
          <h3>Content you upload</h3>
          <p>
            Images, videos, GIFs, PDFs, fonts and the layouts, campaigns and
            schedules you build are stored so they can be played on your
            organisation’s screens. This content belongs to your organisation.
            Do not upload personal data you do not have the right to display.
          </p>
          <h3>Activity and security records (web app)</h3>
          <p>
            The web app keeps an audit log of actions taken in a workspace, such
            as publishing a layout or authorising a display, with the account
            that performed them and the time. Sign-in sessions record the
            browser and network address they were opened from, so that you can
            review and revoke them.
          </p>
          <h3>Device information (Android app on displays)</h3>
          <p>
            The player does not have user accounts and does not collect
            information about the people who look at a screen. It reports
            information about the display device itself so that operators can
            see it is online and healthy:
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
            The player does not collect precise location, contacts, photos or
            any data from other apps on the device, and it shows no advertising.
          </p>
          <h3>Support communications</h3>
          <p>
            When you contact us for help we keep what you send us — including
            screenshots or files you choose to share — so that we can reply and
            resolve the issue.
          </p>
          <h3>This website</h3>
          <p>
            The marketing site does not use analytics or advertising trackers
            and sets no cookies of its own. If you contact us through a form or
            email, we keep what you send us to reply.
          </p>
          <p>
            We collect this information directly from you when an account is
            created for you, when you upload content or contact support, and
            automatically from displays as they connect and sync with the web
            app.
          </p>

          <h2>4. Basis for processing and your consent</h2>
          <p>
            We process personal data on one or more of these bases: the
            performance of our contract with the organisation that subscribes
            to Kiwi (providing the web app, the player and related services);
            our legitimate interests in running a secure and reliable service
            and improving it; compliance with legal obligations; and your
            consent where the law requires it.
          </p>
          <p>
            Where consent is our basis — for example, before support staff
            access your uploaded images, videos or device logs beyond what basic
            troubleshooting needs — we ask for it as a specific, affirmative
            step, not as a condition buried in general terms. You may withdraw
            consent at any time using the contact details in Section 1; doing so
            may limit our ability to provide the support or features that depend
            on that processing.
          </p>

          <h2>5. How we use your information</h2>
          <ul>
            <li>
              to provide, operate and maintain the service: pairing displays,
              delivering content to them and showing operators their status;
            </li>
            <li>
              to keep accounts secure: authentication, two-factor verification,
              session review and revocation, and preventing unauthorised access;
            </li>
            <li>
              to diagnose problems: crash reports and health data from displays;
            </li>
            <li>
              to enforce plan limits and bill the organisation that subscribes;
            </li>
            <li>to improve performance, features and the user experience;</li>
            <li>
              to communicate service updates, billing notices and support
              responses, and to respond when you contact us.
            </li>
          </ul>

          <h2>6. How we share your information</h2>
          <p>
            We do not sell personal data. We share it only in these cases:
          </p>
          <ul>
            <li>
              <strong>Within Kiwi’s own services</strong> — account, content and
              device data move between the web app and the player, since both
              are operated by {COMPANY} to run the same displays.
            </li>
            <li>
              <strong>Service providers</strong> that run parts of the service
              on our instructions and under confidentiality obligations: cloud
              hosting, object storage for uploaded media and transactional
              email delivery for invitations and security messages (Amazon Web
              Services); a managed database service (MongoDB Atlas); and a
              messaging broker that carries commands between the web app and
              displays. Some of these providers store data outside the
              Philippines; where they do, we rely on their contractual
              safeguards.
            </li>
            <li>
              <strong>Support access</strong> — our authorised personnel may
              access uploaded images and videos and device logs strictly for
              support and troubleshooting, with your consent as described in
              Section 4.
            </li>
            <li>
              <strong>Legal requirements</strong> — when required by law,
              regulation or valid legal process.
            </li>
            <li>
              <strong>Business transfers</strong> — in a merger, acquisition or
              asset sale, subject to the continued protection of your data.
            </li>
          </ul>

          <h2>7. Data storage and security</h2>
          <p>
            Your data is protected by technical and organisational safeguards
            appropriate to its sensitivity:
          </p>
          <ul>
            <li>
              data travels over encrypted connections, and our storage providers
              encrypt data at rest;
            </li>
            <li>passwords are stored only as salted hashes;</li>
            <li>
              access inside a workspace is controlled by roles and folder
              permissions set by your administrator, and two-factor
              authentication is available to every account;
            </li>
            <li>
              staff access to personal data is limited to a need-to-know basis,
              and the audit log records actions taken in each workspace.
            </li>
          </ul>
          <p>
            No method of transmission or storage is completely secure, and we
            cannot guarantee absolute security.
          </p>

          <h2>8. Data retention</h2>
          <p>
            We keep your account information for as long as your account
            remains active. Once an account is closed, we delete or anonymise
            its personal data within 30 days, unless we must keep it longer to
            comply with a legal obligation, resolve a dispute or enforce our
            agreements. Display health data and screenshots are overwritten as
            new reports arrive. Audit logs are kept for the life of the
            workspace so administrators can review what happened. Support
            communications and diagnostic logs are kept for no longer than six
            months from creation.
          </p>

          <h2>9. Account and data deletion</h2>
          <p>
            You can ask for your account and its associated data to be deleted
            at any time:
          </p>
          <ul>
            <li>
              email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with your account
              details and “Delete my account” in the subject line; or
            </li>
            <li>
              send the request through{" "}
              <a href={DELETE_REQUEST_URL} target="_blank" rel="noreferrer">
                {DELETE_REQUEST_URL.replace("https://", "")}
              </a>
              .
            </li>
          </ul>
          <p>
            We delete your account and associated personal data — not merely
            deactivate it — within 30 days of a verified request, except for
            data we are required to retain for security, fraud prevention or
            legal compliance, which we keep only as long as those reasons apply.
            If your organisation has a paid subscription, billing may need to be
            cancelled before deletion completes; we will tell you if that
            applies. Removing a display from a workspace deletes the device
            record the player created for it.
          </p>

          <h2>10. Your rights</h2>
          <p>Under the DPA you have the right to:</p>
          <ul>
            <li>
              be informed that your personal data will be, is being or has been
              processed;
            </li>
            <li>access the personal data we hold about you;</li>
            <li>request correction of inaccurate data;</li>
            <li>request deletion or blocking of your data;</li>
            <li>
              object to processing, including processing for direct marketing;
            </li>
            <li>
              receive a copy of your data in a portable, commonly used format;
            </li>
            <li>withdraw consent, where consent is the basis for processing;</li>
            <li>
              be indemnified for damages sustained due to unlawful processing of
              your data;
            </li>
            <li>
              file a complaint with the National Privacy Commission if you
              believe your rights have been violated.
            </li>
          </ul>
          <p>
            Account holders can update their name and security settings in the
            web app themselves. For anything else, contact us or our Data
            Protection Officer using the details in Sections 1 and 2.
          </p>

          <h2>11. Marketing communications</h2>
          <p>
            We only send marketing or promotional information if you ask us to,
            for example by emailing or calling us to request it. You may opt out
            at any time using the contact details in Section 1, without
            affecting your use of the service.
          </p>

          <h2>12. Data breach notification</h2>
          <p>
            If we become aware of a security incident that compromises your
            personal data, we will assess the risk of harm and, where the law
            requires it, notify the National Privacy Commission and affected
            users within 72 hours of learning of the breach, or as soon as
            practicable thereafter. The notification will describe the nature of
            the incident, the data involved and the steps we are taking.
          </p>

          <h2>13. Children’s privacy</h2>
          <p>
            Kiwi Display Sync is a business tool for managing digital displays
            and is not directed to children. We do not knowingly collect
            personal data from anyone under 18. If we learn that a child has
            provided personal data we will take reasonable steps to delete it;
            parents or guardians may contact us using the details in Section 1.
          </p>

          <h2>14. Permissions used by the Android app</h2>
          <p>
            The player requests only the device permissions its core features
            need: network access to pair with the workspace and sync content,
            and storage to cache the content it plays. The screenshots it
            uploads are of its own output and use no camera, microphone or
            location permission. We do not use these permissions to collect data
            beyond what the service requires.
          </p>

          <h2>15. Regulatory compliance</h2>
          <p>
            {COMPANY} is registered under Wilson Works Trading Inc. with the
            National Privacy Commission (NPC), Registration No.{" "}
            {NPC_REGISTRATION}, in compliance with the Data Privacy Act of 2012
            (RA 10173) and its Implementing Rules and Regulations.
          </p>

          <h2>16. Changes to this policy</h2>
          <p>
            When we change this policy we update the effective date above.
            Where changes materially affect your rights, we also announce them
            to workspace administrators in the web app and notify active account
            holders by email before the change takes effect. Continued use of
            the service after a change takes effect constitutes acceptance of
            the revised policy.
          </p>
          <p>
            This Privacy Policy is governed by the laws of the Republic of the
            Philippines.
          </p>
        </div>
      </main>

      <CFooter />
    </div>
  );
}
