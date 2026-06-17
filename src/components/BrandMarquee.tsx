import React from "react";

// ── SVG Logo components ─────────────────────────────────────────

const ToyotaLogo = () => (
    <svg width="34" height="22" viewBox="0 0 34 22" fill="none" aria-hidden="true">
        <ellipse cx="17" cy="11" rx="16" ry="10.5" stroke="#EB0A1E" strokeWidth="1.8" />
        <ellipse cx="17" cy="11" rx="6.5" ry="10.5" stroke="#EB0A1E" strokeWidth="1.8" />
        <ellipse cx="17" cy="6" rx="10" ry="4.2" stroke="#EB0A1E" strokeWidth="1.8" />
    </svg>
);

const BMWLogo = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="10" fill="white" />
        <path d="M11,1 A10,10 0 0,1 21,11 L11,11 Z" fill="#0066B1" />
        <path d="M11,21 A10,10 0 0,1 1,11 L11,11 Z" fill="#0066B1" />
        <circle cx="11" cy="11" r="10" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
        <line x1="11" y1="1" x2="11" y2="21" stroke="#1A1A1A" strokeWidth="1.2" />
        <line x1="1" y1="11" x2="21" y2="11" stroke="#1A1A1A" strokeWidth="1.2" />
    </svg>
);

const MercedesLogo = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="10" fill="none" stroke="#767676" strokeWidth="1.5" />
        <line x1="11" y1="2" x2="11" y2="11" stroke="#767676" strokeWidth="2" strokeLinecap="round" />
        <line x1="11" y1="11" x2="19.66" y2="15.5" stroke="#767676" strokeWidth="2" strokeLinecap="round" />
        <line x1="11" y1="11" x2="2.34" y2="15.5" stroke="#767676" strokeWidth="2" strokeLinecap="round" />
        <circle cx="11" cy="11" r="1.5" fill="#767676" />
    </svg>
);

const AudiLogo = () => (
    <svg width="42" height="16" viewBox="0 0 42 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="8" r="6.5" stroke="#888" strokeWidth="1.5" />
        <circle cx="16" cy="8" r="6.5" stroke="#888" strokeWidth="1.5" />
        <circle cx="25" cy="8" r="6.5" stroke="#888" strokeWidth="1.5" />
        <circle cx="34" cy="8" r="6.5" stroke="#888" strokeWidth="1.5" />
    </svg>
);

const TeslaLogo = () => (
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" aria-hidden="true">
        <path d="M1,4 Q3,1 6,2 Q11,0.5 16,2 Q19,1 21,4" stroke="#E31937" strokeWidth="2" strokeLinecap="round" />
        <path d="M1,4 L4,7" stroke="#E31937" strokeWidth="2" strokeLinecap="round" />
        <path d="M21,4 L18,7" stroke="#E31937" strokeWidth="2" strokeLinecap="round" />
        <line x1="11" y1="1.5" x2="11" y2="23.5" stroke="#E31937" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const VolkswagenLogo = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="10.5" fill="#003189" />
        <path d="M7.5,5 L11,12 L14.5,5" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M5,12 L8,17.5 L11,13 L14,17.5 L17,12" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
);

const HondaLogo = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <rect x="1" y="1" width="20" height="20" rx="4" fill="#CC0000" />
        <line x1="6.5" y1="5.5" x2="6.5" y2="16.5" stroke="white" strokeWidth="2.5" strokeLinecap="butt" />
        <line x1="15.5" y1="5.5" x2="15.5" y2="16.5" stroke="white" strokeWidth="2.5" strokeLinecap="butt" />
        <line x1="6.5" y1="11" x2="15.5" y2="11" stroke="white" strokeWidth="2.5" strokeLinecap="butt" />
    </svg>
);

const ChevroletLogo = () => (
    <svg width="44" height="16" viewBox="0 0 44 16" aria-hidden="true">
        {/* Bowtie shape: two rects joined by a narrow center connector */}
        <path
            d="M2,1 C0,1 0,1 0,3 L0,13 C0,15 0,15 2,15 L17,15 L17,11 L27,11 L27,15 L42,15 C44,15 44,15 44,13 L44,3 C44,1 44,1 42,1 L27,1 L27,5 L17,5 L17,1 Z"
            fill="#D4A017"
        />
    </svg>
);

