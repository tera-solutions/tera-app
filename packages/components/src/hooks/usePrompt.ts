import React, { useCallback, useContext, useEffect } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { ModalProps } from "tera-dls";

const useConfirmExit = (
  confirmExit: (confirmNavigation: () => void) => void,
  when = true,
) => {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    navigator.push = (...args: Parameters<typeof push>) => {
      const confirm = () => push(...args);
      confirmExit(confirm);
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, confirmExit, when]);
};

export const usePrompt = (
  message: string | React.ReactNode,
  when = true,
  propsModal?: ModalProps,
  customFooter?: (confirmNavigation: () => void) => React.ReactNode,
  onContinue?: () => void,
) => {
  const confirm = useConfirm();
  useEffect(() => {
    if (when) {
      window.onbeforeunload = function () {
        0;
        return message;
      };
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [message, when]);

  const confirmExit = useCallback(
    (confirmNavigation: () => void) => {
      const onOk = () => {
        if (onContinue) onContinue();
        confirmNavigation();
      };

      customFooter(confirmNavigation);

      confirm.warning({
        title: "Thoát bản ghi",
        content: message,
        onOk,
        ...propsModal,
        footer: customFooter(confirmNavigation),
      });
    },
    [message, onContinue],
  );

  useConfirmExit(confirmExit, when);
};
