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

const heroCars = "hero-cars.png";
import BrandMarquee from "@/components/BrandMarquee";

type Car = Tables<"cars">;

const CATEGORIES = ["Minivan", "Minipickup", "Sedan", "Pickup", "Hatchback", "SUV", "MPV", "LCV"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  "Minivan": ["minivan", "van", "carnival", "alphard", "hiace", "starex", "urvan"],
  "Minipickup": ["minipickup", "mini-pickup"],
  "Sedan": ["sedan", "vios", "city", "civic", "altis", "corolla", "accent", "camry", "accord"],
  "Pickup": ["pickup/truck", "hilux", "ranger", "navara", "strada", "d-max", "dmax", "colorado", "frontier"],
  "Hatchback": ["hatchback", "wigo", "swift", "yaris", "mirage", "jazz", "brio", "picanto", "i10"],
  "SUV": ["suv", "fortuner", "everest", "montero", "mu-x", "trailblazer", "rush", "terra", "rav4", "cr-v", "crv"],
  "MPV": ["mpv", "innova", "xpander", "ertiga", "avanza", "br-v", "veloz"],
  "LCV": ["lcv", "light commercial", "truck", "canter", "elf", "forland", "fuso", "n-series"],
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

  const featured = useMemo(() => {
    const inStock = cars.filter((c) => c.status !== "out_of_stock");
    const matchCategory = (c: Car, cat: Category) => {
      const hay = `${c.name} ${c.description ?? ""}`.toLowerCase();
      return CATEGORY_KEYWORDS[cat].some((k) => hay.includes(k));
    };
    return CATEGORIES.map((cat) => ({
      category: cat,
      car: inStock.find((c) => matchCategory(c, cat)) ?? null,
    }));
  }, [cars]);

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


            {/* Right: AI search */}
            <div className="md:text-left">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" /> AI-powered
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                Chat Now<br />to Get your Dream Car  <span className="text-primary-foreground/95 [text-shadow:0_0_40px_oklch(0.65_0.24_27_/_0.6)]"></span>
              </h2>
              <form
                onSubmit={(e) => { e.preventDefault(); handleAiSubmit(); }}
                className="mt-0 flex flex-col gap-2"
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
                <div className="flex flex-wrap gap-2 md:justify-start">
                  {["Cheapest available", "Financing Options", "Best family car"].map((s) => (
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
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      </section>

      {/* Featured Cars */}
      {aiReply && (
        <div className="mt-4 rounded-xl bg-white/95 text-foreground p-4 text-left text-sm whitespace-pre-wrap shadow-lg max-h-64 overflow-auto">
          {aiReply}
        </div>
      )}
      <section id="featured" className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Featured</div>
            <h2 className="font-display text-4xl md:text-5xl">Units </h2>
          </div>
          <Button asChild variant="outline"><a href="/cars">View all<ArrowRight className="ml-2 h-4 w-4" /></a></Button>
        </div>

        {carsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[320px] rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {featured.map(({ category, car }) => {
                const imgs = car ? ((car.images && car.images.length > 0) ? car.images : (car.image_url ? [car.image_url] : [])) : [];
                return (
                  <CarouselItem key={category} className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                    <button
                      type="button"
                      onClick={() => car && setSelected(car)}
                      disabled={!car}
                      className="group relative block w-full h-full overflow-hidden rounded-lg border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {imgs.length > 0 ? (
                          <img src={imgs[0]} alt={`${category} - ${car?.name ?? ""}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No {category} yet</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4 text-left">
                          <div className="font-display text-2xl md:text-3xl text-foreground drop-shadow">{category}</div>
                          {car && (
                            <div className="mt-1 text-sm text-muted-foreground truncate">{car.name}</div>
                          )}
                        </div>
                      </div>
                    </button>
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
