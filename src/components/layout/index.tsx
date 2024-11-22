import React from "react";
import Navbar from "./header";
import Hero from "./hero";
import Explainer from "./explainer";
import OpenSource from "./opensource";
import Footer from "./footer";
import { BentoGridExample } from "./bento";

function layout() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <Explainer />
      <OpenSource />
      <Footer />
    </div>
  );
}

export default layout;
