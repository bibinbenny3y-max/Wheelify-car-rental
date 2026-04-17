const Footer = () => {
  return (
    <footer className="bg-white text-[#d4af37] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()} Wheelify Vehicle Rental. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex gap-6 text-sm font-medium">
          <span className="cursor-pointer hover:opacity-70">
            Privacy Policy
          </span>
          <span className="cursor-pointer hover:opacity-70">
            Terms
          </span>
          <span className="cursor-pointer hover:opacity-70">
            Contact
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
