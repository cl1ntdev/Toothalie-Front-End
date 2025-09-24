import React,{useRef, useState} from "react";
import NavigationComp from "./LandinPageSection/NavigationComp";
import LPage_Section1 from "./LandinPageSection/Lpage_Section1";
import LPage_Section2 from "./LandinPageSection/Lpage_Section2";
import LPage_Section3 from "./LandinPageSection/Lpage_Section3";
import Lpage_faq from "./LandinPageSection/Lpage_faq";
import Lpage_footer from "./LandinPageSection/Lpage_footer";
import Footer from "./LandinPageSection/Footer";

const sectionStateUpdate = () => {
  
} 

export default function LandingPage(){
  // refs to each section
   const section1Ref = useRef<HTMLDivElement>(null)
   const section2Ref = useRef<HTMLDivElement>(null)
   const section3Ref = useRef<HTMLDivElement>(null)
   const faqRef = useRef<HTMLDivElement>(null)
   const contactRef = useRef<HTMLDivElement>(null)
 
   // function to scroll to a section
   const scrollToSection = (section: string) => {
     switch (section) {
       case 'Home':
         section1Ref.current?.scrollIntoView({ behavior: 'smooth',block:'start' })
         break
       case 'About':
         section2Ref.current?.scrollIntoView({ behavior: 'smooth',block:'start'})
         break
       // case 'Card':
       //   section3Ref.current?.scrollIntoView({ behavior: 'smooth',block:'start' })
         // break
       case 'FAQ':
         faqRef.current?.scrollIntoView({ behavior: 'smooth',block:'start' })
         break
       case 'Contact':
         contactRef.current?.scrollIntoView({ behavior: 'smooth',block:'start' })
         break
     }
   }

  return(
    <>
      <div className="">
        <NavigationComp onChangeNewSection={scrollToSection} />
        <div ref={section1Ref}>
          <LPage_Section1 />           
        </div>
        <div ref={section2Ref}>
          <LPage_Section2 />          
        </div>
        <div ref={section3Ref}>
          <LPage_Section3 />          
        </div>
        <div ref={faqRef}>
          <Lpage_faq />          
        </div>
        <div ref={contactRef}>
          <Footer />          
        </div>
      </div>
    </>
  )
}