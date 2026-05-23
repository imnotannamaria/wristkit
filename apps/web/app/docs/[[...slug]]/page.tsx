import { MdxContent } from "@/components/mdx-content";
import { type Doc, docs } from "@/lib/docs";
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
  return {
    title: `${doc.title} · wristkit docs`,
    description: doc.description,
  };
}

export function generateStaticParams() {
  return docs.map((doc) => {
    const path = doc.slug.replace(/^docs\/?/, "");
    return { slug: path ? path.split("/") : [] };
  });
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

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
    </article>
  );
}
