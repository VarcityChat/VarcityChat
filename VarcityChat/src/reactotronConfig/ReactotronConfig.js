import ReactTotron, { networking } from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";
import { MMKV } from "react-native-mmkv";
import mmkvPlugin from "reactotron-react-native-mmkv";

const REACTOTRON_ASYNC_CLIENT_ID = "@REACTOTRON/clientId";
const storage = new MMKV({ id: REACTOTRON_ASYNC_CLIENT_ID });
const getClientId = async () => storage.getString(REACTOTRON_ASYNC_CLIENT_ID);
const setClientId = async (clientId) =>
  storage.set(REACTOTRON_ASYNC_CLIENT_ID, clientId);

ReactTotron.configure({ getClientId, setClientId })
  .useReactNative()
  .use(reactotronRedux())
  .use(mmkvPlugin({ storage, ignore: ["secret", "persist:root"] }))
  .use(networking())
  .connect();

const yeOldeConsoleLog = console.log;

console.log = (...args) => {
  yeOldeConsoleLog(...args);
  ReactTotron.display({
    name: "CONSOLE.LOG",
    value: args,
    preview: args.length > 0 && typeof args[0] === "string" ? args[0] : null,
  });
};

export default ReactTotron;
