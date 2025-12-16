import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
  const siteTitle = "Rajibraj Raymohapatra | Full Stack Developer";
  const defaultDesc = "Portfolio of Rajibraj Raymohapatra, a Full Stack Java Developer specializing in React, Spring Boot, and Cloud technologies.";
  const siteUrl = "https://rajib-portfolio-two.vercel.app";
  const defaultImage = "https://rajib-portfolio-two.vercel.app/og-image.png"; // Ensure you add an og-image.png to public folder later

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title ? `${title} | Rajibraj` : siteTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || "Full Stack Developer, Java, React, Spring Boot, Portfolio, Rajibraj Raymohapatra"} />
      <meta name="author" content="Rajibraj Raymohapatra" />
      <link rel="canonical" href={url ? `${siteUrl}${url}` : siteUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url ? `${siteUrl}${url}` : siteUrl} />
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

export default SEO;