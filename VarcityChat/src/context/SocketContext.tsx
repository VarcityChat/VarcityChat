import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { View, Text, ActivityIndicator } from "@/ui";
import { BASE_SOCKET_ENDPOINT } from "@/api/api";
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { authStorage } from "@/core/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/core/hooks/use-auth";

const BANNER_HEIGHT = 40;

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuth();
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const initializeSocket = async () => {
      const authData = await authStorage.getAuthData();
      if (authData && authData.token) {
        connect(authData.token);
      }
    };

    initializeSocket();
  }, []);

  useEffect(() => {
    if ((!isConnected || socket === null) && isAuthenticated) {
      translateY.value = withSpring(0, {
        damping: 12,
        stiffness: 100,
      });
      opacity.value = withSpring(1);
    } else {
      translateY.value = withSpring(-BANNER_HEIGHT, {
        damping: 12,
        stiffness: 100,
      });
      opacity.value = withSpring(0);
    }
  }, [isConnected, socket]);

  const bannerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const connect = (token: string) => {
    const socketInstance = io(BASE_SOCKET_ENDPOINT, {
      auth: {
        authToken: token,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log("CONNECTED TO SERVER");
      setSocket(socketInstance);
      setIsConnected(true);
    });

    socketInstance.on("connect_error", (error) => {
      console.log("ERROR CONNECTING TO SERVER", error);
    });

    socketInstance.on("disconnect", () => setIsConnected(false));
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, connect, disconnect }}
    >
      <Animated.View
        className="absolute left-0 right-0 bg-yellow-500 dark:bg-yellow-500 p-2 z-50 h-[40px]"
        style={[bannerStyle, { top: insets.top }]}
      >
        <View className="flex flex-row items-center justify-center gap-2">
          <Text className="text-white text-center">
            Connecting to server...
          </Text>
          <ActivityIndicator size={12} color="white" />
        </View>
      </Animated.View>
      <Animated.View className="flex-1">{children}</Animated.View>
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
