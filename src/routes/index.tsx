import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowRight, ShieldCheck, Banknote, Wrench, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { CarDetailsDialog } from "@/components/CarDetailsDialog";
import { PHP } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";

import heroCars from "@/assets/hero-cars.png";
import BrandMarquee from "@/components/BrandMarquee";

type Car = Tables<"cars">;

const CATEGORIES = ["All", "Minivans", "Pickups", "Hatchbacks", "Sedans", "SUV's", "MPV's", "Trucks"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_KEYWORDS: Record<Exclude<Category, "All">, string[]> = {
  "Minivans": ["minivan", "van", "carnival", "alphard", "hiace", "starex", "urvan"],
  "Pickups": ["pickup", "hilux", "ranger", "navara", "strada", "d-max", "dmax", "colorado", "frontier"],
  "Hatchbacks": ["hatchback", "wigo", "swift", "yaris", "mirage", "jazz", "brio", "picanto", "i10"],
  "Sedans": ["sedan", "vios", "city", "civic", "altis", "corolla", "accent", "camry", "accord"],
  "SUV's": ["suv", "fortuner", "everest", "montero", "mu-x", "trailblazer", "rush", "terra", "rav4", "cr-v", "crv"],
  "MPV's": ["mpv", "innova", "xpander", "ertiga", "avanza", "bR-v", "br-v", "veloz"],
  "Trucks": ["truck", "canter", "elf", "forland", "fuso", "isuzu n-series"],
};

type AiSearchResponse = {
  reply?: string;
  error?: string;
};

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [category, setCategory] = useState<Category>("All");
  const [selected, setSelected] = useState<Car | null>(null);

  useEffect(() => {
    supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCars(data ?? []);
        setCarsLoading(false);
      });
  }, []);

  const filteredCars = useMemo(() => {
    if (category === "All") return cars;
    const keys = CATEGORY_KEYWORDS[category];
    return cars.filter((c) => {
      const hay = `${c.name} ${c.description ?? ""}`.toLowerCase();
      return keys.some((k) => hay.includes(k));
    });
  }, [cars, category]);

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

      {/* Featured Cars */}
      <section id="featured" className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Featured</div>
            <h2 className="font-display text-4xl md:text-5xl">Featured Cars</h2>
          </div>
          <Button asChild variant="outline"><a href="/cars">View all<ArrowRight className="ml-2 h-4 w-4" /></a></Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                category === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-glow)]"
                  : "bg-card text-foreground border-border hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {carsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[380px] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No cars in this category yet.</p>
        ) : (
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-4">
              {filteredCars.map((c) => {
                const imgs = (c.images && c.images.length > 0) ? c.images : (c.image_url ? [c.image_url] : []);
                return (
                  <CarouselItem key={c.id} className="pl-4 sm:basis-1/2 lg:basis-1/3">
                    <article className="group h-full overflow-hidden rounded-lg border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {imgs.length > 0 ? (
                          <img src={imgs[0]} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
                        )}
                        {c.status === "out_of_stock" && (
                          <Badge variant="destructive" className="absolute top-3 left-3">Out of Stock</Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-xl truncate">{c.name}</h3>
                        <div className="mt-1 text-2xl font-semibold text-primary">{PHP(Number(c.price))}</div>
                        <Button className="mt-4 w-full" variant="secondary" onClick={() => setSelected(c)}>
                          Get this
                        </Button>
                      </div>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        )}
      </section>

      <CarDetailsDialog car={selected} open={!!selected} onOpenChange={(v) => !v && setSelected(null)} />

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
