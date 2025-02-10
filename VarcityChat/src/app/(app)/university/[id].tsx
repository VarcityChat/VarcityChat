// import SearchBar from "@/components/search-bar";
// import { View, Text, TouchableOpacity, IS_IOS, colors, List } from "@/ui";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useColorScheme } from "nativewind";
// import {
//   ActivityIndicator,
//   Platform,
//   SafeAreaView,
//   StatusBar,
//   RefreshControl,
//   FlatList,
// } from "react-native";
// import Animated, {
//   clamp,
//   Extrapolation,
//   interpolate,
//   useAnimatedScrollHandler,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
// import { useEffect, useRef, useState } from "react";
// import { users } from "../../../../constants/users";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { trimText } from "@/core/utils";
// import BackButton from "@/components/back-button";
// import UserCard from "@/components/university/user-card";
// import FilterSvg from "@/ui/icons/university/filter-svg";
// import {
//   Menu,
//   MenuOption,
//   MenuOptions,
//   MenuTrigger,
// } from "react-native-popup-menu";
// import { Checkbox } from "@/ui/checkbox";
// import StudentsListSkeleton from "@/components/university/students-list-skeleton";
// import { useGetUniversityStudentsPaginatedQuery } from "@/api/universities/university-api";
// import { IUser } from "@/types/user";
// import { axiosApiClient } from "@/api/api";

import { api } from "@/api/api";
import { useAppDispatch } from "@/core/store/store";
import { useEffect } from "react";

// const SCROLL_THRESHOLD = 10; // Minimum scroll distance to trigger header animation
// const LIMIT = 5;

// export default function University() {
//   const { id: universityId } = useLocalSearchParams();
//   const { colorScheme } = useColorScheme();
//   const isDark = colorScheme === "dark";
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const hasNotch = insets.top > 20;

//   const HEADER_HEIGHT =
//     Platform.OS === "ios"
//       ? hasNotch
//         ? 110
//         : 70
//       : 70 + (StatusBar?.currentHeight ?? 0);

//   const [popupOpen, setPopupOpen] = useState(false);
//   const [filter, setFilter] = useState<"all" | "male" | "female">("all");

//   // Track scroll position and direction
//   const scrollY = useSharedValue(0);
//   const lastScrollY = useSharedValue(0);
//   const headerVisible = useSharedValue(1);

//   // Reset header state when screen comes into focus
//   useEffect(() => {
//     headerVisible.value = withTiming(1, { duration: 500 });
//     scrollY.value = 0;
//     lastScrollY.value = 0;
//   }, []);

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       const currentScrollY = event.contentOffset.y;
//       const scrollDiff = currentScrollY - lastScrollY.value;

//       // Only update header visibility after passing threshold
//       if (Math.abs(scrollDiff) > SCROLL_THRESHOLD) {
//         // Scrolling up - hide header
//         if (scrollDiff > 0 && currentScrollY > HEADER_HEIGHT) {
//           headerVisible.value = withTiming(0, { duration: 100 });
//         }
//         // Scrolling down - show header
//         else if (scrollDiff < 0 || currentScrollY <= 0) {
//           headerVisible.value = withTiming(1, { duration: 100 });
//         }
//       }

//       scrollY.value = currentScrollY;
//       lastScrollY.value = currentScrollY;
//     },
//   });

//   const headerAnimatedStyle = useAnimatedStyle(() => {
//     const translateY = interpolate(
//       headerVisible.value,
//       [0, 1],
//       [-HEADER_HEIGHT, 0],
//       Extrapolation.CLAMP
//     );
//     return {
//       transform: [{ translateY }],
//       opacity: interpolate(
//         headerVisible.value,
//         [0, 1],
//         [0.8, 1],
//         Extrapolation.CLAMP
//       ),
//     };
//   });

//   // const { data, isLoading, isFetching, refetch, isError, error } =
//   //   useGetUniversityStudentsPaginatedQuery({
//   //     uniId: universityId as string,
//   //     page,
//   //     limit: LIMIT,
//   //   });

//   // if (isError) {
//   //   console.log("ERROR FETCHING STUDENTS", error);
//   // }

