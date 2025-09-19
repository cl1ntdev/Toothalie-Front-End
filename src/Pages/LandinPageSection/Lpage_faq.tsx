import React from "react";
import { Faq3 } from "@/components/faq3";

export default function Lpage_faq() {
  return (
    <>
      <Faq3
        heading="Frequently asked questions"
        description="Find answers to common questions about our products. Can't find what you're looking for? Contact our support team."
        supportHeading="Need more help?"
        supportDescription="Our support team is available 24/7 to assist you."
        supportButtonText="Contact support"
        supportButtonUrl="/contact"
      />  
    </>
    
  );
}
