import Header from "@/components/header";
import { View, Text, TouchableOpacity, Button, Input, Image } from "@/ui";
import PlusSvg from "@/ui/icons/register/plus-svg";
import MarriedSvg from "@/ui/icons/register/married-svg";
import InARelationshipSvg from "@/ui/icons/register/in-a-relationship-svg";
import SingleSvg from "@/ui/icons/register/single-svg";
import { KeyboardAvoidingView } from "react-native";
import { useAuth } from "@/core/hooks/use-auth";
import { useToast } from "@/core/hooks/use-toast";
import { useApi } from "@/core/hooks/use-api";
import { useCallback, useEffect, useState } from "react";
import { LookingFor, RelationshipStatus } from "@/types/user";
import * as ImagePicker from "expo-image-picker";
import { twMerge } from "tailwind-merge";
import { useUpdateUserMutation } from "@/api/auth/auth-api";
import { uploadToCloudinary } from "@/core/utils";

export default function Personality() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { callMutationWithErrorHandler } = useApi();
  const [userChangedImage, setUserChangedImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [images, setImages] = useState<(ImagePicker.ImagePickerAsset | null)[]>(
    [...Array(4)].map(() => null)
  );
  const [relationshipStatus, setRelationshipStatus] = useState<
    | RelationshipStatus.DATING
    | RelationshipStatus.MARRIED
    | RelationshipStatus.SINGLE
    | null
  >(user?.relationshipStatus || null);
  const [lookingFor, setLookingFor] = useState<
    LookingFor.FRIENDSHIP | LookingFor.RELATIONSHIP | LookingFor.OTHERS | null
  >(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user) {
      for (let i = 0; i < user.images?.length; i++) {
        if (user.images[i]) {
          setImages((prev) => {
            const newImages = [...prev];
            newImages[i] = user.images[i]
              ? ({ uri: user.images[i] } as ImagePicker.ImagePickerAsset)
              : null;
            return newImages as (ImagePicker.ImagePickerAsset | null)[];
          });
        }
      }
      setRelationshipStatus(user.relationshipStatus);
      setLookingFor(user.lookingFor);
      setDescription(user.about);
    }
  }, [user]);

  const onSelectImage = useCallback(
    (image: ImagePicker.ImagePickerAsset, index: number) => {
      const previousImages = [...images];
      previousImages[index] = image;
      setImages(previousImages as ImagePicker.ImagePickerAsset[]);
      setUserChangedImage(true);
    },
    [images]
  );

  const handleSave = async () => {
    if (images.length === 0) {
      showToast({
        type: "Error",
        text1: "Missing information",
        text2: "Please select at least one image",
      });
      return;
    }

    let imagesNotNullCount = 0;
    for (let i = 0; i < images.length; i++) {
      if (images[i] !== null) {
        imagesNotNullCount++;
      }
    }

    const userImageNotChanged =
      imagesNotNullCount === user?.images.length && !userChangedImage;
    const relationshipStatusNotChanged =
      relationshipStatus === user?.relationshipStatus;
    const lookingForNotChanged = lookingFor === user?.lookingFor;
    const descriptionNotChanged = description === user?.about;

    if (
      userImageNotChanged &&
      relationshipStatusNotChanged &&
      lookingForNotChanged &&
      descriptionNotChanged
    ) {
      showToast({
        type: "info",
        text1: "No changes made",
        text2: "You haven't made any changes",
      });
      return;
    }

    const dataToUpdate: Record<string, any> = {
      relationshipStatus,
      lookingFor,
      about: description,
    };

    // Upload images only when images change
    if (!userImageNotChanged) {
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
      dataToUpdate["images"] = successfulUploads;
      setIsUploading(false);
    }

    const { isError } = await callMutationWithErrorHandler(() =>
      updateUser(dataToUpdate).unwrap()
    );
    if (!isError) {
      showToast({
        type: "success",
        text1: "Success",
        text2: "Your personality has been updated",
      });
    }
  };

  return (
    <View className="flex-1">
      <Header title="Personality">
        <KeyboardAvoidingView className="flex flex-1 justify-center mt-6 px-6">
          <View>
            <Text className="font-sans-bold text-grey-500">Images</Text>
            <Text className="text-grey-500 dark:text-grey-200 text-sm font-sans">
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
                onPress={() =>
                  setRelationshipStatus(RelationshipStatus.MARRIED)
                }
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

          {/* 
          <View className="mt-1">
            <View className="flex flex-row gap-2 items-center">
              <Text className="font-semibold text-sm my-2">Hobbies</Text>
              <Text className="text-grey-300">( Click space to Move )</Text>
            </View>
            <Input
              multiline
              style={{ height: 80 }}
              placeholder="List the things you like"
            />
          </View> */}

          <View className="mt-4">
            <Button
              label="Save"
              loading={isUploading || isLoading}
              onPress={handleSave}
            />
          </View>

          <View className="h-[40px]" />
        </KeyboardAvoidingView>
        <View className="h-[250px] w-[50px]"></View>
      </Header>
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
          contentFit="fill"
          className="w-full h-full"
        />
      ) : (
        <PlusSvg />
      )}
    </TouchableOpacity>
  );
};
