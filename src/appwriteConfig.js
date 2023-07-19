import { Account, Client, Databases, ID } from "appwrite";
const client = new Client();
export const PROJECT_ID = "64b0efd0586cb02d6f7a";
export const DATABASE_ID = "64b0f2f419b09268e2e3";
export const COLLECTION_ID_MESSAGES = "64b0f32f5e7fb6b4b014";
export const DOCUMENT_ID = ID.unique();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("64b0efd0586cb02d6f7a");
export const databases = new Databases(client);
export const account = new Account(client);
export default client;
