import { createClient } from "@supabase/supabase-js";
import type { Car } from "../types/ai.types"

export async function getInventory(): Promise<Car[]> {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PUBLISHABLE_KEY!
    )
    const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "available")
        .limit(50);

    if (error) {
        console.error("[inventory]", error.message);
        return [];
    }

    return data ?? [];
}

export function formatInventory(cars: Car[]) {
    return cars
        .map((car, index) => {
            const description = car.description
                ? `- ${String(car.description).slice(0, 120)}`
                : "";

            return `[${index + 1}] id=${car.id} | ${car.name} ${car.year_model} - PHP ${car.price} (${car.status}) ${description}`;
        })
        .join("\n");
}
