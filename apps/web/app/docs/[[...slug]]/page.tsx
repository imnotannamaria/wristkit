import { RegistryFileBundle } from "@/components/docs/registry-file-bundle";
import { MdxContent } from "@/components/mdx-content";
import { type Doc, docs } from "@/lib/docs";
import {
  type RegistryFile,
  TODAY_ACTIVITY_CARD_FILES,
  loadRegistryFiles,
} from "@/lib/registry-files";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
    title,
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
          className="t-mono-xs t-brand"
          style={{
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          · docs
        </div>
        <h1 className="t-display-lg" style={{ margin: "0 0 14px" }}>
          {doc.title}
        </h1>
        {doc.description && (
          <p
            className="t-body-md t-secondary"
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
