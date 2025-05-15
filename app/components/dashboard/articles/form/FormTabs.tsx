import React from "react";

interface FormTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: "basic", label: "Basic Information" },
  { key: "content", label: "Content" },
  { key: "media", label: "Media" },
  { key: "settings", label: "Settings" },
];

const FormTabs: React.FC<FormTabsProps> = ({ activeTab, onTabChange }) => (
  <div className="flex space-x-2 border-b border-gray-200 mb-4">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        type="button"
        className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none transition-colors duration-150
          ${
            activeTab === tab.key
              ? "bg-blue-100 border-l border-t border-r border-gray-200 text-indigo-600"
              : "bg-gray-100 text-gray-500 hover:text-indigo-600"
          }
        `}
        onClick={() => onTabChange(tab.key)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default FormTabs;
