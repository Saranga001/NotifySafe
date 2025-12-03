import { Client, Account } from "appwrite";
import { appwriteConfig } from "../config";

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export { ID } from "appwrite";

class AuthService {
  async register(email, password, name) {
    const promise = await account.create({
      userId: ID.unique(),
      email,
      name,
      password,
    });
    return promise;
  }

  async login(email, password) {
    const promise = account.createEmailPasswordSession({ email, password });
    return promise;
  }

  async logout() {
    const promise = account.deleteSession({ current: true });
    return promise;
  }

  async getCurrentUser() {
    const promise = account.get();
    return promise;
  }

  async updateProfile(name) {
    const promise = account.updateName(name);
    return promise;
  }
}

const authService = new AuthService();
export default authService;
