import Link from "next/link";

export function DocsNextSteps() {
  return (
    <div className="docs-next-steps">
      <Link href="/docs/installation" className="docs-guide-link focus-ring">
        <span>01 / Get connected ↗</span>
        <strong>Make room on your site.</strong>
        <p>Set up the database, sync route and your first Activity Card.</p>
      </Link>
      <Link href="/docs/components/today-activity-card" className="docs-guide-link focus-ring">
        <span>02 / Make it yours ↗</span>
        <strong>Meet every state.</strong>
        <p>Explore the card, configure your goals and find your palette.</p>
      </Link>
    </div>
  );
}
