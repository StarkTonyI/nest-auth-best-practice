import { Profile } from "@prisma/client";
import { ProfileUserDto } from "src/dto/profile/profile.dto";

export interface iProfileRepository {
      create:(user: ProfileUserDto)=> Promise<Profile>
      findByAuthId:(authId: string)=> Promise<Profile | null>
      update: (id: string, update: Partial<ProfileUserDto>)=> Promise<Profile>
      findById(id: string): Promise<Profile | null>
      delete(authId: string): Promise<Profile>
}


