import CheckBox from "@tera/components/dof/Control/CheckBox";

// ${
// isError
//   ? 'border-red-500 checked:border-red-500'
//   : 'border-white checked:border-white'
//}
const CheckedRules = ({ isError }) => {
  return (
    <CheckBox
      containerClassName="flex items-start"
      className={`bg-inherit border-[2px] border-white checked:bg-inherit checked:border-[2px] checked:border-white focus:border-none 
      ${
        isError
          ? "border-red-500 checked:border-red-500 focus:ring-red-500 focus:ring-offset-0"
          : "border-white checked:border-white"
      }
      `}
    >
      <div className="text-[#111827] break-words">
        Tôi đã xem và đồng ý{" "}
        <span className="text-[#0095D9]">Điều khoản dịch vụ</span> &{" "}
        <span className="text-[#0095D9]">Chính sách bảo mật của Tera</span>
      </div>
    </CheckBox>
  );
};

export default CheckedRules;