const FordLogo = () => (
    <svg width="42" height="22" viewBox="0 0 42 22" aria-hidden="true">
        <ellipse cx="21" cy="11" rx="20" ry="10.5" fill="#003E91" />
        <text
            x="21" y="15.5"
            textAnchor="middle"
            fill="white"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontStyle="italic"
            fontSize="11"
            fontWeight="bold"
        >
            Ford
        </text>
    </svg>
);

const PorscheLogo = () => (
    <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true">
        <path d="M10,1 L19,4.5 L19,15.5 L10,23 L1,15.5 L1,4.5 Z" fill="#1A1A1A" />
        <path d="M10,1 L19,4.5 L19,12 L10,12 Z" fill="#B8992A" />
        <path d="M1,12 L10,12 L10,23 L1,15.5 Z" fill="#B8992A" />
        <line x1="1" y1="12" x2="19" y2="12" stroke="#B8992A" strokeWidth="0.5" />
        <line x1="10" y1="1" x2="10" y2="23" stroke="#B8992A" strokeWidth="0.5" />
        <ellipse cx="10" cy="7.5" rx="2.8" ry="3.5" fill="none" stroke="#B8992A" strokeWidth="0.8" />
    </svg>
);

const MazdaLogo = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <ellipse cx="11" cy="11" rx="10" ry="10" fill="#E60012" />
    </svg>
);

const SuzukiLogo = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <path d="M5,1 L17,1 L17,5 L5,5 Z M5,9 L17,9 L17,13 L5,13 Z M5,17 L17,17 L17,21 L5,21 Z" fill="#FF0000" />
    </svg>
);

// ── Brand list ──────────────────────────────────────────────────

const brands = [
    { name: "Toyota", Logo: ToyotaLogo },
    { name: "BMW", Logo: BMWLogo },
    { name: "Mercedes", Logo: MercedesLogo },
    { name: "Audi", Logo: AudiLogo },
    { name: "Tesla", Logo: TeslaLogo },
    { name: "Volkswagen", Logo: VolkswagenLogo },
    { name: "Honda", Logo: HondaLogo },
    { name: "Chevrolet", Logo: ChevroletLogo },
    { name: "Ford", Logo: FordLogo },
    { name: "Porsche", Logo: PorscheLogo },
    { name: "Mazda", Logo: MazdaLogo },
    { name: "Suzuki", Logo: SuzukiLogo },
];

// Duplicate so the scroll loop is seamless
const items = [...brands, ...brands];

// ── Component ───────────────────────────────────────────────────

export default function BrandMarquee() {
    return (
        <section style={styles.section}>
            <p style={styles.label}>Car brands</p>

            <div style={styles.wrapper}>
                <div style={{ ...styles.fade, left: 0 }} />
                <div style={{ ...styles.fade, right: 0, transform: "scaleX(-1)" }} />

                <div style={styles.track} className="marquee-track">
                    {items.map(({ name, Logo }, i) => (
                        <div key={i} style={styles.card}>
                            <Logo />
                            <span style={styles.name}>{name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 32s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
}

// ── Styles ──────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    section: {
        padding: "1rem 0",
        overflow: "hidden",
    },
    label: {
        textAlign: "center",
        fontSize: "13px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#9ca3af",
        marginBottom: "1.5rem",
        fontWeight: 500,
    },
    wrapper: {
        position: "relative",
        overflow: "hidden",
    },
    fade: {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: "120px",
        background: "linear-gradient(to right, #ffffff 0%, transparent 100%)",
        zIndex: 2,
        pointerEvents: "none",
    },
    track: {
        display: "flex",
        gap: "12px",
        width: "max-content",
        willChange: "transform",
    },
    card: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 20px",
        borderRadius: "999px",
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        whiteSpace: "nowrap",
        cursor: "default",
        userSelect: "none",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    name: {
        fontSize: "15px",
        fontWeight: 500,
        color: "#111827",
        letterSpacing: "-0.01em",
    },
};