import { z } from "zod";

// EXPO_PUBLIC_LIVESTORE_STORE_ID;
// EXPO_PUBLIC_LIVESTORE_SYNC_URL;

export const envSchema = z.object({
  EXPO_PUBLIC_LIVESTORE_STORE_ID: z.string().min(10),
  EXPO_PUBLIC_LIVESTORE_SYNC_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

const {success,data,error} = envSchema.safeParse(process.env)
if (!success || !data || error) {
    console.error("Invalid environment variables:",error.format());
    throw new Error("Invalid environment variables");
}

export const envVariables = data
