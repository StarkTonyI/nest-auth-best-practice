import { IsString } from "class-validator";


export class AssingPermissionPayload {
    @IsString()
    role!: string;
    @IsString()
    action!: string;
    @IsString()
    resource!: string;
}