import React from "react";
import PropTypes from "prop-types";
import Header from "../partials/header";
import Footer from "../partials/footer";

function Layout({ children, hideHeaderFooter }) {
  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  hideHeaderFooter: PropTypes.bool,
};

export default Layout;
