import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/playground");
  };
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <section className="py-16 md:py-32 px-6 lg:px-0 max-w-4xl mx-auto">
        <div className="space-y-5 max-w-2xl">
          <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-semibold inline-block">
            v0.1.1 • Waldstein
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold">
            Learn and practice neovim, anytime, anywhere
          </h1>
          <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400">
            Neoverse brings the power of Neovim to your browser, letting you
            practice commands, customize workflows, and enhance your text
            editing skills—all in a seamless, web-based interface. No
            installation needed, just dive in and master Neovim's efficiency.
          </p>
          <div className="!mt-10">
            {width > 700 ? (
              <Button
                variant="default"
                size="lg"
                className="rounded-lg"
                onClick={handleClick}
              >
                Give it a shoot ✨ →
              </Button>
            ) : (
              <div className="bg-red-100 text-red-800 py-1 px-3 rounded-sm text-sm font-semibold inline-block">
                Woops! your'e trying to access the demo version of Neoverse
                while in mobile phone. Please use a desktop browser.
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="rounded-none md:rounded-xl max-w-4xl mx-auto overflow-hidden ring-8 ring-gray-200 dark:ring-white/10">
        <img src="/screenshoot.png" alt="Feedbackjar dashboard" />
      </section>
    </>
  );
};

export default Home;
