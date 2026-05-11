
import { FirstName, LastName, UserName } from "src/core/value-objects/name.vo";
import { UserId } from "src/core/value-objects/userid.vo";

export interface createProfilePayload {
    userName: UserName,
    firstName: FirstName,
    lastName: LastName,
    authId: UserId
}