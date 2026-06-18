import React from "react";
import { createPortal } from "react-dom";
import MiniInlineMenu from "./MiniInlineMenu";

interface DrawerMenuProps {
  open?: boolean;
  onClose: (e?: any) => void;
  containerClassName?: string;
}

/**
 * Drawer menu mobile tự quản (KHÔNG dùng <Drawer> của tera-dls — component đó là
 * chỗ duy nhất trong app dùng Drawer và không mở được trên mobile). Portal ra
 * document.body + overlay + panel trượt từ trái, z-index cao hơn top bar/bottom nav (z-49).
 */
function DrawerMenu({ open, onClose }: DrawerMenuProps) {
  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={() => onClose()}
        className={`xmd:hidden fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Panel trượt từ trái */}
      <div
        className={`xmd:hidden fixed top-0 left-0 h-full w-[280px] max-w-[85vw] z-[61] transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MiniInlineMenu onClose={onClose} />
      </div>
    </>,
    document.body,
  );
}

export default DrawerMenu;
