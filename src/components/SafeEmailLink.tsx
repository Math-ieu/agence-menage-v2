import React from "react";

interface SafeEmailLinkProps {
  email?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * SafeEmailLink renders an email mailto link wrapped in Cloudflare's `<!--email_off-->` tags.
 * This prevents Cloudflare Scrape Shield from rewriting the link into `/cdn-cgi/l/email-protection`
 * which causes 404 broken links in SEO crawlers (Ahrefs, Semrush, Screaming Frog, Googlebot).
 */
export default function SafeEmailLink({
  email = "contact@agencemenage.ma",
  className = "",
  children,
}: SafeEmailLinkProps) {
  const label = typeof children === "string" ? children : email;
  const htmlContent = `<!--email_off--><a href="mailto:${email}" class="${className}">${label}</a><!--/email_off-->`;

  return <span dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
