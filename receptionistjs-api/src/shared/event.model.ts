import { RegistrationModel } from "./registration.model";

export interface EventModel {
    id?: string;
    name: string;
    type: string;
    location: string;
    description: string;
    attendees: RegistrationModel[];
}