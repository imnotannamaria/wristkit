import { MdxContent } from "@/components/mdx-content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Doc } from "velite-data";
import { docs } from "velite-data";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

function getDoc(slug: string[] | undefined) {
  const path = slug && slug.length > 0 ? slug.join("/") : "";
  const target = path ? `docs/${path}` : "docs";
  return (docs as Doc[]).find((doc) => doc.slug === target);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return {
    title: `${doc.title} — wristkit docs`,
    description: doc.description,
  };
}

export function generateStaticParams() {
  return (docs as Doc[]).map((doc) => {
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
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#3a3a3a",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          ⎯⎯ docs
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 48,
            fontWeight: 500,
            letterSpacing: "-0.03em",
            margin: "0 0 14px",
            color: "#f5f5f5",
            lineHeight: 1.05,
          }}
        >
          {doc.title}
        </h1>
        {doc.description && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "#777",
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 560,
            }}
          >
            {doc.description}
          </p>
        )}
        <div
          style={{
            marginTop: 28,
            height: 1,
            backgroundImage: "linear-gradient(to right, #1f1f1f 50%, transparent 50%)",
            backgroundSize: "6px 1px",
            backgroundRepeat: "repeat-x",
          }}
        />
      </header>
      <MdxContent code={doc.body} />
    </article>
  );
}
