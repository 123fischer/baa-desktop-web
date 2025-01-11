'use client';

const Footer = () => {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto px-4 flex justify-between items-center text-sm text-dark">
        <p>© Copyright 2004 - 2024 CARAUKTION AG</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-dark">
            Documentation
          </a>
          <a href="#" className="hover:text-dark">
            Help
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
