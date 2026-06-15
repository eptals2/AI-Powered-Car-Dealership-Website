import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowRight, ShieldCheck, Banknote, Wrench, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

import heroCars from "@/assets/hero-cars.png";
import BrandMarquee from "@/components/BrandMarquee";

type AiSearchResponse = {
  reply?: string;
  error?: string;
};

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState<string | null>(null);

  const handleAiSubmit = async (q?: string) => {
    const query = (q ?? aiQuery).trim();
    if (!query) return;
    setAiQuery(query);
    setAiLoading(true);
    setAiReply(null);
    try {
      const response = await fetch("/api/ai-car-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const payload = (await response.json().catch(() => ({}))) as AiSearchResponse;

      if (!response.ok) throw new Error(payload.error ?? "AI unavailable");

      setAiReply(payload.reply ?? "Sorry, no answer.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI unavailable");
    } finally {
      setAiLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section
        id="hero"
        className="relative overflow-hidden text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-no-repeat bg-bottom bg-cover opacity-30 md:opacity-40 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url(${heroCars})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid items-center gap-10 md:gap-6 md:grid-cols-[1fr_auto_1fr]">
            {/* Left: existing hero */}
            <div>
              <Badge className="mb-5 bg-white/10 text-white hover:bg-white/15 border-0">Trusted dealership</Badge>
              <h1 className="font-display text-5xl md:text-6xl leading-[0.95]">
                GET YOUR<br /><span className="text-primary-foreground/95 [text-shadow:0_0_40px_oklch(0.65_0.24_27_/_0.6)]">DREAM CAR</span> TODAY
              </h1>
              <p className="mt-6 text-base md:text-lg text-white/80 max-w-xl">
                Browse premium vehicles with flexible payment options tailored to your budget. Drive home today.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild className="shadow-[var(--shadow-glow)]">
                  <a href="/cars">Get now<ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
                </Button>
                <Button size="lg" asChild className="bg-white text-slate-950 hover:bg-slate-100">
                  <a href="/made-to-order">Made to Order</a>
                </Button>
              </div>
            </div>

            {/* OR divider */}
            <div className="flex md:flex-col items-center justify-center gap-3 md:h-full" aria-hidden>
              <div className="h-px w-16 md:h-24 md:w-px bg-white/30" />
              <span className="font-display text-2xl text-white/80">OR</span>
              <div className="h-px w-16 md:h-24 md:w-px bg-white/30" />
            </div>

            {/* Right: AI search */}
            <div className="md:text-right">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" /> AI-powered
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                Find Your<br />Next Car with <span className="text-primary-foreground/95 [text-shadow:0_0_40px_oklch(0.65_0.24_27_/_0.6)]">AI</span>
              </h2>
              <form
                onSubmit={(e) => { e.preventDefault(); handleAiSubmit(); }}
                className="mt-6 flex flex-col gap-2"
              >
                <div className="relative">
                  <Input
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Do you need help in getting your dream car?"
                    className="h-12 pr-12 rounded-full bg-white/95 text-foreground placeholder:text-muted-foreground border-0"
                    disabled={aiLoading}
                  />
                  <button
                    type="button"
                    onClick={() => handleAiSubmit()}
                    disabled={aiLoading || !aiQuery.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
                    aria-label="Ask AI"
                  >
                    {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-sm text-white/70 md:text-right">
                  Ask our AI about any vehicle
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {["Show me SUVs under 800k", "Best family car", "Cheapest available"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAiSubmit(s)}
                      disabled={aiLoading}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </form>

              {aiReply && (
                <div className="mt-4 rounded-xl bg-white/95 text-foreground p-4 text-left text-sm whitespace-pre-wrap shadow-lg max-h-64 overflow-auto">
                  {aiReply}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      </section>

      {/* Why */}
      <section id="why" className="container mx-auto px-4 py-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: Banknote, t: "Flexible Financing", d: "Customize your downpayment and term to fit your monthly budget." },
          { icon: ShieldCheck, t: "Verified Units", d: "Every car undergoes thorough inspection before listing." },
          { icon: Wrench, t: "After-Sales Care", d: "Service support and assistance long after the keys are yours." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-lg border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-2xl">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      {/* Brands */}
      <section id="brands" className="container mx-auto px-4">
        <BrandMarquee />
      </section>

      <section id="contact">
        <SiteFooter />
      </section>
    </div>
  );
}
