import { v4 as uuidv4 } from 'uuid';

export class Role {
    id: string;
    name: string;
    description: string;
    constructor(name: string, description: string, id?: string){
        this.id = id || uuidv4(),
        this.name = name,
        this.description = description

    }

    
}