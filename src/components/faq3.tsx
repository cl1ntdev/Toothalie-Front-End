import React, { useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/24/outline';
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Faq3Props {
  heading: string;
  description: string;
  items?: FaqItem[];
  supportHeading: string;
  supportDescription: string;
  supportButtonText: string;
  supportButtonUrl: string;
}

const faqItems = [
  {
    id: "faq-1",
    question: "What is a FAQ?",
    answer:
      "A FAQ is a list of frequently asked questions and answers on a particular topic.",
  },
  {
    id: "faq-2",
    question: "What is the purpose of a FAQ?",
    answer:
      "The purpose of a FAQ is to provide answers to common questions and help users find the information they need quickly and easily.",
  },
  {
    id: "faq-3",
    question: "How do I create a FAQ?",
    answer:
      "To create a FAQ, you need to compile a list of common questions and answers on a particular topic and organize them in a clear and easy-to-navigate format.",
  },
  {
    id: "faq-4",
    question: "What are the benefits of a FAQ?",
    answer:
      "The benefits of a FAQ include providing quick and easy access to information, reducing the number of support requests, and improving the overall user experience.",
  },
  {
    id: "faq-5",
    question: "How should I organize my FAQ?",
    answer:
      "You should organize your FAQ in a logical manner, grouping related questions together and ordering them from most basic to more advanced topics.",
  },
  {
    id: "faq-6",
    question: "How long should FAQ answers be?",
    answer:
      "FAQ answers should be concise and to the point, typically a few sentences or a short paragraph is sufficient for most questions.",
  },
  {
    id: "faq-7",
    question: "Should I include links in my FAQ?",
    answer:
      "Yes, including links to more detailed information or related resources can be very helpful for users who want to learn more about a particular topic.",
  },
];

const Faq3 = ({
  heading = "Frequently Asked Questions",
  description = "Find answers to common questions about our products. Can't find what you're looking for? Contact our support team.",
  items = faqItems,
}: Partial<Faq3Props>) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-24 bg-gray-900 text-gray-200 w-full font-poppins">
          <div className="container mx-auto max-w-4xl px-4">
            {/* Heading */}
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-ceramon font-bold text-white">
                {heading}
              </h2>
              <p className="text-gray-400 md:text-lg">{description}</p>
            </div>
    
            {/* FAQ items */}
            <div className="space-y-6">
              {items.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div
                    key={item.id}
                    className="overflow-hidden w-full bg-gray-800 rounded-2xl shadow-md transition hover:shadow-lg"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-5 font-semibold text-left flex justify-between items-center hover:bg-gray-700/60 transition-colors rounded-2xl"
                    >
                      <span className="text-lg md:text-xl">{item.question}</span>
                      <ChevronDownIcon
                        className={`w-6 h-6 ml-3 transform transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`px-6 pb-5 text-base md:text-lg text-gray-300 leading-relaxed transition-all duration-300 ${
                        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                      } overflow-hidden`}
                    >
                      {item.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
  );
};

export { Faq3 };
