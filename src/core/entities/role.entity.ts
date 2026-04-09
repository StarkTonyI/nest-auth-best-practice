import { uuid } from "uuidv4";

export class Role {
    id: string;
    name: string;
    description: string;
    constructor(name: string, description: string, id?: string){
        this.id = id || uuid(),
        this.name = name,
        this.description = description

    }

    
}