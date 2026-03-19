import { ClassSerializerInterceptor, Injectable } from "@nestjs/common";
import { ProfileType } from "./entities/profile";
import { Profile } from "@prisma/client";

@Injectable()
export class ProfileDomainService {
    
  createProfileEntity(profileData: {
    authId: string;
    username: string;
    lastname: string;
  }): ProfileType {
    this.validateProfileData(profileData);

    const profile: ProfileType = {
      authId: profileData.authId,
      username: profileData.username,
      lastname: profileData.lastname,
    };

    return profile;
  }
  validateProfileData(profileData: {
    username: string;
    lastname: string;
    authId: string;
  }): void {
    if(!profileData.authId) throw new Error('auth id dont exist')
    this.validateName(profileData.username);
    this.validateLastname(profileData.lastname);

  }
  validateProfileUpdate(
    existingProfile: Profile,
    updates: Partial<Profile>,
  ): Partial<Profile> {
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    if (updates.username !== undefined) {
      this.validateName(updates.username);
    }

    if (updates.lastname !== undefined) {
      this.validateLastname(updates.lastname);
    }

    return updates;
  }
  validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
  }
  validateLastname(lastname: string): void {
    if (!lastname || lastname.trim().length < 2) {
      throw new Error('Lastname must be at least 2 characters long');
    }
  }


}