//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(false);
//   const [students, setStudents] = useState<IUser[]>([]);
//   const hasFetchedInitial = useRef(false);
//   const [nextPage, setNextPage] = useState(
//     `/uni/${universityId}/students?page=1&limit=${LIMIT}`
//   );

//   // const fetchNextStudents = async () => {
//   //   if (!hasFetchedInitial.current) {
//   //     setLoading(true);
//   //   }
//   //   try {
//   //     if (!nextPage.length) return;
//   //     const response = await axiosApiClient.get(nextPage);
//   //     if (response.data) {
//   //       if (students.length === 0) {
//   //         hasFetchedInitial.current = true;
//   //       }
//   //       if (response.data?.users) {
//   //         setStudents((prevStudents) => {
//   //           console.log("PREV STUDENTS:", prevStudents.length);
//   //           return [...prevStudents, ...response.data.users];
//   //         });
//   //         console.log(
//   //           "FETCHED NEW STUDENT:",
//   //           students.length,
//   //           response.data.users.length
//   //         );
//   //         if (response.data.currentPage < response.data.totalPages) {
//   //           setNextPage(
//   //             `/uni/${universityId}/students?page=${
//   //               response.data.currentPage + 1
//   //             }&limit=${LIMIT}`
//   //           );
//   //         }
//   //       } else {
//   //         setNextPage("");
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching students:", error);
//   //   } finally {
//   //     if (hasFetchedInitial.current) {
//   //       setLoading(false);
//   //     }
//   //   }
//   // };
//   const fetchNextStudents = async () => {
//     if (!nextPage || fetching) return;

//     setFetching(true);
//     try {
//       const response = await axiosApiClient.get(nextPage);
//       if (response.data?.users) {
//         // Properly merge existing and new students
//         setStudents((currentStudents) => {
//           const newStudents = [...currentStudents];
//           response.data.users.forEach((newStudent) => {
//             if (!newStudents.find((s) => s._id === newStudent._id)) {
//               newStudents.push(newStudent);
//             }
//           });
//           return newStudents;
//         });

//         if (response.data.currentPage < response.data.totalPages) {
//           setNextPage(
//             `/uni/${universityId}/students?page=${
//               response.data.currentPage + 1
//             }&limit=${LIMIT}`
//           );
//         } else {
//           setNextPage("");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     } finally {
//       setFetching(false);
//     }
//   };

//   // useEffect(() => {
//   //   fetchNextStudents();
//   // }, []);

//   const loadMore = async () => {
//     console.log("END REACHED!");
//     // if (!loading) {
//     //   fetchNextStudents();
//     // }

//     // if (
//     //   !isLoading &&
//     //   !isFetching &&
//     //   data?.currentPage !== undefined &&
//     //   data?.totalPages !== undefined &&
//     //   data.currentPage < data.totalPages
//     // ) {
//     //   setPage((prev) => prev + 1);
//     //   console.log("FETCHING MORE:", page);
//     // }
//     // setPage((prev) => prev + 1);
//   };

//   return (
//     <SafeAreaView className="flex flex-1">
//       <Animated.View
//         style={[
//           {
//             position: "absolute",
//             top: 0,
//             left: 0,
//             right: 0,
//             height: HEADER_HEIGHT,
//             backgroundColor: isDark ? colors.charcoal[950] : colors.white,
//             zIndex: 1000,
//             elevation: 1000,
//           },
//           headerAnimatedStyle,
//         ]}
//       >
//         <View
//           className="flex flex-1 flex-row items-center justify-between px-6 pb-3"
//           style={{ marginTop: insets.top }}
//         >
//           <View className="w-[65px]">
//             <BackButton onPress={() => router.canGoBack() && router.back()} />
//           </View>

//           <Text className="font-sans-semibold text-lg">
//             {trimText("Lead City University")}
//           </Text>
//           {/*
//           <Menu opened={popupOpen} onBackdropPress={() => setPopupOpen(false)}>
//             <MenuTrigger customStyles={{ triggerOuterWrapper: { zIndex: 10 } }}>
//               <TouchableOpacity
//                 activeOpacity={0.7}
//                 className="flex-row items-center justify-center h-[40px] w-[65px] rounded-md bg-white dark:bg-charcoal-950 border border-grey-100"
//                 onPress={() => setPopupOpen(true)}
//               >
//                 <Text className="text-grey-500 mr-1">filter</Text>
//                 <FilterSvg color={isDark ? "#fff" : "#6B7280"} />
//               </TouchableOpacity>
//             </MenuTrigger>

