import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

const useAuthUser = () => {
  const query = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.data ?? null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
    error: query.error,
    refetch: query.refetch,
  };
};

export default useAuthUser;
