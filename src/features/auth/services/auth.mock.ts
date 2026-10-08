import type { AuthService } from "./auth.service";
import type { User } from "../types";

const mockUser: User = {
  id: "1",
  name: "Rahim Uddin",
  email: "rahim@example.com",
  role: "student",
  phone: "+880 1712-345678",
  bio: "Full-stack developer working with Node.js and React.",
};

export const mockAuthService: AuthService = {
  async getCurrentUser() {
    return mockUser;
  },

  async completeOnboarding(data) {
    Object.assign(mockUser, data);
    return mockUser;
  },

  async logout() {
    // no-op for mock
  },
};
