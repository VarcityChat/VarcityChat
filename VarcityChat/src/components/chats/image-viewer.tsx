import { StyleSheet, Modal, View } from "react-native";
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
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
});
