import { pb } from "../pb/client";
import { createTMDBSDK } from "./sdk-via-pb";

/**
 * Global TMDB SDK instance using the PocketBase client
 */
export const tmdb = createTMDBSDK(pb);
