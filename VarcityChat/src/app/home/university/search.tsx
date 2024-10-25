import { View, Text, List } from "@/ui";
import Header from "@/components/header";
import SearchBar from "@/components/search-bar";
import UserCard from "@/components/university/user-card";
import { users } from "../../../../constants/users";
import EmptySearchSvg from "@/ui/icons/university/empty-search-svg";

export default function Search() {
  return (
    <View className="flex flex-1">
      <Header title="Search">
        <View className="flex flex-1 px-6 mt-1">
          <SearchBar placeholder="Search for people here" />

          <List
            data={[]}
            ListEmptyComponent={
              <View className="flex h-full items-center justify-center">
                <EmptySearchSvg />
                <Text className="mt-4 text-grey-500 dark:text-grey-200">
                  You haven't made any search yet
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
