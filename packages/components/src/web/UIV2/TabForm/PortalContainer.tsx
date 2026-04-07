import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const PortalContainer = ({ children }) => {
  const portalRoot = document.getElementById("portal-root-tab-ui");

  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    if (portalRoot) setDomReady(true);
  }, [portalRoot]);

  return domReady && ReactDOM.createPortal(children, portalRoot);
};

export default PortalContainer;
