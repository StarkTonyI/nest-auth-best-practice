
import { FirstName, LastName, UserName } from "src/value-objects/name.vo";
import { UserId } from "src/value-objects/userid.vo";

export interface createProfilePayload {
    userName: UserName,
    firstName: FirstName,
    lastName: LastName,
    authId: UserId
}