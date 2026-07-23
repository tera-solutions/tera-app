import CloudBackdrop from "_common/components/CloudBackdrop";

import LoginForm from "./containers/LoginForm";
import LoginHero from "./containers/LoginHero";
import LoginIntro from "./containers/LoginIntro";

const LoginPage = () => (
  <div className='relative flex min-h-screen flex-col overflow-x-clip xl:flex-row xl:items-center xl:justify-between xl:gap-10 xl:px-10 xl:py-10'>
    {/* Nền trời + mây nằm ở lớp `fixed` riêng nên luôn phủ kín khung nhìn */}
    <CloudBackdrop />

    <LoginHero />
    <LoginIntro className='relative z-10 mx-auto hidden xl:block' />
    <LoginForm />
  </div>
);

export default LoginPage;
