import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface DesktopLayoutProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

function DesktopLayout({ collapsed, onToggleCollapse }: DesktopLayoutProps) {
  return (
    <>
      <Topbar />
      <Sidebar collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </>
  );
}

export default DesktopLayout;
