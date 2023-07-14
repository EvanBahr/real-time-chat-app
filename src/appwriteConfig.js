import { Client } from "appwrite";
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("64b0efd0586cb02d6f7a");
export default Client;
