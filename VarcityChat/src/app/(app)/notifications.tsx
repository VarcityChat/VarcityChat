import moment from "moment";
import { INotification } from "@/api/notifications/types";
import Header from "@/components/header";
import { View, Text, TouchableOpacity, Image } from "@/ui";
import { IUser } from "../../types/user";
import { useGetNotificationsQuery } from "@/api/notifications/notifications-api";
import { SectionList } from "react-native";
import { useToast } from "@/core/hooks/use-toast";

export default function NotificationsScreen() {
  const { showToast } = useToast();
  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetNotificationsQuery(null);

  if (isError) {
    showToast({
      type: "error",
      text1: "Error",
      text2: "Error fetching notifications",
    });
  }

  const groupedNotifications = notifications?.reduce<
    Record<string, INotification[]>
  >((acc, notification) => {
    const date = moment(notification.createdAt).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(notification);
    return acc;
  }, {});

  const sections = groupedNotifications
    ? Object.keys(groupedNotifications)
        .sort((a, b) => moment(b).valueOf() - moment(a).valueOf())
        .map((date) => ({
          title: moment(date).format("MMMM D, YYYY"),
          data: groupedNotifications[date],
        }))
    : [];

  const renderItem = ({ item }: { item: INotification }) => (
    <View className="flex-row items-center py-5 px-6 border-b border-gray-200 dark:border-gray-600">
      {!!item?.from && (item?.from as IUser)?.images.length > 0 && (
        <Image
          source={{ uri: (item.from as IUser)?.images[0] }}
          className="w-12 h-12 rounded-full"
        />
      )}
      <View
        className={`flex-1 ${
          item.from && (item?.from as IUser)?.images.length > 0 && "ml-3"
        }`}
      >
        <Text className="font-sans-bold text-base">{item.title}</Text>
        <Text className="text-gray-500 dark:text-gray-300 text-sm mt-1">
          {item.message}
        </Text>
      </View>
      <Text className="text-gray-400 dark:text-gray-300 text-xs items-start justify-start">
        {moment(item.createdAt).format("h:mm A")}
      </Text>
    </View>
  );

  return (
    <View className="flex flex-1">
      <Header
        title="Notification"
        headerRight={
          <TouchableOpacity activeOpacity={0.7}>
            <Text className="text-primary-500 dark:text-primary-500">
              mark all as read
            </Text>
          </TouchableOpacity>
        }
        useScrollView={false}
        listProps={{
          component: SectionList,
          sections: sections,
          renderItem: renderItem,
          keyExtractor: (item: INotification) => item._id,
          renderSectionHeader(info) {
            return (
              <Text className="font-sans-semibold text-sm py-2 bg-grey-50 dark:bg-charcoal-850 px-6">
                {info.section.title}
              </Text>
            );
          },
        }}
      ></Header>
    </View>
  );
}
