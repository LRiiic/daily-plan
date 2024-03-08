import { React } from "react";
import DailyPlanLogo from '/dailyplan-logo.svg'
import '../../index.css';
import './style.css';
import { useEffect, useState } from "react";

function NavBar() {
  return (
    <nav>
      <img src={DailyPlanLogo} alt="Daily Plan Logo" width="50%"/>
    </nav>
  );
}

export default NavBar;