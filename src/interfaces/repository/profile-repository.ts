import { Profile } from "@prisma/client";
import { createProfilePayload } from "src/dto/request/profile/profile.dto";

export interface iProfileRepository {
      create:(user: createProfilePayload)=> Promise<Profile>
      findByAuthId:(authId: string)=> Promise<Profile | null>
      update: (id: string, update: Partial<Profile>)=> Promise<Profile>
      findById(id: string): Promise<Profile | null>
      delete(authId: string): Promise<Profile>
}


