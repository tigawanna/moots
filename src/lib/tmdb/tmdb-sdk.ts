const TMDB_API_BASE = "https://api.themoviedb.org/3";

export async function fetchFromTMDB<T>(
  endpoint: string,
  params: Record<string, any> = {}
): Promise<T> {
  const url = new URL(`${TMDB_API_BASE}${endpoint}`);
  
  // Add API key to all requests
  url.searchParams.append('api_key', process.env.EXPO_PUBLIC_TMDB_API_KEY!);
  
  // Add other parameters
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key].toString());
    }
  });

  const urlString = url.toString();
  console.log(`Fetching from TMDB: >>> ${urlString}`);
  
  const response = await fetch(urlString, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `TMDB API Error: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.status_message) {
        errorMessage = `TMDB API Error: ${errorData.status_message}`;
      }
    } catch {
      // If we can't parse the error response, use the default message
    }
    
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}