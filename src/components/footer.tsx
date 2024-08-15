import React from "react";

const Footer = () => {
  return (
    <section className="p-2  bg-white dark:bg-gray-950 dark:border-white/10 px-2 sm:px-0">
      <div className="max-w-4xl mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
        Neoverse is built by &nbsp;
        <a className="underline" target="_blank" href="https://bijhoo.my.id">
          abizarah
        </a>
        &nbsp; with ❤️ in Indonesia.
      </div>
    </section>
  );
};

export default Footer;
