import {z} from "zod"


// EXPO_PUBLIC_APPWRITE_PROJECT_ID=6533cbc41cf61d087e6d
// EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1

export const envSchema = z.object({
    EXPO_PUBLIC_APPWRITE_PROJECT_ID: z.string(),
    EXPO_PUBLIC_APPWRITE_ENDPOINT: z.url(),
})

export type Env = z.infer<typeof envSchema>

const {success,data,error} = envSchema.safeParse(process.env)
if (!success || !data || error) {
    console.error("Invalid environment variables:",error.format());
    throw new Error("Invalid environment variables");
}

export const envVariables = data
