import { useEffect, useMemo, useState } from "react";
import { number, z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PHP } from "@/lib/format";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Car = Tables<"cars">;

const inquirySchema = z.object({
  full_name: z.string().trim().min(2, "Name required").max(100),
  contact_number: z.string().trim().min(7, "Valid number required").max(20),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  agree: z.literal(true, { errorMap: () => ({ message: "You must agree" }) }),
});

export function CarDetailsDialog({ car, open, onOpenChange }: { car: Car | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const price = car?.price ? Number(car.price) : 0;
  const minDp = Math.round(price * 0.106385);
  const maxDp = Math.round(price * 0.6);
  const addOnRate = 0.306691

  const [downpayment, setDownpayment] = useState(minDp);
  const [years, setYears] = useState(3);
  const [formOpen, setFormOpen] = useState<null | "order" | "quote" | "reserve">(null);

  useEffect(() => {
    setDownpayment(Math.round(price * 0.2));
    setYears(3);
  }, [car?.id, price]);

  const monthly = useMemo(() => {
    if (!price) return 0;
    const amountFinanced = price - downpayment;
    const totalAmount = amountFinanced * (1 + addOnRate * years);
    return Math.max(0, Math.round(totalAmount / (years * 12)));
  }, [price, downpayment, years, addOnRate]);

  if (!car) return null;
  const outOfStock = car.status === "out_of_stock";
  const hideButtons = outOfStock && car.category === "commercial";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">
              {
                car.category === "surplus" ? (
                  <h3 className="font-display text-xl md:text-2xl font-semibold leading-tight tracking-tight">
                    {car.type} {car.name} {car.wheel_drive} {car.transmission} transmission
                  </h3>
                ) : (
                  <h3 className="font-display text-xl md:text-2xl font-semibold leading-tight tracking-tight">
                    {car.name} {car.transmission} transmission
                  </h3>
                )
              }
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-lg bg-muted relative">
              {(() => {
                const imgs = (car.images && car.images.length > 0) ? car.images : (car.image_url ? [car.image_url] : []);
                if (imgs.length === 0) {
                  return <div className="flex h-64 items-center justify-center text-muted-foreground">No image</div>;
                }
                if (imgs.length === 1) {
                  return <img src={imgs[0]} alt={car.name} className="h-100 w-full object-cover md:h-full" />;
                }
                return (
                  <Carousel className="h-full w-full" opts={{ loop: true }}>
                    <CarouselContent className="ml-0">
                      {imgs.map((src, i) => (
                        <CarouselItem key={i} className="pl-0">
                          <img src={src} alt={`${car.name} ${i + 1}`} className="h-100 w-full object-cover md:h-full" />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                );
              })()}
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Price</div>
                <div className="font-display text-4xl text-primary">{PHP(price)}</div>
                {outOfStock && <Badge variant="destructive" className="mt-2">Made To Order</Badge>}
              </div>
              {car.description && <p className="text-sm text-muted-foreground">{car.description}</p>}

              <div className="rounded-lg border bg-card p-4 space-y-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">Financing Estimate</div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Label>Minimum  Downpayment</Label>
                    <span className="font-semibold">{PHP(downpayment)}</span>
                  </div>
                  <div className="space-y-4">
                    <Input type="number" placeholder="Input Downpayment" value={downpayment.toString()} min={minDp} max={maxDp} onChange={(e) => setDownpayment(parseInt(e.target.value) || 0)} />
                    {downpayment < minDp && (
                      <div className="text-xs font-medium text-destructive">
                        DP is lower than minimum. Downpayment must be {PHP(minDp)}
                      </div>
                    )}
                    <Slider value={[downpayment]} min={minDp} max={maxDp} step={1000} onValueChange={(v) => setDownpayment(v[0])} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Label>Years to Pay</Label>
                    <span className="font-semibold">{years} {years === 1 ? "year" : "years"}</span>
                  </div>
                  <Slider value={[years]} min={1} max={3} step={1} onValueChange={(v) => setYears(v[0])} />
                </div>

                <div className="rounded-md bg-primary/10 p-3 text-center">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Monthly Payment</div>
                  <div className="font-display text-2xl text-primary">{PHP(monthly)}/mo</div>
                  <div className="text-xs">Note: <strong>Monthly and Down Payment</strong> are only <strong>estimates</strong>, actual DP and Monthly may vary per <strong>financing's calculation</strong> and may change without prior notice.</div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            {!hideButtons && (outOfStock ? (
              <Button className="w-full" onClick={() => setFormOpen("order")}>Made to Order</Button>
            ) : (
              <>
                <Button disabled={downpayment < minDp} onClick={() => setFormOpen("reserve")}>Reserve This Unit</Button>
              </>
            ))}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InquiryForm
        open={!!formOpen}
        onOpenChange={(v) => !v && setFormOpen(null)}
        type={formOpen ?? "quote"}
        car={car}
        downpayment={downpayment}
        monthly={monthly}
        years={years}
      />
    </>
  );
}

function InquiryForm({ open, onOpenChange, type, car, downpayment, monthly, years }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  type: "order" | "quote" | "reserve"; car: Car; downpayment: number; monthly: number; years: number;
}) {
  const [submitting, setSubmitting] = useState(false);

  const formType = {
    order: {
      title: "Made to Order",
      button: "Submit Order Request",
      submittingLabel: "Submitting Order...",
      successMessage: "Order request submitted! We'll contact you shortly.",
    },
    quote: {
      title: "Get Free Quote",
      button: "Request Quote",
      submittingLabel: "Submitting...",
      successMessage: "Quote requested! We'll be in touch.",
    },
    reserve: {
      title: "Reserve Unit",
      button: "Confirm Reservation",
      submittingLabel: "Submitting...",
      successMessage: "Reservation submitted! We'll contact you shortly.",
    },
  }[type]

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = inquirySchema.safeParse({
      full_name: fd.get("full_name"),
      contact_number: fd.get("contact_number"),
      email: fd.get("email") || "",
      agree: fd.get("agree") === "on",
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("inquiries").insert({
      car_id: car.id,
      full_name: parsed.data.full_name,
      contact_number: parsed.data.contact_number,
      email: parsed.data.email || null,
      downpayment,
      monthly_payment: monthly,
      years_to_pay: years,
      inquiry_type: type,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(formType.successMessage);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {formType.title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-md bg-muted p-3 text-sm space-y-1">
            <div><span className="text-muted-foreground">Car: </span><strong>{car.name}</strong></div>
            <div><span className="text-muted-foreground">Downpayment: </span>{PHP(downpayment)}</div>
            <div><span className="text-muted-foreground">Monthly: </span>{PHP(monthly)} × {years * 12} mos</div>
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
          <label className="flex items-start gap-2 text-sm">
            <Checkbox name="agree" id="agree" className="mt-0.5" />
            <span>I agree to the Privacy Policy and authorize Eric Car Trading to contact me.</span>
          </label>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? formType.submittingLabel : formType.button}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
