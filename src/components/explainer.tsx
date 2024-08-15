import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // Assuming you're using a utility like `cn` from shadcn
// import { Icons } from '@/components/icons'; // Assuming you have an Icons component set up

const Explainer: React.FC = () => {
  return (
    <section className="py-16 md:py-32 px-6 lg:px-0 max-w-4xl mx-auto">
      <div className="space-y-5 max-w-2xl">
        <h2 className="font-display text-2xl md:text-4xl font-bold">
          What is Feedbackjar?
        </h2>
        <p className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400">
          Everything you need to collect, manage and close feedback, ideas and
          bugs. You focus on building your product, we handle collecting
          feedback, posting them on public boards, prioritizing them with public
          roadmaps and announcing updates to users with changelogs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5 mt-5">
        <Card
          title="Incoming Feedback"
          description="Collect feedback with widget/sdk/api/urls/qr-codes."
          linkTo="/"
          linkText="Learn more →"
        />
        <Card
          title="Roadmaps"
          description="Show what you're working on and what's coming next."
          linkTo="/"
          linkText="Learn more →"
        />
        <Card
          title="Changelogs"
          description="Announce updates to your users with changelogs."
          linkTo="/"
          linkText="Learn more →"
        />
      </div>
    </section>
  );
};

interface CardProps {
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  linkTo,
  linkText,
}) => {
  return (
    <div
      className={cn(
        "h-64 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl flex flex-col p-4 relative cursor-pointer",
        "group",
      )}
    >
      <div
        className={cn(
          "h-12 w-12 dark:text-gray-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-500 transition-all group-hover:rotate-6",
        )}
      >
        {/* <Icons.ArchiveDown /> */}
      </div>
      <div className="mt-auto">
        <h3 className="font-bold font-display text-lg">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-6 mt-1">
          {description}
        </p>
        <Link className="text-xs text-indigo-500" to={linkTo}>
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default Explainer;
