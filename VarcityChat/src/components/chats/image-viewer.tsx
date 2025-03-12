import ImageViewing from "react-native-image-viewing";

type ImageViewerProps = {
  visible: boolean;
  imageUrls: string[];
  initialIndex?: number;
  onClose: () => void;
};

export const ImageViewer = ({
  visible,
  imageUrls,
  initialIndex = 0,
  onClose,
}: ImageViewerProps) => {
  return (
    <ImageViewing
      visible={visible}
      images={imageUrls.map((url) => ({ uri: url }))}
      imageIndex={initialIndex}
      backgroundColor="rgba(0, 0, 0, 0.95)"
      onRequestClose={onClose}
      swipeToCloseEnabled
      doubleTapToZoomEnabled
      presentationStyle="overFullScreen"
      animationType="none"
    />
  );
};
