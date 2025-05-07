import { NewspaperIcon } from "@heroicons/react/24/outline";

interface ArticleHeaderProps {
  title: string;
}

export const ArticleHeader = ({ title }: ArticleHeaderProps) => (
  // <span className="flex items-center w-full text-2xl font-bold text-gray-900 p-2 bg-red-500 rounded-lg mb-4 text-white">
  //   <NewspaperIcon className="h-6 w-6 mr-2" />
  //   {title}
  // </span>
  <span className="flex items-center w-full text-2xl font-bold text-white p-2 bg-emerald-600 rounded-lg mb-4">
    <NewspaperIcon className="h-6 w-6 mr-2" />
    {title}
  </span>
);
