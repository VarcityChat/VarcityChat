import { useCallback, useState } from "react";
import { View, Text, Button, TouchableOpacity, Input, Image } from "@/ui";
import PlusSvg from "@/ui/icons/register/plus-svg";
import MarriedSvg from "@/ui/icons/register/married-svg";
import InARelationshipSvg from "@/ui/icons/register/in-a-relationship-svg";
import SingleSvg from "@/ui/icons/register/single-svg";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LookingFor, RelationshipStatus } from "@/types/user";
import { twMerge } from "tailwind-merge";
import { useAppDispatch, useAppSelector } from "@/core/store/store";
import { useToast } from "@/core/hooks/use-toast";
import { useLazyUserExistsQuery, useSignupMutation } from "@/api/auth/auth-api";
import { uploadToCloudinary } from "@/core/upload-utils";
import { useApi } from "@/core/hooks/use-api";
import { setAuth, setShowSuccessModal } from "@/core/auth/auth-slice";

export default function Personality() {
  const dispatch = useAppDispatch();
  const signupData = useAppSelector((state) => state.auth.signupData);
  const { showToast } = useToast();
  const { callMutationWithErrorHandler } = useApi();
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[] | null[]>(
    [null, null, null, null]
  );
  const [relationshipStatus, setRelationshipStatus] = useState<
    | RelationshipStatus.DATING
    | RelationshipStatus.MARRIED
    | RelationshipStatus.SINGLE
    | null
  >(null);
  const [lookingFor, setLookingFor] = useState<
    LookingFor.FRIENDSHIP | LookingFor.RELATIONSHIP | LookingFor.OTHERS | null
  >(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [triggerCheckIfUserExists, { isLoading, isError: userExistsError }] =
    useLazyUserExistsQuery();
  const [signup, { isLoading: isSubmitting }] = useSignupMutation();

  const onSelectImage = useCallback(
    (image: ImagePicker.ImagePickerAsset, index: number) => {
      const previousImages = [...images];
      previousImages[index] = image;
      setImages(previousImages as ImagePicker.ImagePickerAsset[]);
    },
    [images]
  );

  const handleSignUp = async () => {
    // perform some validation
    if (images.every((image) => image === null)) {
      showToast({
        type: "error",
        text1: "Missing information",
        text2: "Please select at least one image",
      });
      return;
    }

    if (relationshipStatus === null) {
      showToast({
        type: "error",
        text1: "Missing information",
        text2: "Please select your relationship status",
      });
      return;
    }

    if (lookingFor === null) {
      showToast({
        type: "error",
        text1: "Missing information",
        text2: "You might wanna tell us what you are looking for?",
      });
      return;
    }

    if (description === "") {
      showToast({
        type: "error",
        text1: "Missing information",
        text2: "Please enter a little description about yourself.",
      });
      return;
    }

    // check if the user exists
    const response = await triggerCheckIfUserExists(
      `${signupData?.email}`,
      false
    ).unwrap();

    if (userExistsError) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "There was a problem signing you up",
      });
      return;
    }

    if (response.exists) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "User with email already exists",
      });
      return;
    }

    const imagesToUpload = images.filter((image) => image !== null);
    setIsUploading(true);
    const uploadedImageUrls = await Promise.all(
      imagesToUpload.map(
        async (img) =>
          await uploadToCloudinary({ preset: "user_profiles" }, img)
      )
    );

    const successfulUploads = uploadedImageUrls.filter((url) => url !== null);
    if (successfulUploads.length === 0) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Failed to upload images, please try again later!",
      });
      return;
    }
    setIsUploading(false);

    const { isError, data } = await callMutationWithErrorHandler(() =>
      signup({
        email: signupData?.email,
        gender: signupData?.gender,
        password: signupData?.password,
        university: signupData?.university,
        firstname: signupData?.firstname,
        lastname: signupData?.lastname,
        relationshipStatus,
        lookingFor,
        images: successfulUploads,
        about: description,
      }).unwrap()
    );

    if (!isError && data) {
      dispatch(setShowSuccessModal(true));
      dispatch(setAuth({ ...data, isAuthenticated: false }));
    }
  };

  return (
    <View className="flex flex-1 justify-center items-center mt-6">
      <Text className="font-sans-semibold text-2xl">Personality</Text>
      <Text className="text-grey-500 dark:text-grey-200">
        Let's get to find out more about you
      </Text>

      <View className="flex flex-1 w-full pt-8">
        <View>
          <Text className="font-sans">Images</Text>
          <Text className="text-grey-500 dark:text-grey-200 text-sm font-light">
            Lets put a face to the name, add images of yourself
          </Text>

          <View className="flex flex-row my-4 gap-4">
            <ImageSelectCard
              imageUri={images[0]?.uri}
              onSelectImage={(image) => onSelectImage(image, 0)}
            />
            <ImageSelectCard
              imageUri={images[1]?.uri}
              onSelectImage={(image) => onSelectImage(image, 1)}
            />
            <ImageSelectCard
              imageUri={images[2]?.uri}
              onSelectImage={(image) => onSelectImage(image, 2)}
            />
            <ImageSelectCard
              imageUri={images[3]?.uri}
              onSelectImage={(image) => onSelectImage(image, 3)}
            />
          </View>
        </View>

        <View className="mt-2">
          <Text className="font-sans">Relationship Status</Text>
          <View className="flex flex-row flex-wrap gap-4 py-3">
            <TouchableOpacity
              activeOpacity={0.7}
              className={twMerge(
                `px-3 py-2 rounded-full bg-grey-50 flex flex-row items-center gap-2 dark:bg-grey-800 border border-grey-50 dark:border-grey-800 ${
                  relationshipStatus === RelationshipStatus.SINGLE &&
                  "bg-primary-50 dark:bg-primary-50 border-primary-500 dark:border-primary-500 "
                }`
              )}
              onPress={() => setRelationshipStatus(RelationshipStatus.SINGLE)}
            >
              <SingleSvg />
              <Text className="text-grey-500 dark:text-grey-300 text-sm">
                Single
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className={twMerge(
                `px-3 py-2 rounded-full bg-grey-50 flex flex-row items-center gap-2 dark:bg-grey-800 border border-grey-50 dark:border-grey-800 ${
                  relationshipStatus === RelationshipStatus.MARRIED &&
                  "bg-primary-50 dark:bg-primary-50 border-primary-500 dark:border-primary-500 "
                }`
              )}
              onPress={() => setRelationshipStatus(RelationshipStatus.MARRIED)}
            >
              <MarriedSvg />
              <Text className="text-grey-500 dark:text-grey-300 text-sm">
                Married
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className={twMerge(
                `px-3 py-2 rounded-full bg-grey-50 flex flex-row items-center gap-2 dark:bg-grey-800 border border-grey-50 dark:border-grey-800 ${
                  relationshipStatus === RelationshipStatus.DATING &&
                  "bg-primary-50 dark:bg-primary-50 border-primary-500 dark:border-primary-500 "
                }`
              )}
              onPress={() => setRelationshipStatus(RelationshipStatus.DATING)}
            >
              <InARelationshipSvg />
              <Text className="text-grey-500 dark:text-grey-300 text-sm">
                Dating
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-2">
          <Text className="font-sans">What are you looking for?</Text>

          <View className="flex flex-row flex-wrap gap-4 py-3">
            <TouchableOpacity
              activeOpacity={0.7}
              className={twMerge(
                `px-3 py-2 rounded-full bg-grey-50 flex flex-row items-center gap-2 dark:bg-grey-800 border border-grey-50 dark:border-grey-800 ${
                  lookingFor === LookingFor.FRIENDSHIP &&
                  "bg-primary-50 dark:bg-primary-50 border-primary-500 dark:border-primary-500 "
                }`
              )}
              onPress={() => setLookingFor(LookingFor.FRIENDSHIP)}
            >
              <Text className="text-grey-500 dark:text-grey-300 text-sm">
                Friendship
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className={twMerge(
                `px-3 py-2 rounded-full bg-grey-50 flex flex-row items-center gap-2 dark:bg-grey-800 border border-grey-50 dark:border-grey-800 ${
                  lookingFor === LookingFor.RELATIONSHIP &&
                  "bg-primary-50 dark:bg-primary-50 border-primary-500 dark:border-primary-500 "
                }`
              )}
              onPress={() => setLookingFor(LookingFor.RELATIONSHIP)}
            >
              <Text className="text-grey-500 dark:text-grey-300 text-sm">
                Partner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className={twMerge(
                `px-3 py-2 rounded-full bg-grey-50 flex flex-row items-center gap-2 dark:bg-grey-800 border border-grey-50 dark:border-grey-800 ${
                  lookingFor === LookingFor.OTHERS &&
                  "bg-primary-50 dark:bg-primary-50 border-primary-500 dark:border-primary-500 "
                }`
              )}
              onPress={() => setLookingFor(LookingFor.OTHERS)}
            >
              <Text className="text-grey-500 dark:text-grey-300 text-sm">
                Others
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-2">
          <Text className="font-sans my-2">Describe yourself</Text>
          <Input
            onChangeText={(text) => setDescription(text)}
            value={description}
            multiline
            style={{ height: 80, textAlignVertical: "top" }}
            placeholder="What do you want others to know about you?"
          />
        </View>

        <View className="mt-2">
          <Button
            label="Sign Up"
            onPress={handleSignUp}
            loading={isUploading || isLoading || isSubmitting}
          />
        </View>

        <View
          className={Platform.select({
            ios: "h-[40px]",
            android: "h-[100px]",
          })}
        />
      </View>
    </View>
  );
}

type ImageSelectProps = {
  onSelectImage?: (image: ImagePicker.ImagePickerAsset) => void;
  imageUri: string | undefined;
};

const ImageSelectCard = ({ onSelectImage, imageUri }: ImageSelectProps) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onSelectImage?.(result.assets[0]);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex flex-1 h-[90px] bg-grey-50 dark:bg-grey-800 rounded-md items-center justify-center overflow-hidden"
      onPress={pickImage}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          contentFit="cover"
          className="w-full h-full"
        />
      ) : (
        <PlusSvg />
      )}
    </TouchableOpacity>
  );
};
