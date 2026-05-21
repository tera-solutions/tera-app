import { useEffect, useState } from "react";

import { LobbyScene } from "./scenes/LobbyScene";
import AuthPopup from "./components/AuthPopup";
export const LobbyScreen = () => {
  const [openAuth, setOpenAuth] = useState(false);

  useEffect(() => {
    const scene = new LobbyScene();

    scene.init();
    const open = () => {
      setOpenAuth(true);
    };

    window.addEventListener("open-auth", open);

    return () => {
      scene.destroy();
      window.removeEventListener("open-auth", open);
    };
  }, []);

  return (
    <>
      <div id="lobby-game" className="w-screen h-screen overflow-hidden" />
      {openAuth && <AuthPopup />}
    </>
  );
};
