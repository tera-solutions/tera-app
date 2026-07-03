import type { ReactNode } from "react";

import loginBg from "@/assets/login-bg.png";

import AuthFooter from "./AuthFooter";

interface AuthSceneProps {
  children: ReactNode;
}

/** Shared unauthenticated background + wave footer used by Login and Register. */
const AuthScene = ({ children }: AuthSceneProps) => (
  <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#F3F7FC]">
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 hidden bg-contain bg-left bg-no-repeat xmd:block"
      style={{ backgroundImage: `url(${loginBg})` }}
    />
    <div className="relative z-20 min-h-0 w-full flex-1 overflow-y-auto">
      {children}
    </div>
    <AuthFooter />
  </div>
);

export default AuthScene;
