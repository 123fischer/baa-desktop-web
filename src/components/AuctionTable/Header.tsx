const Header = () => {
  const columns = [
    '',
    'Brand & Model',
    'Year',
    'Mileage',
    'Location',
    'Current Bid',
    'Time Left',
    '',
    '',
  ];

  return (
    <thead>
      <tr>
        {columns.map((column, key) => (
          <th
            key={key}
            className="py-4 px-2 border-b text-left font-normal text-dark opacity-70 text-sm"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Header;
