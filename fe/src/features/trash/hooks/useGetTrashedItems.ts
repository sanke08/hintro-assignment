import { useQuery } from "@tanstack/react-query";
import { getTrashedItems } from "../api/trash.api";

interface GetTrashedItemsParams {
  workspaceId: string;
}

export const useGetTrashedItems = ({ workspaceId }: GetTrashedItemsParams) => {
  return useQuery({
    queryKey: ["trashed-items", workspaceId],
    queryFn: () => getTrashedItems({ workspaceId }),
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // trashed items can change
  });
};
