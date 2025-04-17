import React from "react";
import Logo from "/Logo.png";
import PinataPng from "/pinata.svg"

const Nav = () => {
  return (
    <nav className="text-white pt-2">
      <div className="flex justify-between items-center rounded-xl bg-[#222] max-w-screen-lg mx-auto px-12 bg-gradient-to-r from-[#000] to-[#FF00CC] max-xl:mx-12 max-lg:px-8 max-md:mx-6">
        <div className="flex items-center gap-1">
          <img src={Logo} alt="Logo" className="h-16 w-16 saturate-200 brightness-200" />
          <h1 className="text-xl font-bold tracking-tight font-mono max-md:text-md">ShareSphere</h1>
        </div>
        <div className="max-lg:hidden">
            <h1 className="text-lg font-semibold tracking-tighter underline max-md:text-sm">Decentralised File System</h1>
        </div>
        <div className="flex items-center gap-2">
            <h1 className="text-md max-md:text-sm">Powered by:</h1>
            <img src={PinataPng} alt="" className="w-24 max-md:w-20"/>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
