import React from "react";
import LPage_Section1 from "./LandinPageSection/Lpage_Section1";
import LPage_Section2 from "./LandinPageSection/Lpage_Section2";
import LPage_Section3 from "./LandinPageSection/Lpage_Section3";
import Lpage_faq from "./LandinPageSection/Lpage_faq";
import Lpage_footer from "./LandinPageSection/Lpage_footer";
export default function LandingPage(){
  return(
    <>
      <div>
        <LPage_Section1 /> 
        <LPage_Section2 />
        <LPage_Section3 />
        <Lpage_faq />
        <Lpage_footer />
      </div>
    </>
  )
}