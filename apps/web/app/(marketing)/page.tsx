import { ArrowLink } from "@/components/entrepta/arrow-link";
import { buttonVariants } from "@/components/entrepta/button-variants";
import { Card, CardContent, CardHeader, CardLabel, CardTitle } from "@/components/entrepta/card";
import { Reveal } from "@/components/entrepta/reveal";
import { SectHead } from "@/components/entrepta/sect-head";
import { TypeIn } from "@/components/entrepta/type-in";
import { ActivityPreview } from "@/components/home/activity-preview";
import { HeroIdePreview } from "@/components/home/hero-ide-preview";
import { WristKitMark } from "@/components/mark";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  HeartbeatIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  WatchIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const FEATURES = [
  {
    icon: HeartbeatIcon,
    label: "01 / Your activity",
    title: "A little more you.",
    text: "Move, exercise and steps. A small window into your day, right alongside the things you make.",
  },
  {
    icon: ShieldCheckIcon,
    label: "02 / Your data",
    title: "Yours, all the way.",
    text: "Your iPhone sends activity straight to your own database. Wristkit never receives your health data.",
  },
  {
    icon: SlidersHorizontalIcon,
    label: "03 / Your style",
    title: "Make yourself at home.",
    text: "Six themes. Light and dark. Source code you can shape to fit your corner of the internet.",
  },
];

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <Reveal>
              <p className="eyebrow">
                <span className="live-dot" aria-hidden /> From your wrist. To your website.
              </p>
            </Reveal>
            <h1
              id="hero-title"
              className="hero-title font-serif text-display-lg xl:text-display-xl"
            >
              Apple Health,
              <br />
              <TypeIn text="with a little" by="word" />
              <br />
              <TypeIn text="personality." emphasis="personality." by="word" delay={0.15} />
            </h1>
            <Reveal delay={0.12}>
              <p className="hero-description">
                Your daily movement deserves a place on your site. Meet the Activity Card: three
                familiar metrics, beautifully at home on the web.
              </p>
              <div className="hero-actions">
                <Link href="/docs/installation" className={buttonVariants({ size: "lg" })}>
                  Add it to your site <ArrowUpRightIcon size={18} aria-hidden />
                </Link>
                <ArrowLink href="#activity">Take a closer look</ArrowLink>
              </div>
              <p className="hero-footnote">Open source · React + Next.js · Your own database</p>
            </Reveal>
          </div>
          <Reveal delay={0.18} className="hero-object">
            <div className="hero-orbit" aria-hidden />
            <div className="hero-object-label">
              <WatchIcon size={16} aria-hidden /> Made for life beyond the screen.
            </div>
            <ActivityPreview />
            <div className="hero-object-signature">
              <span aria-hidden>↳</span> a good day, in a small card
            </div>
          </Reveal>
        </section>

        <section className="feature-strip" aria-label="About Wristkit">
          <div className="container feature-grid">
            {FEATURES.map(({ icon: Icon, label, title, text }, index) => (
              <Reveal key={label} index={index}>
                <div className="feature">
                  <div className="feature-label">
                    <Icon size={19} aria-hidden />
                    <span>{label}</span>
                  </div>
                  <h2 className="font-serif text-heading-lg">{title}</h2>
                  <p>{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="activity" className="container section-space" aria-labelledby="activity-title">
          <SectHead as="span" cmd="the activity card" meta="01 / component" />
          <div className="section-heading">
            <Reveal>
              <h2 id="activity-title" className="font-serif text-display-md md:text-display-lg">
                A day in motion.
                <br />
                <em className="text-[var(--fg-brand)]">Every state considered.</em>
              </h2>
            </Reveal>
            <p>
              Fresh numbers, a quiet day, or a missed sync. The card always tells you what it knows.
              Try the five states in the preview above.
            </p>
          </div>
          <div className="detail-grid">
            <Reveal>
              <Card size="xl">
                <CardHeader>
                  <CardLabel>Three familiar metrics</CardLabel>
                </CardHeader>
                <CardTitle>Movement, at a glance.</CardTitle>
                <CardContent>
                  <p className="font-sans text-body-lg text-[var(--fg-secondary)]">
                    Active calories, exercise minutes and steps, with progress toward the goals you
                    configure. Clear numbers accompany every ring.
                  </p>
                  <div className="metric-key">
                    <span>
                      <i className="metric-move" />
                      Move · kcal
                    </span>
                    <span>
                      <i className="metric-exercise" />
                      Exercise · min
                    </span>
                    <span>
                      <i className="metric-steps" />
                      Steps
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal index={1}>
              <Card size="xl">
                <CardHeader>
                  <CardLabel>Designed to belong</CardLabel>
                </CardHeader>
                <CardTitle>Your palette. Your place.</CardTitle>
                <CardContent>
                  <p className="font-sans text-body-lg text-[var(--fg-secondary)]">
                    Choose a theme from the switcher in the corner. The whole site follows along,
                    including the card. Your preference stays with you.
                  </p>
                  <div className="theme-palette" role="img" aria-label="Six color themes">
                    <span data-swatch="entrepta" />
                    <span data-swatch="blossom" />
                    <span data-swatch="marmalade" />
                    <span data-swatch="julia" />
                    <span data-swatch="ivy" />
                    <span data-swatch="bosco" />
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
          <ArrowLink asChild className="mt-8">
            <Link href="/docs/components/today-activity-card">Explore the Activity Card</Link>
          </ArrowLink>
        </section>

        <section
          id="how-it-works"
          className="container section-space install-section"
          aria-labelledby="setup-title"
        >
          <SectHead as="span" cmd="from wrist to web" meta="02 / how it works" />
          <div className="section-heading">
            <Reveal>
              <h2 id="setup-title" className="font-serif text-display-md md:text-display-lg">
                A small connection.
                <br />
                <em className="text-[var(--fg-brand)]">A personal touch.</em>
              </h2>
            </Reveal>
            <p>
              Wristkit is currently a kit for your own Next.js project. Bring a Supabase database
              and connect your iPhone with an iOS Shortcut.
            </p>
          </div>
          <div className="setup-grid">
            <ol className="setup-steps">
              {[
                {
                  n: "01",
                  title: "Make room on your site",
                  body: "Copy the component and sync route. Add the database tables using the SQL in the docs.",
                  href: "/docs/installation",
                },
                {
                  n: "02",
                  title: "Connect your iPhone",
                  body: "Install the Shortcut, add your endpoint and API key, then run your first sync.",
                  href: "/docs/shortcut-setup",
                },
                {
                  n: "03",
                  title: "Give your day a home",
                  body: "Render the card on your site. Set an automation in Shortcuts to keep your activity updated.",
                  href: "/docs/components/today-activity-card",
                },
              ].map(({ n, title, body, href }) => (
                <li key={n}>
                  <span className="step-number" aria-hidden>
                    {n}
                  </span>
                  <div>
                    <h3 className="font-serif text-heading-lg">{title}</h3>
                    <p>{body}</p>
                    <ArrowLink asChild>
                      <Link href={href}>Read the guide</Link>
                    </ArrowLink>
                  </div>
                </li>
              ))}
            </ol>
            <Reveal>
              <HeroIdePreview />
            </Reveal>
          </div>
        </section>

        <section className="container closing-section">
          <Reveal>
            <div className="closing-card">
              <WristKitMark size={48} />
              <h2 className="font-serif text-display-md md:text-display-lg">
                A little activity.
                <br />
                <em>A lot of personality.</em>
              </h2>
              <Link href="/docs/installation" className={buttonVariants({ size: "lg" })}>
                Make it yours <ArrowRightIcon size={18} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
