import type { Tables } from "@/integrations/supabase/types";

export type Car = Tables<"cars">;
export type Inquiry = Tables<"inquiries">;
export type MtoDesign = Tables<"made_to_order_designs">;
export type MtoInquiry = Tables<"made_to_order_inquiries">;
export type Feedbacks = Tables<"feedbacks">;

export type InquiryWithCar = Inquiry & { cars: { name: string } | null };