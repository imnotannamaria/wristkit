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

/** A trailing newline ends the last line; it doesn't start another. */
function lineCount(content: string): number {
  return content.replace(/\n$/, "").split("\n").length;
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
    <section className="docs-file-bundle">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <Tabs defaultValue={first.source}>
        <TabsList className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)]">
          {files.map((f) => (
            <TabsTrigger key={f.source} value={f.source}>
              {basename(f.source)}
            </TabsTrigger>
          ))}
        </TabsList>
        {files.map((f) => (
          // forceMount keeps every file in the server HTML, so the page reads in
          // full without JavaScript; the layout's <noscript> style reveals them.
          <TabsContent
            key={f.source}
            value={f.source}
            forceMount
            className="data-[state=inactive]:hidden"
            style={{ marginTop: 12 }}
          >
            <CodeBlock
              code={f.content}
              filename={f.dest}
              language={f.language}
              meta={`${lineCount(f.content)} lines`}
            />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
