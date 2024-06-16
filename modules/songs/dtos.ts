export interface CreateEventDto {
    name: string;
    description?: string;
    city: string;
    date: Date;
    location: string;
    duration: string;
    rating: number;
}
