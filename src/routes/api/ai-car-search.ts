import { createFileRoute } from "@tanstack/react-router";
import { recommendCars } from "@/ai/services/carRecommendation.service";

export const Route = createFileRoute("/api/ai-car-search")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const query =
            typeof body?.query === "string"
              ? body.query.trim().slice(0, 500)
              : "";

          if (!query) {
            return Response.json(
              { error: "Please enter a question first." },
              { status: 400 }
            );
          }

          const result = await recommendCars(query);

          return Response.json(result);
        } catch (error) {
          console.error(error);

          return Response.json(
            { error: "AI unavailable." },
            { status: 500 }
          );
        }
      },
    },
  },
});