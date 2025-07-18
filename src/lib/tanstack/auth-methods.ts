export function getBetterAuthViewerQueryOptions() {
  return {
    queryKey: ["viewer"],
    queryFn: async () => {
      const response = await fetch("/api/viewer");
      if (!response.ok) {
        throw new Error("Failed to fetch viewer data");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  };
}
