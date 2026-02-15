import { useQuery } from "@tanstack/react-query";
import { getWorkspaceByInviteCode } from "../api/workspace.api";

export const useGetInviteLink = (
  inviteCode: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [inviteCode],
    queryFn: () => getWorkspaceByInviteCode({ inviteCode }),
    enabled: enabled && !!inviteCode,
  });
};
