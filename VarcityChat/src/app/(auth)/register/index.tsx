import { View, Text, Button } from "@/ui";
import {
  FlatList,
  ViewToken,
  SafeAreaView,
  Platform,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import RegisterItem from "@/components/register/register-item";
import GenderSelect from "@/components/register/gender-select";
import Paginator from "@/components/register/paginator";
import PersonalInformationForm from "@/components/register/personal-information";
import Personality from "@/components/register/personality";
import BackButton from "@/components/back-button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RegisterSuccessSvg from "@/ui/icons/register/success-svg";
import { useAppDispatch, useAppSelector } from "@/core/store/store";
import { setAuth, setShowSuccessModal } from "@/core/auth/auth-slice";

const MemoizedPersonality = memo(Personality);

export default function Index() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, user, showSuccessModal } = useAppSelector(
    (state) => state.auth
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const modalTranslateY = useSharedValue(500);
  const overlayOpacity = useSharedValue(0);

  const viewableItemChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      setCurrentIndex(viewableItems[0]?.index ?? 0);
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 20 }).current;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const onNextPress = (index: number) => {
    slideRef.current?.scrollToIndex({ index, animated: true });
  };

  const slides = useMemo(
    () => [
      {
        id: "gender",
        component: (
          <View className="flex flex-1 px-8">
            <GenderSelect onNextPress={() => onNextPress(1)} />
          </View>
        ),
      },
      {
        id: "personal-information",
        component: (
          <View className="flex flex-1 px-8">
            <PersonalInformationForm onNextPress={() => onNextPress(2)} />
          </View>
        ),
      },
      {
        id: "personality",
        component: (
          <View className="flex flex-1 px-8">
            <MemoizedPersonality />
          </View>
        ),
      },
    ],
    []
  );

  // Animated styles
  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalTranslateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  useEffect(() => {
    if (showSuccessModal) {
      modalTranslateY.value = withSpring(0, {
        damping: 12,
        stiffness: 120,
      });
      overlayOpacity.value = withTiming(1, { duration: 300 });
    }
  }, [showSuccessModal]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <KeyboardAwareScrollView
        className={`h-screen flex flex-1 ${Platform.select({
          ios: "py-4",
          android: "py-12",
        })}`}
        scrollEnabled={currentIndex > 0}
      >
        <View className="flex flex-row items-center justify-between px-6">
          <BackButton
            onPress={() => {
              if (currentIndex === 0) {
                router.back();
                return;
              }
              if (currentIndex === 1) {
                slideRef.current?.scrollToIndex({ index: 0, animated: true });
                return;
              }
              slideRef.current?.scrollToIndex({ index: 1, animated: true });
            }}
          />
          <Paginator data={[1, 2, 3]} currentIndex={currentIndex} />
          <View className="w-[35px]" />
        </View>

        <View className="flex-3">
          <Animated.FlatList
            data={slides}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RegisterItem>{item.component}</RegisterItem>
            )}
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled
            bounces={false}
            scrollEnabled={false}
            scrollEventThrottle={32}
            onScroll={scrollHandler}
            onViewableItemsChanged={viewableItemChanged}
            viewabilityConfig={viewConfig}
            ref={slideRef}
          />
        </View>
      </KeyboardAwareScrollView>

      {/* Background Overlay */}
      {showSuccessModal && (
        <Pressable className="absolute w-screen h-screen inset-0 bg-black/50">
          <Animated.View
            style={overlayStyle}
            className="absolute inset-0 bg-black/50"
          />
        </Pressable>
      )}

      {/* Success Modal */}
      <Animated.View
        className="w-screen h-[45vh] bg-white absolute bottom-0 left-0 rounded-t-2xl flex items-center justify-center"
        style={modalStyle}
      >
        <View className="flex w-[85%] items-center -mt-3">
          <RegisterSuccessSvg />
          <Text className="font-sans-semibold text-2xl mt-4">
            Welcome to Varcity!
          </Text>
          <Text className="font-sans-regular my-2 mb-6">
            Explore the full capacity
          </Text>
          <Button
            label="Continue"
            className="w-full text-center"
            onPress={() => {
              modalTranslateY.value = withSpring(500);
              overlayOpacity.value = withTiming(0, { duration: 300 });
              setTimeout(() => {
                if (token && user !== null) {
                  dispatch(setShowSuccessModal(false));
                  dispatch(setAuth({ isAuthenticated: true }));
                }
              }, 320);
            }}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
