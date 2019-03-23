import { RegistrationModel } from "./registration.model";

export interface EventModel {
    id?: string;
    name: string;
    type: string;
    location: string;
    description: string;
    contactPerson: string;
    attendees: RegistrationModel[];
}