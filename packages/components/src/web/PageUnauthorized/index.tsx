import { useStores } from "@tera/stores/useStores";
import PageError from "@tera/themes/images/uiNew/page-error.png";
import { ArrowLongLeftSolid, Button } from "tera-dls";

interface PageUnauthorizedProps {
  onClickLogin?: () => void;
}

function PageUnauthorized({ onClickLogin }: PageUnauthorizedProps) {
  const {
    globalStore: { auth_url },
  } = useStores();

  return (
    <div className="w-screen h-screen bg-[#1E429F] bg-opacity-[68%] grid grid-cols-2">
      <div className="flex">
        <img alt="page-error" src={PageError} className="m-auto" />
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="text-[180px] leading-[180px] font-semibold text-white">
          401
        </span>
        <span className="uppercase font-bold text-4xl text-white mb-20">
          Unauthorized
        </span>
        <Button
          className="rounded-full border border-white bg-white/10"
          onClick={() => {
            if (onClickLogin) {
              onClickLogin();
              return;
            }
            window.localStorage.clear();
            window.open(`/auth/login`, "_self");
          }}
        >
          <div className="flex justify-center items-center gap-x-2.5">
            <ArrowLongLeftSolid className="w-5 h-5 text-white" />
            <span>Đăng nhập</span>
          </div>
        </Button>
      </div>
    </div>
  );
}

export default PageUnauthorized;
