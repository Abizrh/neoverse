import React from "react";
import { Button } from "@/components/ui/button";

const OpenSource: React.FC = () => {
  return (
    <section className="pb-16 sm:pb-32 px-6 lg:px-0 max-w-4xl mx-auto">
      <div className="space-y-5 max-w-2xl">
        <h2 className="font-display text-2xl md:text-4xl font-bold">
          We're open source
        </h2>
        <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400">
          We strongly believe open source is the future of software development.
          It could even be a compliance requirement in the future. Check us out
          on GitHub and star us if you like what we're doing.
        </p>
        <div className="flex items-center gap-x-3">
          <Button variant="default" size="lg" className="rounded-lg">
            Github
          </Button>
          <span> ⭐ 1 stars</span>
        </div>
      </div>
    </section>
  );
};

export default OpenSource;
