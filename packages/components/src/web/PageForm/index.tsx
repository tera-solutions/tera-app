import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowSmallLeftSolid, Breadcrumb, ItemType } from 'tera-dls';

interface PageFormProps {
  breadcrumb: ItemType[];
  rightHeader?: React.ReactNode;
  children: React.ReactNode;
  onClickBack?: () => void;
}

const PageForm = (props: PageFormProps) => {
  const { breadcrumb, rightHeader, children, onClickBack } = props;
  const navigate = useNavigate();
  return (
    <div className="tera-page-form !gap-0 relative">
      <div className="page-header-sticky border-b">
        <div className="page-header-v2">
          <div className="page-header-v2__breadcrumb">
            <div
              className="cursor-pointer page-header__breadcrumb-back"
              onClick={() => (onClickBack ? onClickBack : navigate(-1))}
            >
              <ArrowSmallLeftSolid className="h-6" />
            </div>
            <Breadcrumb separator={'/'} items={breadcrumb} />
          </div>
          {rightHeader && (
            <div className="page-header-v2__function">{rightHeader}</div>
          )}
        </div>
      </div>
      <div className="page-content-v2">{children}</div>
    </div>
  );
};

export default PageForm;
