import React from "react";
import { motion } from "framer-motion";
import { FileText, BookOpen, Video, Download } from "lucide-react";

interface ResourceItem {
  id: number;
  title: string;
  description: string;
  category: "Article" | "Guide" | "Video" | "Download";
  link: string;
  thumbnail?: string;
}

const resources: ResourceItem[] = [
  {
    id: 1,
    title: "Getting Started with CodeApsTech",
    description:
      "Learn how to begin your journey with our platform, explore key features, and start building faster.",
    category: "Guide",
    link: "/docs/getting-started",
    thumbnail: "/assets/resources/guide.jpg",
  },
  {
    id: 2,
    title: "Understanding Modern Web Architecture",
    description:
      "A deep dive into scalable backend, frontend, and cloud infrastructure used in 2025 web apps.",
    category: "Article",
    link: "/blog/web-architecture",
    thumbnail: "/assets/resources/article.jpg",
  },
  {
    id: 3,
    title: "API Integration Walkthrough",
    description:
      "Watch a complete video tutorial on integrating third-party APIs using Node.js and React.",
    category: "Video",
    link: "https://youtube.com/",
    thumbnail: "/assets/resources/video.jpg",
  },
  {
    id: 4,
    title: "Download Free UI Kit",
    description:
      "Get our professionally designed UI Kit to jumpstart your next web project with clean components.",
    category: "Download",
    link: "/downloads/ui-kit.zip",
    thumbnail: "/assets/resources/ui-kit.jpg",
  },
];

const iconMap: Record<ResourceItem["category"], JSX.Element> = {
  Article: <BookOpen className="w-4 h-4 text-blue-500" />,
  Guide: <FileText className="w-4 h-4 text-green-500" />,
  Video: <Video className="w-4 h-4 text-red-500" />,
  Download: <Download className="w-4 h-4 text-purple-500" />,
};

export const ResourcesSection: React.FC = () => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Resources
        </h3>
        <p className="text-xs text-gray-600">
          Guides, articles, and tutorials to help you learn.
        </p>
      </div>

      <div className="space-y-3">
        {resources.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className="flex-shrink-0 mt-0.5">
                  {iconMap[item.category]}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="inline-block text-xs text-gray-400 mt-1.5">
                    {item.category}
                  </span>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};