import { Client, Account, ID } from "appwrite";
import { appwriteConfig } from "../config";

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);

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
    const promise = account.deleteSession({ sessionId: "current" });
    return promise;
  }

  async getCurrentUser() {
    const promise = account.get();
    return promise.then((res) => res);
  }

  async updateProfile(name) {
    const promise = account.updateName(name);
    return promise;
  }
}

const authService = new AuthService();
export default authService;
