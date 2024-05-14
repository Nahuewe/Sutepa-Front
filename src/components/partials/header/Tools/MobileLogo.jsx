import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";

import MainLogo from "@/assets/images/logo/logo.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
// import giroIcon from "../../../../assets/images/logo/logo-giro.svg"
import LogoMuni from "@/assets/images/logo/logo-giro.svg"
const MobileLogo = () => {
  const [isDark] = useDarkMode();
  return (
    <Link to="/">
      <img src={LogoMuni} alt="" />
    </Link>
  );
};

export default MobileLogo;
