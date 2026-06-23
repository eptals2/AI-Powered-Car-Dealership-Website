import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Truck, Car as CarIcon, Check } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Design = Tables<"made_to_order_designs">;

export const Route = createFileRoute("/made-to-order")({
  head: () => ({
    meta: [
      { title: "Made-to-Order — Eric Car Trading" },
      { name: "description", content: "Choose your favorite minivan or minitruck design and we'll build it for you." },
      { property: "og:title", content: "Made-to-Order — Eric Car Trading" },
      { property: "og:description", content: "Browse our catalog of customizable minivans and minitrucks." },
    ],
  }),
  component: MadeToOrderPage,
});

const inquirySchema = z.object({
  full_name: z.string().trim().min(2, "Name required").max(100),
  contact_number: z.string().trim().min(7, "Valid contact number required").max(20),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function MadeToOrderPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Design | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "minivan" | "minitruck">("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("made_to_order_designs")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) toast.error(error.message);
      setDesigns(data ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (tab === "all") return designs;
    return designs.filter((d) => d.category === tab);
  }, [designs, tab]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-1 py-7 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Made to Order</div>
            <h1 className="font-display text-4xl md:text-5xl mt-2">Choose your design</h1>
            <p className="mt-1 max-w-xl mx-auto text-muted-foreground">
              Browse our gallery of minivan and minitruck designs. Pick the one you love and we'll build it for you.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-2 py-2">
          <Tabs value={tab} onValueChange={(v) => { setTab(v as "all" | "minivan" | "minitruck"); setPage(1); }}>
            <TabsList className="mb-1 flex-wrap">
              <TabsTrigger value="all" className="gap-2">
                All ({designs.length})
              </TabsTrigger>
              <TabsTrigger value="minivan" className="gap-2">
                <CarIcon className="h-4 w-4" /> Minivans ({designs.filter((d) => d.category === "minivan").length})
              </TabsTrigger>
              <TabsTrigger value="minitruck" className="gap-2">
                <Truck className="h-4 w-4" /> Minitrucks ({designs.filter((d) => d.category === "minitruck").length})
              </TabsTrigger>
            </TabsList>
            {/* {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-2 mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )} */}

            <TabsContent value={tab}>
              {loading ? (
                <div className="text-center py-16 text-muted-foreground">Loading designs...</div>
              ) : paginated.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">No designs available yet.</div>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paginated.map((d) => {
                      const isSelected = selected?.id === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setSelected(d)}
                          className={`group text-left rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 ${isSelected ? "ring-2 ring-primary" : ""}`}
                        >
                          <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                            <img src={d.image_url} alt={d.name} className="h-full w-full object-contain transition-transform group-hover:scale-105" />
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <Badge variant="secondary" className="capitalize mb-2">{d.category}</Badge>
                            <div className="font-display text-lg">{d.name}</div>
                            {d.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{d.description}</p>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {selected && (
          <div className="sticky bottom-0 border-t bg-card/95 backdrop-blur z-30">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4 flex-wrap">
              <img src={selected.image_url} alt={selected.name} className="h-14 w-20 object-contain bg-muted rounded" />
              <div className="flex-1 min-w-[180px]">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Selected</div>
                <div className="font-semibold">{selected.name}</div>
              </div>
              <Button variant="outline" onClick={() => setSelected(null)}>Clear</Button>
              <Button onClick={() => setFormOpen(true)}>Send Inquiry</Button>
            </div>
          </div>
        )}
      </main>

      <InquiryDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        design={selected}
        onSubmitted={() => { setFormOpen(false); setSelected(null); }}
      />
    </div>
  );
}

function InquiryDialog({ open, onOpenChange, design, onSubmitted }: {
  open: boolean; onOpenChange: (v: boolean) => void; design: Design | null; onSubmitted: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!design) return;
    const fd = new FormData(e.currentTarget);
    const parsed = inquirySchema.safeParse({
      full_name: fd.get("full_name"),
      contact_number: fd.get("contact_number"),
      email: fd.get("email") || "",
      notes: fd.get("notes") || "",
    });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    const { error } = await supabase.from("made_to_order_inquiries").insert({
      design_id: design.id,
      category: design.category,
      design_name: design.name,
      full_name: parsed.data.full_name,
      contact_number: parsed.data.contact_number,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Inquiry submitted! We'll contact you soon.");
    onSubmitted();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Made-to-Order Inquiry</DialogTitle>
        </DialogHeader>
        {design && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="rounded-md bg-muted p-3 flex items-center gap-3">
              <img src={design.image_url} alt={design.name} className="h-14 w-20 object-contain rounded" />
              <div>
                <Badge variant="secondary" className="capitalize">{design.category}</Badge>
                <div className="font-semibold mt-1">{design.name}</div>
              </div>
            </div>
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" name="full_name" required maxLength={100} />
            </div>
            <div>
              <Label htmlFor="contact_number">Contact Number *</Label>
              <Input id="contact_number" name="contact_number" required maxLength={20} placeholder="+63 ..." />
            </div>
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" name="email" type="email" maxLength={255} />
            </div>
            <div>
              <Label htmlFor="notes">Notes / Customization Requests (optional)</Label>
              <Textarea id="notes" name="notes" maxLength={500} placeholder="Color preferences, accessories, timeline..." />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Send Inquiry"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
