import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CarDetailsDialog } from "@/components/CarDetailsDialog";
import { Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Car = Tables<"cars">;

export const Route = createFileRoute("/cars/$id")({ component: CarDetailPage });

function CarDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("cars").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setCar(data ?? null);
      setLoading(false);
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-4 py-12 min-h-[40vh]">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading unit...
          </div>
        ) : !car ? (
          <p className="text-center py-12 text-muted-foreground">Unit not found.</p>
        ) : (
          <div className="text-center">
            <h1 className="font-display text-3xl">{car.name}</h1>
            <p className="text-muted-foreground mt-2">Loading details...</p>
          </div>
        )}
      </section>
      <SiteFooter />
      <CarDetailsDialog
        car={car}
        open={!!car}
        onOpenChange={(v) => { if (!v) navigate({ to: "/cars" }); }}
      />
    </div>
  );
}
