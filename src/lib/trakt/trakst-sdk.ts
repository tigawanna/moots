import { useTraktStore } from "@/store/trakt-store";
const TRAKT_API_BASE = "https://api.trakt.tv";
const TRAKT_API_VERSION = "2";

export async function fetchFromTrakt<T>(
  endpoint: string,
  params: Record<string, any> & { api_key: string | null } = { api_key: null }
): Promise<T> {
  const traktAccessToken = useTraktStore.getState().tokens?.accessToken;
  const url = new URL(`${TRAKT_API_BASE}${endpoint}`);
  if (params) {
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
  }
  const urlString = url.toString();
  console.log(`Fetching from Trakt: >>>  ${urlString}`);
  const response = await fetch(urlString, {
    headers: {
      "Content-Type": "application/json",
      "trakt-api-version": TRAKT_API_VERSION,
      "trakt-api-key": process.env.EXPO_PUBLIC_TRAKT_CLIENT_ID!,
      Authorization: `Bearer ${traktAccessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending shows: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
