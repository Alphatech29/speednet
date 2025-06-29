// components/SeoManager.jsx
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { GlobalContext } from '../control/globalContext';

const SeoManager = () => {
  const { webSettings } = useContext(GlobalContext);

  if (!webSettings) return null;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{`${webSettings?.site_name} - ${webSettings?.tagline}`}</title>
      <meta
        name="description"
        content={webSettings?.web_description || 'Speednet - Discover, verify, and earn.'}
      />
      <meta
        name="keywords"
        content={
          webSettings?.keywords ||
          'Speednet, verify accounts, premium vpn, earn online'
        }
      />
      <meta
        name="author"
        content={webSettings?.site_name || 'Speednet Team'}
      />

      {/* Favicon */}
      <link
        rel="icon"
        type="image/svg+xml"
        href={webSettings?.favicon || '/favicon.svg'}
      />
      {/* Custom header */}
      {webSettings?.header_code}

      {/* Open Graph / Social Sharing */}
      <meta
        property="og:title"
        content={webSettings?.site_name || webSettings?.tagline || 'Speednet'}
      />
      <meta
        property="og:description"
        content={webSettings?.web_description || 'Discover, verify, and purchase genuine accounts.'}
      />
      <meta
        property="og:image"
        content={webSettings?.logo || '/default-og.png'}
      />
      <meta
        property="og:url"
        content={webSettings?.web_url || window.location.href}
      />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SeoManager;
