import { z } from "zod";

// EXPO_PUBLIC_LIVESTORE_STORE_ID;
// EXPO_PUBLIC_LIVESTORE_SYNC_URL;
export const envSchema = z.object({
  EXPO_PUBLIC_LIVESTORE_STORE_ID: z.string().default("moots"),
  EXPO_PUBLIC_LIVESTORE_SYNC_URL: z.url().default("http://localhost:8787"),
});

export type Env = z.infer<typeof envSchema>;

const { success, data, error } = envSchema.safeParse(process.env);
if (!success || !data || error) {
    console.error("Invalid environment variables:", z.treeifyError(error));
    throw new Error("Invalid environment variables");
}

export const envVariables = data;
