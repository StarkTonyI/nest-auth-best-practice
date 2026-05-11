import { IsBoolean, IsString } from "class-validator";

export class RolePayload {
    @IsString()
    role!: string;
    @IsString()
    description!: string;
    @IsString()
    permissionName!: string;
    @IsBoolean()
    isDefault!: boolean
}