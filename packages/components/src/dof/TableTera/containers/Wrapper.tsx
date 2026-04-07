import customTwMerge from "tailwind-merge.config";

const Wrapper = (props) => {
  const { className, children, wrapperProps = {} } = props;
  const { className: wrapperClassName, ...restProps } = wrapperProps;
  return (
    <tbody
      {...restProps}
      className={customTwMerge(className, wrapperClassName)}
    >
      {children}
    </tbody>
  );
};

export default Wrapper;
