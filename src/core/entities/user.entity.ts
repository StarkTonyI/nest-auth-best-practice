import { Role } from "@prisma/client";
import { Email } from "src/value-objects/email.vo";
import { FirstName, LastName } from "src/value-objects/name.vo";
import { UserId } from "src/value-objects/userid.vo";
export class User {
    private id: UserId
    private userName: FirstName;
    private lastName: LastName;
    private passwordHash: string;
    private email: Email;
    private role: Role;
    private readonly createdAt: Date;
    private updatedAt: Date
  
    constructor(id: UserId, username: FirstName, lastname: LastName, passwordHash:string, email: Email, role: Role, createdAt?: Date, updatedAt?: Date){
        this.id = id,
        this.userName = username,
        this.lastName = lastname,
        this.passwordHash = passwordHash,
        this.email = email,
        this.role = role,
        this.createdAt = createdAt || new Date(),
        this.updatedAt = updatedAt || new Date()
    }
    static create(userName: FirstName, lastName: LastName, password: string, email: Email, role: Role){
        const userId = UserId.create()
        return new User(userId, userName, lastName, password, email, role)
    }
    get userFirstName(){
        return this.userName;
    }

    get userLastName(){
        return this.lastName;
    }

    get userEmail(){
        return this.email;
    }

    get userRole(){
        return this.role;
    }

    get userPasswordHash(){
        return this.passwordHash;
    }

    get userCreateUpdateDate(){
        return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    get userId(){
        return this.id
    }

    static formData(data: { id: string, username: string, lastname: string, password?:string, email: string, role: Role, createdAt: Date, updatedAt: Date } ):User{
        return new User(UserId.fromString(data.id), new FirstName(data.username),
            new LastName(data.lastname), data.password || '',
            new Email(data.email), data.role, data.createdAt, data.updatedAt)
    }

}