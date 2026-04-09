import { FirstName, LastName, UserName } from "src/value-objects/name.vo";
import { UserId } from "src/value-objects/userid.vo";

export class CreateProfileHandler  {
    constructor(
        public userName: UserName,
        public firstName: FirstName,
        public lastName:LastName,
        public authId: UserId,
    ){}
}









