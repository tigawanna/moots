import { Client, Account } from "react-native-appwrite";
import { envVariables } from "@/lib/env";

let client: Client;
let account: Account;

client = new Client();
client
  .setEndpoint(envVariables.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(envVariables.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setPlatform("com.example.my-app"); // Your package name / bundle identifier

account = new Account(client);

export const getClient = () => client;
export const getAccount = () => account;
