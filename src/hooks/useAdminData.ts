import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Car, Feedbacks, InquiryWithCar, MtoDesign, MtoInquiry } from "@/types/admin";

export function useAdminData() {
  const [cars, setCars] = useState<Car[]>([]);
  const [inquiries, setInquiries] = useState<InquiryWithCar[]>([]);
  const [mtoDesigns, setMtoDesigns] = useState<MtoDesign[]>([]);
  const [mtoInquiries, setMtoInquiries] = useState<MtoInquiry[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedbacks[]>([]);

  const refresh = useCallback(async () => {
    const [{ data: c }, { data: i }, { data: md }, { data: mi }, {data: f}] = await Promise.all([
      supabase.from("cars").select("*").order("price", { ascending: true }),
      supabase.from("inquiries").select("*, cars(name)").order("created_at", { ascending: false }),
      supabase.from("made_to_order_designs").select("*").order("category").order("name"),
      supabase.from("made_to_order_inquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("feedbacks").select("*").order("created_at", {ascending: false})
    ]);
    setCars(c ?? []);
    setInquiries((i as any) ?? []);
    setMtoDesigns(md ?? []);
    setMtoInquiries(mi ?? []);
    setFeedbacks((f as any) ?? []);
  }, []);

  return { cars, inquiries, mtoDesigns, mtoInquiries, feedbacks, refresh };
}