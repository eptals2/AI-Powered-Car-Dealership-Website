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

  useEffect(() => {
    supabase.from("cars").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setCars(data ?? []);
      setLoading(false);
    });
  }, []);

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
                  <a href="#cars">Get now<ArrowRight className="ml-2 h-4 w-4" /></a>
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

      {/* Cars */}
      <section id="cars" className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The Lineup</div>
            <h2 className="font-display text-4xl md:text-5xl">Available Cars</h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cars..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-9 w-[220px]"
              />
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block">{cars.length} units</span>
            <Select value={sort} onValueChange={(v) => { setSort(v as typeof sort); setPage(1); }}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="newest">Newest</SelectItem> */}
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(() => {
          const filteredCars = cars.filter((c) =>
            c.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
          );
          const sortedCars = [...filteredCars].sort((a, b) => {
            if (sort === "price_asc") return Number(a.price) - Number(b.price);
            if (sort === "price_desc") return Number(b.price) - Number(a.price);
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          const totalPages = Math.max(1, Math.ceil(sortedCars.length / ITEMS_PER_PAGE));
          const currentPage = Math.min(page, totalPages);
          const paginatedCars = sortedCars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

          return (
            <>
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="h-[380px] animate-pulse bg-muted" />
                  ))}
                </div>
              ) : cars.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">No cars listed yet.</p>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedCars.map((c) => (
                      <article key={c.id} className="group overflow-hidden rounded-lg border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          {(() => {
                            const imgs = (c.images && c.images.length > 0) ? c.images : (c.image_url ? [c.image_url] : []);
                            if (imgs.length === 0) {
                              return <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>;
                            }
                            if (imgs.length === 1) {
                              return <img src={imgs[0]} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />;
                            }
                            return (
                              <Carousel className="h-full w-full" opts={{ loop: true }}>
                                <CarouselContent className="h-full ml-0">
                                  {imgs.map((src, i) => (
                                    <CarouselItem key={i} className="pl-0 h-full">
                                      <img src={src} alt={`${c.name} ${i + 1}`} className="h-full w-full aspect-[4/3] object-cover" loading="lazy" />
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                                <div className="absolute bottom-2 right-2 rounded bg-black/60 text-white text-xs px-2 py-0.5">{imgs.length} photos</div>
                              </Carousel>
                            );
                          })()}
                          {c.status === "out_of_stock" && (
                            <Badge variant="destructive" className="absolute top-3 left-3 z-10">Out of Stock</Badge>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-display text-xl">{c.name}</h3>
                          <div className="mt-1 text-2xl font-semibold text-primary">{PHP(Number(c.price))}</div>
                          <Button className="mt-4 w-full" variant="secondary" onClick={() => setSelected(c)}>
                            Get this
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#cars"
                              onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <PaginationItem key={p}>
                              <PaginationLink
                                href="#cars"
                                onClick={(e) => { e.preventDefault(); setPage(p); }}
                                isActive={p === currentPage}
                              >
                                {p}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              href="#cars"
                              onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          );
        })()}
      </section>

      <section id="contact">
        <SiteFooter />
      </section>
      <CarDetailsDialog car={selected} open={!!selected} onOpenChange={(v) => !v && setSelected(null)} />
    </div>
  );
}
