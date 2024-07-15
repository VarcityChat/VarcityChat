import { useMemo } from "react";
import Discover from "@/ui/icons/discover";
import DiscoverActive from "@/ui/icons/discover-active";

export type IconName =
  | "discover"
  | "discover-active"
  | "chats"
  | "chats-active";

const iconsMap: Record<IconName, any> = {
  "discover-active": Discover,
  discover: DiscoverActive,
  chats: "",
  "chats-active": "",
};

export function Icon({
  name,
  ...props
}: {
  name: IconName;
  fill: string;
  style?: any;
  width: number;
  height: number;
}) {
  const Comp = useMemo(() => {
    const icon = iconsMap[name];
    return icon;
  }, [name]);

  return <Comp color={props.fill} />;
}
