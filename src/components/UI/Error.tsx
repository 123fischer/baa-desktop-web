import Exclamation from 'public/icons/exclamation.svg';

const ErrorIcon = () => {
  return (
    <div className="h-20 w-20 rounded-full bg-red-100 flex justify-center items-center ">
      <div className="h-10 w-10 rounded-full bg-red-300 flex justify-center items-center">
        <Exclamation />
      </div>
    </div>
  );
};

export default ErrorIcon;
