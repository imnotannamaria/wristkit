"use client";

import { CodeBlock } from "@/components/entrepta/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/entrepta/tabs";
import type { RegistryFile } from "@/lib/registry-files";

interface Props {
  /** Section title shown above the tab strip. */
  title: string;
  /** Optional intro line under the title. */
  description?: string;
  files: RegistryFile[];
}

function basename(p: string): string {
  const last = p.split("/").pop();
  return last ?? p;
}

/**
 * Tabs and destinations both want to display the file name (e.g. 0001_initial.sql)
 * but the dest can repeat across files (two SQLs that go to the same "Supabase SQL
 * Editor"). The unique key is the source path, which always points to a different
 * file on disk.
 */
export function RegistryFileBundle({ title, description, files }: Props) {
  if (files.length === 0) return null;
  const first = files[0];
  if (!first) return null;

  return (
    <section style={{ margin: "32px 0 48px" }}>
      <h3
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--fg-brand)",
          margin: "0 0 8px",
        }}
      >
        · {title}
      </h3>
      {description && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--fg-secondary)",
            margin: "0 0 18px",
          }}
        >
          {description}
        </p>
      )}
      <Tabs defaultValue={first.source}>
        <TabsList>
          {files.map((f) => (
            <TabsTrigger key={f.source} value={f.source}>
              {basename(f.source)}
            </TabsTrigger>
          ))}
        </TabsList>
        {files.map((f) => (
          <TabsContent key={f.source} value={f.source} style={{ marginTop: 12 }}>
            <CodeBlock
              code={f.content}
              filename={f.dest}
              language={f.language}
              meta={`${f.content.split("\n").length} lines`}
            />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
