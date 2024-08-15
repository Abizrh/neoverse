import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/playground");
  };
  return (
    <>
      <section className="py-16 md:py-32 px-6 lg:px-0 max-w-4xl mx-auto">
        <div className="space-y-5 max-w-2xl">
          <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-semibold inline-block">
            v.0.1.23 We're now open source
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-bold">
            Streamlined feedback, public roadmaps, and changelogs.
          </h1>
          <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400">
            Feedbackjar empowers product teams to effortlessly gather feedback,
            track issues, and seamlessly manage them with public roadmaps and
            provide updates via changelogs.
          </p>
          <div className="!mt-10">
            <Button
              variant="default"
              size="lg"
              className="rounded-lg"
              onClick={handleClick}
            >
              Give it a shoot ✨ →
            </Button>
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