interface ITitleModal {
  title: string;
  employeeName: string;
}

const TitleModal = ({ title, employeeName }: ITitleModal) => {
  return (
    <p className="flex gap-2 font-medium text-gray-800">
      {title}
      <span className="uppercase text-blue-600">{employeeName}</span>
    </p>
  );
};

export default TitleModal;
