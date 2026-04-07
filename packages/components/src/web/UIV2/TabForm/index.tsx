import { useEffect, useRef, useState } from "react";
import { tw } from "tailwind-merge.config";
import { Col, TabItemType, Tabs } from "tera-dls";

export interface TabFormItemProps {
  title: string;
  icon: JSX.Element;
}
export interface TabFormMenuProps {
  [key: string]: TabFormItemProps;
}
interface TabFormProps {
  children: JSX.Element;
  menu: TabFormMenuProps;
}

function TabForm({ children, menu }: TabFormProps) {
  const [activeSection, setActiveSection] = useState(() => {
    const key = Object.keys(menu)[0];
    return key;
  });
  const [margin, setMargin] = useState<number>(0);
  const parentRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleChangeTab = (key) => {
    scrollToSection(key);
  };

  const itemsTab: TabItemType[] = Object.keys(menu).map((key) => ({
    key,
    label: (
      <div className="flex items-center !gap-x-2.5">
        <span className="shrink-0">{menu[key].icon}</span>
        <span className={tw("hidden xmd:block truncate")}>
          {menu[key].title}
        </span>
      </div>
    ),
  }));

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".form-section");

      let currentSection = null;

      const parentDirection = parentRef.current?.getBoundingClientRect();

      const centerY = parentDirection.y + 20;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= centerY && rect.bottom >= centerY) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    parentRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      parentRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [parentRef, parentRef.current]);

  const sections = parentRef.current?.querySelectorAll(".form-section");

  useEffect(() => {
    const sectionsLength = sections?.length;
    const containerHeight =
      parentRef.current?.clientHeight || parentRef.current?.offsetHeight;

    setMargin(
      sectionsLength
        ? containerHeight - sections[sectionsLength - 1]?.clientHeight
        : containerHeight,
    );
  }, [parentRef, parentRef.current, sections]);

  return (
    <div
      className={tw(
        "flex xmd:grid xmd:grid-cols-12 !gap-x-0 bg-white rounded-[5px]",
      )}
    >
      <Col className={tw("xmd:col-span-3 xl:col-span-2 border-r")}>
        <div className="py-4 sticky top-[95px]">
          <Tabs
            tabPosition="left"
            items={itemsTab}
            activeKey={activeSection}
            onChange={handleChangeTab}
            className="border-0 w-full mail-config__item h-full"
            itemClassName="p-2.5 text-gray-500"
            activeClassName="mail-config__item--active"
          />
        </div>
      </Col>
      <div
        className={tw(
          "flex-1 h-[calc(100vh-95px-20px)] xmd:col-span-9 xl:col-span-10 overflow-hidden",
        )}
      >
        <div
          ref={parentRef}
          className="px-2.5 py-4 h-full overflow-auto relative"
          style={{
            paddingBottom: margin,
          }}
        >
          {children}
        </div>
        <div
          id="portal-root-tab-ui"
          className="w-full z-50 sticky bottom-0 left-0 bg-white"
        ></div>
      </div>
    </div>
  );
}

export default TabForm;
