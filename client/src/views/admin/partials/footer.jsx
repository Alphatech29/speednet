const Footer = () => (
  <footer className="w-full bg-white border-t border-gray-100 px-5 py-3 mt-auto">
    <div className="flex flex-col tab:flex-row items-center justify-between gap-1.5 text-center">
      <p className="text-xs text-gray-400">
        Developed with <span className="text-red-500">❤</span> by Alphatech Multimedia Technologies
      </p>
      <p className="text-xs text-gray-400">
        &copy; {new Date().getFullYear()} SpeedNet. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
