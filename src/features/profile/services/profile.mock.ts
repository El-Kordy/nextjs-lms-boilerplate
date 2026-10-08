import type { ProfileService } from "./profile.service";
import type { User } from "../types";

const mockProfile: User = {
  id: "1",
  name: "Rahim Uddin",
  email: "rahim@example.com",
  role: "student",
  phone: "+880 1712-345678",
  bio: "Full-stack developer working with Node.js and React.",
};

export const mockProfileService: ProfileService = {
  async getProfile() { return mockProfile; },
  async updateProfile(data) {
    Object.assign(mockProfile, data);
    return mockProfile;
  },
};