//             <MenuOptions
//               customStyles={{
//                 optionsContainer: {
//                   width: 140,
//                   borderRadius: 10,
//                   backgroundColor: isDark ? colors.charcoal[950] : colors.white,
//                 },
//                 optionsWrapper: {
//                   padding: 4,
//                 },
//                 optionWrapper: {
//                   marginTop: 10,
//                 },
//               }}
//             >
//               <MenuOption>
//                 <Checkbox.Root
//                   accessibilityLabel="filter male"
//                   onChange={() => {
//                     setFilter("all");
//                   }}
//                 >
//                   <Checkbox.Icon checked={filter === "all"} />
//                   <Checkbox.Label text="All"></Checkbox.Label>
//                 </Checkbox.Root>
//               </MenuOption>
//               <MenuOption>
//                 <Checkbox.Root
//                   accessibilityLabel="filter male"
//                   onChange={() => setFilter("male")}
//                 >
//                   <Checkbox.Icon checked={filter === "male"} />
//                   <Checkbox.Label text="Male" />
//                 </Checkbox.Root>
//               </MenuOption>
//               <MenuOption>
//                 <Checkbox.Root
//                   accessibilityLabel="filter female"
//                   onChange={() => setFilter("female")}
//                   className="mb-2"
//                 >
//                   <Checkbox.Icon checked={filter === "female"} />
//                   <Checkbox.Label text="Female" />
//                 </Checkbox.Root>
//               </MenuOption>
//             </MenuOptions>
//           </Menu> */}
//         </View>
//       </Animated.View>

//       {loading ? (
//         <StudentsListSkeleton />
//       ) : (
//         // <Animated.ScrollView
//         //   className="flex flex-1 flex-grow px-6"
//         //   onScroll={scrollHandler}
//         //   scrollEventThrottle={16}
//         //   style={{ paddingTop: HEADER_HEIGHT - insets.top + 10 }}
//         //   pointerEvents={"box-none"}
//         // >
//         // <View className="flex flex-1 bg-red-200 px-6">
//         <FlatList
//           // ListHeaderComponent={
//           //   <View style={{ paddingTop: HEADER_HEIGHT - insets.top + 10 }}>
//           //     <SearchBar
//           //       placeholder="Search for people here"
//           //       onTouchEnd={() => router.push("/university/search")}
//           //     />
//           //   </View>
//           // }
//           contentContainerStyle={{
//             backgroundColor: "green",
//             paddingTop: HEADER_HEIGHT - insets.top + 10,
//           }}
//           // onScroll={scrollHandler}
//           // scrollEventThrottle={16}
//           data={students}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => {
//             return <UserCard user={item} />;
//           }}
//           onEndReached={fetchNextStudents}
//           onEndReachedThreshold={0.5}
//           // estimatedItemSize={150}
//           // onEndReached={loadMore}
//           // onEndReachedThreshold={2}
//           // refreshControl={
//           //   <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
//           // }
//           ListFooterComponent={
//             <View
//               // style={{ height: 150 }}
//               className="items-center justify-center"
//             >
//               {/* {!loading && (
//                 <ActivityIndicator size="small" color={colors.primary[500]} />
//               )} */}
//               <TouchableOpacity onPress={fetchNextStudents}>
//                 <Text>Load More</Text>
//               </TouchableOpacity>
//             </View>
//           }
//           ListEmptyComponent={
//             <View className="flex h-full items-center justify-center">
//               <Text className="mt-16 text-grey-500 dark:text-grey-200 font-sans-medium">
//                 No students in this University yet
//               </Text>
//             </View>
//           }
//         />
//         // </View>
//         // </Animated.ScrollView>
//       )}
//     </SafeAreaView>
//   );
// }

export default function University() {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(api.util.resetApiState());
  // }, []);
}
