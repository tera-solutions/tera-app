import { useStores } from "hooks/useStores";
import ChatProvider from "@tera/components/shared/Chat/ChatProvider";
import LeftBar from "@tera/components/shared/Chat/containers/LeftBar";
import MessageBoard from "@tera/components/shared/Chat/containers/MessageBoard";
import { toJS } from "mobx";

import { Col, Row } from "tera-dls";

function Chat() {
  const {
    authStore: { user },
  } = useStores();
  return (
    <ChatProvider user={toJS(user)}>
      <div className="bg-white h-full border">
        <Row className="grid grid-cols-4 gap-0 h-full overflow-hidden">
          <Col className="col-span-1">
            <LeftBar />
          </Col>
          <Col className="col-span-3 border-l-[1px] border-l-gray-200">
            <MessageBoard />
          </Col>
        </Row>
      </div>
    </ChatProvider>
  );
}

export default Chat;
