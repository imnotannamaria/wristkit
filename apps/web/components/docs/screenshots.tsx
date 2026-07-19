import Image from "next/image";

type Shot = {
  /** Absolute path under /public, e.g. "/screenshots/shortcut-1.jpeg". */
  src: string;
  alt: string;
  /** Short caption shown under the phone screenshot. */
  caption?: string;
};

/**
 * Horizontal strip of portrait phone screenshots for the docs. Each shot keeps
 * its 588×1280 aspect ratio; the row scrolls sideways on narrow screens instead
 * of shrinking the images past readability.
 */
export function Screenshots({ items }: { items: Shot[] }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        overflowX: "auto",
        padding: "4px 0 12px",
        margin: "0 0 28px",
      }}
    >
      {items.map((shot) => (
        <figure
          key={shot.src}
          style={{
            flex: "0 0 auto",
            width: 190,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            width={588}
            height={1280}
            sizes="190px"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: 14,
              border: "1px solid var(--border-subtle)",
            }}
          />
          {shot.caption && (
            <figcaption
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 1.5,
                color: "var(--fg-muted)",
                textAlign: "center",
              }}
            >
              {shot.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
