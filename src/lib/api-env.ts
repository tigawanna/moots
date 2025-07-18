import { z } from "zod";


export const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(10),
  BETTER_AUTH_URL: z.url(),
  TURSO_DB_URL: z.url(),
  TURSO_DB_NAME: z.string().min(2).max(100),
  TURSO_DB_SECRET: z.string().min(10),
  GOOGLE_CLIENT_ID: z.string().min(2),
  GOOGLE_CLIENT_SECRET: z.string().min(10),
});

export type Env = z.infer<typeof envSchema>;

const { success, data, error } = envSchema.safeParse(process.env);
if (!success || !data || error) {
    console.error("Invalid environment variables:", z.treeifyError(error));
    throw new Error("Invalid environment variables");
}

export const apiEnvVariables = data;
