import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../better-auth/client";

export type BetterAuthUserPayload = NonNullable<
  Awaited<ReturnType<typeof fetchCurrentViewer>>["data"]
>;
export type BetterAthViewer = BetterAuthUserPayload["user"];
export type BetterAuthSession = BetterAuthUserPayload["session"];

export function viewerQueryOptions() {
  return queryOptions({
    queryKey: ["viewer"],
    queryFn: async () => {
      const session = await authClient.getSession();
      if (!session) {
        return;
      }
      return session;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useViewer() {
  // const routeApi = getRouteApi("__root__");
  // const data = routeApi.useLoaderData();
  const qc = useQueryClient();
  const { data } = useQuery(viewerQueryOptions());

  function logoutMutation() {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
    return authClient.signOut().then(() => {
      qc.invalidateQueries(viewerQueryOptions());
    });
  }
  const mutation = useMutation({
    mutationFn: async () => {
      return logoutMutation();
    },
  });
  return {
    viewer: data?.data?.user,
    session: data?.data?.session,
    logoutMutation: mutation,
  };
}

export async function fetchCurrentViewer() {
  return authClient.getSession();
}
