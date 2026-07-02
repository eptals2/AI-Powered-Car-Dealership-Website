export interface Car {
    id: string;
    name: string;
    price: number;
    status: string;
    year_model: number;
    description: string | null;
}

export interface RecommendationResponse {
    reply: string;
    car_ids: string[];
}

export interface AiGatewayResponse {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
}