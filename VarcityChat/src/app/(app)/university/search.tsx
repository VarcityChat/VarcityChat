import { View, Text, List } from "@/ui";
import { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import UserCard from "@/components/university/user-card";
import EmptySearchSvg from "@/ui/icons/university/empty-search-svg";
import { useLocalSearchParams } from "expo-router";
import { IUser } from "@/types/user";
import { axiosApiClient } from "@/api/api";
import { useDebounce } from "@/core/hooks/use-debounce";
import { useToast } from "@/core/hooks/use-toast";

export default function Search() {
  const { id: universityId } = useLocalSearchParams();
  const inputRef = useRef<TextInput>(null);
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [searching, setSearching] = useState(false);
  const { showToast } = useToast();

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await axiosApiClient.get(
        `/users/search?q=${query}&uniId=${universityId}`
      );
      setSearchResults(response.data.users);
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "An error occurred",
      });
    } finally {
      setSearching(false);
    }
  };

  const [debouncedSearch, cancelSearch] = useDebounce(performSearch, 300);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 400);
    return () => {
      clearTimeout(timer);
      cancelSearch();
    };
  }, []);

  return (
    <View className="flex flex-1">
      <Header title="Search">
        <View className="flex flex-1 px-6 mt-1">
          <SearchBar
            placeholder="Search for people here"
            ref={inputRef}
            onChangeText={debouncedSearch}
          />

          <List
            data={searchResults}
            ListEmptyComponent={
              <View className="flex h-full items-center justify-center">
                <EmptySearchSvg />
                <Text className="mt-4 text-grey-500 dark:text-grey-200 font-sans-medium">
                  {searching
                    ? "Searching..."
                    : "You haven't made any search yet"}
                </Text>
              </View>
            }
            keyExtractor={(_, index) => `university-${index}`}
            renderItem={({ item }) => {
              return <UserCard user={item} />;
            }}
            contentContainerClassName="flex flex-1 flex-grow"
            estimatedItemSize={150}
            ListFooterComponent={<View style={{ height: 150 }} />}
          />
        </View>
      </Header>
    </View>
  );
}
