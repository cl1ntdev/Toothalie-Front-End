import React from "react";
import HeroSection from './LandinPageSection/Hero'
import LPage_Section1 from "./LandinPageSection/Lpage_Section1";
import LPage_Section2 from "./LandinPageSection/Lpage_Section2";
import Lpage_faq from "./LandinPageSection/Lpage_faq";
export default function LandingPage(){
  return(
    <>
      <div>
        <HeroSection /> 
        <LPage_Section1 />
        <LPage_Section2 />
        <Lpage_faq />
      </div>
    </>
  )
}