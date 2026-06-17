import { createServerFn } from "@tanstack/react-start";
import { recommendCars } from "@/ai/services/carRecommendation.service";

export const aiCarSearch = createServerFn({
  method: "POST",
})
  .inputValidator((input: { query: string }) => {
    if (!input?.query) {
      throw new Error("Invalid query");
    }

    return {
      query: input.query.trim().slice(0, 500),
    };
  })
  .handler(async ({ data }) => {
    return await recommendCars(data.query);
  });