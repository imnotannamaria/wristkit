import { RegistryFileBundle } from "@/components/docs/registry-file-bundle";
import { MdxContent } from "@/components/mdx-content";
import { type Doc, docs } from "@/lib/docs";
import {
  HANDLER_FILES,
  type RegistryFile,
  SQL_FILES,
  TODAY_ACTIVITY_CARD_FILES,
  loadRegistryFiles,
} from "@/lib/registry-files";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Only slugs from generateStaticParams exist; anything else is a hard 404
// instead of an on-demand render that would touch the filesystem at runtime.
export const dynamicParams = false;

interface Props {
  params: Promise<{ slug?: string[] }>;
}

function getDoc(slug: string[] | undefined): Doc | undefined {
  const path = slug && slug.length > 0 ? slug.join("/") : "";
  const target = path ? `docs/${path}` : "docs";
  return docs.find((doc) => doc.slug === target);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  const title = `${doc.title} · wristkit docs`;
  return {
    // `absolute` opts out of the root title.template so we don't double up
    // the suffix ("… · wristkit docs · wristkit").
    title: { absolute: title },
    description: doc.description,
    alternates: { canonical: `/${doc.slug}` },
    openGraph: {
      title,
      description: doc.description,
      url: `/${doc.slug}`,
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return docs.map((doc) => {
    const path = doc.slug.replace(/^docs\/?/, "");
    return { slug: path ? path.split("/") : [] };
  });
}

type Bundle = { title: string; description: string; files: RegistryFile[] };

async function loadBundlesForSlug(slug: string): Promise<Bundle[]> {
  if (slug === "docs/components/today-activity-card") {
    return [
      {
        title: "Files to copy",
        description: "Drop each file in its destination path. Copy with the button on the right.",
        files: await loadRegistryFiles(TODAY_ACTIVITY_CARD_FILES),
      },
    ];
  }
  if (slug === "docs/installation") {
    const [sql, handler, card] = await Promise.all([
      loadRegistryFiles(SQL_FILES),
      loadRegistryFiles(HANDLER_FILES),
      loadRegistryFiles(TODAY_ACTIVITY_CARD_FILES),
    ]);
    return [
      {
        title: "SQL migrations",
        description: "Run these files in order in the Supabase SQL editor.",
        files: sql,
      },
      {
        title: "Sync route",
        description: "Add this server route to your application.",
        files: handler,
      },
      {
        title: "Activity Card and data helpers",
        description: "Copy every file, including the stylesheet, to its destination.",
        files: card,
      },
    ];
  }
  return [];
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const bundles = await loadBundlesForSlug(doc.slug);

  return (
    <article>
      <header style={{ marginBottom: 48 }}>
        <div
          className="font-mono text-mono-xs text-[var(--fg-brand-text)]"
          style={{
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          · docs
        </div>
        <h1
          className="font-serif text-display-md md:text-display-lg"
          style={{ margin: "0 0 14px" }}
        >
          {doc.title}
        </h1>
        {doc.description && (
          <p
            className="font-sans text-body-md text-[var(--fg-secondary)]"
            style={{ lineHeight: 1.7, margin: 0, maxWidth: 560 }}
          >
            {doc.description}
          </p>
        )}
        <div
          style={{
            marginTop: 28,
            height: 1,
            backgroundImage: "linear-gradient(to right, var(--border-subtle) 50%, transparent 50%)",
            backgroundSize: "6px 1px",
            backgroundRepeat: "repeat-x",
          }}
        />
      </header>
      <MdxContent code={doc.body} />
      {bundles.map((b) => (
        <RegistryFileBundle
          key={b.title}
          title={b.title}
          description={b.description}
          files={b.files}
        />
      ))}
    </article>
  );
}
