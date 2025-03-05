import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Composer, ComposerProps } from "react-native-gifted-chat";

export interface ComposerHandles {
  getText: () => string;
  setText: (text: string) => void;
  clear: () => void;
}

export const CustomComposer = forwardRef<ComposerHandles, ComposerProps>(
  (props, ref) => {
    const [text, setText] = useState("");

    useImperativeHandle(ref, () => ({
      getText: () => text,
      setText: (newText: string) => setText(newText),
      clear: () => setText(""),
    }));

    const handleTextChanged = useCallback((newText: string) => {
      setText(newText);

      if (props.onTextChanged) {
        props.onTextChanged(newText);
      }
    }, []);

    return (
      <Composer {...props} text={text} onTextChanged={handleTextChanged} />
    );
  }
);
