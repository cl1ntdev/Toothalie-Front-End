import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import LaunchUI from "@/components/logos/launch-ui";
import {
  Footer,
  FooterBottom,
  FooterColumn,
  FooterContent,
} from "@/components/ui/footer";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showModeToggle?: boolean;
  className?: string;
}

export default function Lpage_footer({
  logo = <LaunchUI />,
  name = "Toothalie",
  columns = [
    {
      title: "Product",
      links: [
        { text: "Changelog", href: siteConfig.url },
        { text: "Documentation", href: siteConfig.url },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", href: siteConfig.url },
        { text: "Careers", href: siteConfig.url },
        { text: "Blog", href: siteConfig.url },
      ],
    },
    {
      title: "Contact",
      links: [
        { text: "Discord", href: siteConfig.url },
        { text: "Twitter", href: siteConfig.url },
        { text: "Github", href: siteConfig.links.github },
      ],
    },
  ],
  copyright = "© 2025 Mikołaj Dobrucki. All rights reserved",
  policies = [
    { text: "Privacy Policy", href: siteConfig.url },
    { text: "Terms of Service", href: siteConfig.url },
  ],
  showModeToggle = true,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "w-full px-4 bg-gray-900 text-gray-200", // dark base
        className
      )}
    >
      <div className="max-w-container mx-auto">
        <Footer className="bg-gray-900">
          <FooterContent>
            {/* Logo / name */}
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                {logo}
                <h3 className="text-xl font-bold">{name}</h3>
              </div>
            </FooterColumn>

            {/* Footer columns */}
            {columns.map((column, index) => (
              <FooterColumn key={index}>
                <h3 className="text-2xl pt-1 font-semibold">{column.title}</h3>
                {column.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="text-lg text-gray-400 hover:text-white transition-colors"
                  >
                    {link.text}
                  </a>
                ))}
              </FooterColumn>
            ))}
          </FooterContent>

          {/* Bottom bar */}
          <FooterBottom className="border-t border-gray-700 pt-4 mt-4 text-gray-400">
            <div className="text-sm">{copyright}</div>
            <div className="flex items-center gap-4 text-sm">
              {policies.map((policy, index) => (
                <a
                  key={index}
                  href={policy.href}
                  className="hover:text-white transition-colors"
                >
                  {policy.text}
                </a>
              ))}
              {showModeToggle && <ModeToggle />}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
