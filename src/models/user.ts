import { Address } from "./address";
import { Contact } from "./contact";

export interface User {
    id: string;
    name: string;
    birthdate: string;
    status: string;
    addressList: Address[];
    contactList: Contact[];
  }