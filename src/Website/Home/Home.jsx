import React from "react";
import { Helmet } from "react-helmet-async";
import Banner from "../Banner/Banner";
import Footer from "../Footer/Footer";
import AboutVision from "../Vision/AboutVision";
import ClientHome from "./ClientHome";
import ServiceHome from "./Servicehome";
import ProjectHome from "./Projecthome";
import OurStory from "./OurStory";
import Video from "./Video";
import HeroSection from "./HeroSection";

function Home() {
  // SEO values for homepage
  const pageTitle = "New Metal Art | Premium Custom Metal Art & Sculptures";
  const metaDescription = "Discover exquisite custom metal art, sculptures, and architectural installations. New Metal Art creates masterpieces in metal for discerning clients across India.";
  const metaKeywords = "metal art, custom metal sculpture, metal wall art, architectural metalwork, industrial art, New Metal Art, metal fabrication India";
  const canonicalUrl = "https://newmetalart.com/";
  const ogImage = "https://newmetalart.com/images/home-og.jpg"; // Replace with actual image URL

  return (
    <>
      <Helmet>
        {/* Basic meta tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="New Metal Art" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="New Metal Art" />
      </Helmet>

      <div className="home-page">
        <Banner />
       <HeroSection/>
        <AboutVision />
        <ClientHome />
        <Video />
        <ProjectHome />
        {/* Footer is commented out in original, but you can add if needed */}
      </div>
    </>
  );
}

export default Home;