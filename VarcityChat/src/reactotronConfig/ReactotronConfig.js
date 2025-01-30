import ReactTotron, { networking } from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

ReactTotron.configure()
  .useReactNative()
  .use(reactotronRedux())
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
