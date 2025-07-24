import { logoutViewerMutationOptions } from "@/lib/tanstack/operations/user";
import { useMutation } from "@tanstack/react-query";
import { Button } from "react-native-paper";

export function LogoutUserButton() {
  const { mutate, isPending } = useMutation(logoutViewerMutationOptions());
  return (
    <Button mode="contained-tonal" onPress={() => mutate()}>
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}

