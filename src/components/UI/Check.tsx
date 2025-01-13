import Check from 'public/icons/check.svg';

const CheckIcon = () => {
  return (
    <div className="h-20 w-20 rounded-full bg-success-tint flex justify-center items-center ">
      <div className="h-10 w-10 rounded-full bg-success flex justify-center items-center">
        <Check
          {...{
            style: {
              color: '#FFFFFF',
              width: '30px',
              height: '30px',
            },
          }}
        />
      </div>
    </div>
  );
};

export default CheckIcon;
