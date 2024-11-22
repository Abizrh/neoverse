import React from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface BentoGridItemProps {
  children?: React.ReactNode;
  className?: string;
}

export const BentoGridItem: React.FC<BentoGridItemProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface BentoGridCardProps {
  name: string;
  icon?: React.ComponentType;
  description: string;
  href: string;
  cta: string;
  className?: string;
}

export const BentoGridCard: React.FC<BentoGridCardProps> = ({
  name,
  icon: Icon,
  description,
  href,
  cta,
  className,
}) => {
  return (
    <div
      className={cn(
        "group relative col-span-3 flex flex-col justify-end overflow-hidden rounded-xl",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        className,
      )}
    >
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
        {Icon ? (
          <Icon className="size-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
        ) : (
          <div className="size-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
        )}
        <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          {name}
        </h3>
        <p className="max-w-lg text-neutral-400">{description}</p>
      </div>
      <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <button
          className="pointer-events-auto px-2 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={() => (window.location.href = href)}
        >
          {cta} →
        </button>
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
    </div>
  );
};

export const BentoGridExample: React.FC = () => {
  const items = [
    {
      title: "The Dawn of Innovation",
      description: "Explore the birth of groundbreaking ideas and inventions.",
    },
    {
      title: "The Digital Revolution",
      description: "Dive into the transformative power of technology.",
    },
    {
      title: "The Art of Design",
      description: "Discover the beauty of thoughtful and experience design.",
    },
    {
      title: "The Power of Communication",
      description:
        "Understand the impact of effective communication in our lives.",
    },
    {
      title: "The Pursuit of Knowledge",
      description: "Join the quest for understanding and enlightenment.",
    },
    {
      title: "The Joy of Creation",
      description: "Experience the thrill of bringing ideas to life.",
    },
    {
      title: "The Spirit of Adventure",
      description: "Embark on exciting journeys and thrilling discoveries.",
    },
  ];

  return (
    <BentoGrid>
      {items.map((item, index) => (
        <BentoGridItem
          key={index}
          className={index === 3 || index === 6 ? "md:col-span-2" : ""}
        >
          <div className="flex size-full animate-pulse space-x-4">
            <div className="flex size-full flex-1 rounded-md bg-zinc-800"></div>
          </div>
          <div className="transition duration-200 group-hover/bento:translate-x-2">
            <div className="my-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
              <strong>{item.title}</strong>
            </div>
            <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
              <p>{item.description}</p>
            </div>
          </div>
        </BentoGridItem>
      ))}
    </BentoGrid>
  );
};
