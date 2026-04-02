import { useContext } from "react";
import { Helmet } from "react-helmet";
import { GlobalContext } from "../control/globalContext";

/**
 * Per-page SEO component.
 * Usage:
 *   <PageSeo
 *     title="VPN Service"
 *     description="Premium VPN accounts at the best prices."
 *     keywords="vpn, nordvpn, expressvpn"
 *     path="/services/vpn"
 *   />
 *
 * title    — page-specific title. Rendered as "{title} | {site_name}"
 * description — page-specific meta description (max ~160 chars)
 * keywords — comma-separated page keywords (merged with site keywords)
 * path     — URL path e.g. "/services/vpn" used for canonical + OG URL
 * image    — optional OG image override (defaults to site logo)
 */
const PageSeo = ({ title, description, keywords, path = "/", image }) => {
  const { webSettings } = useContext(GlobalContext);

  const siteName   = webSettings?.site_name  || "Speednet";
  const siteUrl    = (webSettings?.web_url   || "").replace(/\/+$/, "");
  const siteLogo   = webSettings?.logo       || "/image/user-logo.png";
  const siteDesc   = webSettings?.web_description || "Africa's #1 digital marketplace — accounts, VPN, VTU and P2P trading.";
  const siteKw     = webSettings?.keywords   || "speednet, digital marketplace, vpn, vtu, accounts";
  const favicon    = webSettings?.favicon    || "/favicon.svg";

  const fullTitle  = title ? `${title} | ${siteName}` : `${siteName} — ${webSettings?.tagline || "Digital Marketplace"}`;
  const metaDesc   = description || siteDesc;
  const metaKw     = keywords   ? `${keywords}, ${siteKw}` : siteKw;
  const ogImage    = image || siteLogo;
  const canonical  = `${siteUrl}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description"  content={metaDesc} />
      <meta name="keywords"     content={metaKw} />
      <meta name="author"       content={siteName} />
      <link rel="canonical"     href={canonical} />
      <link rel="icon" type="image/svg+xml" href={favicon} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={siteName} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:url"         content={canonical} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image"       content={ogImage} />
    </Helmet>
  );
};

export default PageSeo;
