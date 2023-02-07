const ConditionalComponent = ({ condition, children }) => {
  return <>{condition && children}</>;
};

export default ConditionalComponent;
