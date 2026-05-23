import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(13,13,15,0.9)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  color: "#e8e8ea",
                }}
              >
                space<span style={{ color: "#7c6ef5" }}>match</span>
              </span>
            </Link>
            <p style={{ marginTop: 4, fontSize: 12, color: "#ffffff" }}>
              AI-powered office search for startups
            </p>
          </div>

          <nav style={{ display: "flex", gap: 24 }}>
            {[
              { href: "/listings", label: "Browse" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: 13, color: "#ffffff", textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 20,
            fontSize: 11,
            color: "#4a4a58",
          }}
        >
          © 2026 spacematch. Built with Next.js, tRPC, and Drizzle.
        </div>
      </div>
    </footer>
  );
}
