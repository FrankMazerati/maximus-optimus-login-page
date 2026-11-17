export type InfoSectionId = "system-center" | "connectors" | "intellibase" | "help-buddy" | "bring-the-work-to-you";

export const INFO_SECTIONS: { id: InfoSectionId; title: string; description: string }[] = [
  {
    id: "system-center",
    title: "System Center",
    description: "Centralized platform operations, system management, and visibility.",
  },
  {
    id: "connectors",
    title: "Connectors",
    description: "Connect external applications, platforms, services, and integrations.",
  },
  {
    id: "intellibase",
    title: "IntelliBase",
    description: "The IntelliStack knowledge and information experience.",
  },
  {
    id: "help-buddy",
    title: "Help Buddy",
    description: "Intelligent assistance, guidance, and platform support.",
  },
  {
    id: "bring-the-work-to-you",
    title: "Bring the Work to You",
    description: "A unified workspace that brings tasks, projects, and activities together across the platform.",
  },
];

export type FooterLink = { label: string; slug: string };
export type FooterColumn = { heading: string; links: FooterLink[]; provisional?: boolean };

const link = (label: string, slug: string): FooterLink => ({ label, slug });

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Explore",
    links: [
      link("Home", "home"),
      link("About Us", "about-us"),
      link("Contact Us", "contact-us"),
      link("Careers", "careers"),
      link("Help Center", "help-center"),
    ],
  },
  {
    heading: "Partner With Us",
    links: [
      link("Partner with IntelliStack", "partner-with-intellistack"),
      link("Partner with IntelliStaff", "partner-with-intellistaff"),
      link("Partner with IntelliHire", "partner-with-intellihire"),
      link("Partner with IntelliWork", "partner-with-intelliwork"),
      link("Become a Tenant Partner", "become-a-tenant-partner"),
    ],
  },
  {
    heading: "Resources",
    links: [
      link("IntelliBase", "intellibase"),
      link("Help Buddy", "help-buddy"),
      link("Connectors", "connectors"),
      link("Bring the Work to You", "bring-the-work-to-you"),
      link("Service Directory", "service-directory"),
    ],
  },
  {
    // Provisional until the previously approved Security & Trust links are supplied.
    heading: "Security & Trust",
    provisional: true,
    links: [
      link("Security Overview", "security-overview"),
      link("Trust Center", "trust-center"),
      link("Compliance", "compliance"),
      link("System Status", "system-status"),
      link("Report a Security Concern", "report-a-security-concern"),
    ],
  },
  {
    heading: "Legal & Privacy",
    links: [
      link("Privacy Policy", "privacy-policy"),
      link("Terms of Service", "terms-of-service"),
      link("Acceptable Use Policy", "acceptable-use-policy"),
      link("How We Handle Your Data", "how-we-handle-your-data"),
      link("Cookie Policy", "cookie-policy"),
    ],
  },
];

/** Content for /info/$slug destination pages. */
export const INFO_PAGES: Record<string, { title: string; summary: string; section: string }> = (() => {
  const pages: Record<string, { title: string; summary: string; section: string }> = {};
  for (const s of INFO_SECTIONS) pages[s.id] = { title: s.title, summary: s.description, section: "Platform" };
  for (const col of FOOTER_COLUMNS) {
    for (const l of col.links) {
      if (pages[l.slug]) continue;
      pages[l.slug] = {
        title: l.label,
        summary: `${l.label} for IntelliStack Systems and the Maximus Optimus Global Operations Center.`,
        section: col.heading,
      };
    }
  }
  return pages;
})();
