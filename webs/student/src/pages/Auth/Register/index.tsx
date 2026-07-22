import CloudBackdrop from "_common/components/CloudBackdrop";

import RegisterForm from "./containers/RegisterForm";
import RegisterHero from "./containers/RegisterHero";
import RegisterIntro from "./containers/RegisterIntro";

const RegisterPage = () => (
  <div className='relative flex min-h-screen flex-col overflow-x-clip xl:flex-row xl:items-center xl:justify-between xl:gap-10 xl:px-10 xl:py-10'>
    <CloudBackdrop />

    <RegisterHero />
    <RegisterIntro className='relative z-10 mx-auto hidden xl:block' />
    <RegisterForm />
  </div>
);

export default RegisterPage;
