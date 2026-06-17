import { getInventory, formatInventory } from "./inventory.service";
import { askGemini } from "./gemini.service";
import { CAR_ASSISTANT_SYSTEM_PROMPT } from "../prompts/carAssistantPrompt-v2";

export async function recommendCars(query: string) {
  const cars = await getInventory();

  const inventory = formatInventory(cars);

  const result = await askGemini(
    inventory,
    query,
    CAR_ASSISTANT_SYSTEM_PROMPT
  );

  const idSet = new Set(result.car_ids);

  const matchedCars = cars
    .filter((car) => idSet.has(car.id))
    .sort(
      (a, b) =>
        result.car_ids.indexOf(a.id) -
        result.car_ids.indexOf(b.id)
    );

  return {
    reply: result.reply,
    cars: matchedCars,
  };
}