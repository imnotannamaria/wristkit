import { notFound } from "next/navigation";
import { docs } from "@/.velite";
import { MdxContent } from "@/components/mdx-content";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

function getDoc(slug: string[] | undefined) {
  const path = slug && slug.length > 0 ? slug.join("/") : "";
  const target = path ? `docs/${path}` : "docs";
  return docs.find((doc) => doc.slug === target);
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
      <header style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 48,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "0 0 12px",
            color: "#f5f5f5",
          }}
        >
          {doc.title}
        </h1>
        {doc.description && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "#555",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {doc.description}
          </p>
        )}
        <div
          style={{
            marginTop: 24,
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
