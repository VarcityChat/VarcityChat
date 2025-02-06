import { useGetChatsQuery } from "@/api/chats/messages-api";
import { useAppDispatch } from "../store/store";

export const useChats = () => {
  const { data: chats, isLoading, refetch, error } = useGetChatsQuery();
  const dispatch = useAppDispatch();

  const loadChats = async () => {
    // Trigger refetch of chats
    await refetch();
  };

  return { chats, isLoading, loadChats, error };
};
