export interface Car {
    id: string;
    name: string;
    price: number;
    status: string;
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