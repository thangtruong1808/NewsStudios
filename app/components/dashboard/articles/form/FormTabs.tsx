type TabType = "basic" | "content" | "media" | "settings";

import type { Dispatch, SetStateAction } from "react";

interface FormTabsProps {
  activeTab: TabType;
  onTabChange: Dispatch<SetStateAction<TabType>>;
}

// Tabs configuration for form sections navigation.
const FORM_TABS: Array<{ key: TabType; label: string }> = [
  { key: "basic" as const, label: "Basic Information" },
  { key: "content" as const, label: "Content" },
  { key: "media" as const, label: "Media" },
  { key: "settings" as const, label: "Settings" },
];

// Description: Render navigation tabs allowing switch between article form sections.
// Data created: 2024-11-13
// Author: thangtruong
export default function FormTabs({ activeTab, onTabChange }: FormTabsProps) {
  return (
    <div className="flex space-x-2 border-b border-gray-200 mb-4">
      {/* Tab buttons */}
      {FORM_TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none transition-colors duration-150
            ${activeTab === key
              ? "bg-blue-100 border-l border-t border-r border-gray-200 text-blue-600"
              : "bg-gray-100 text-gray-500 hover:text-blue-600"
            }
          `}
          onClick={() => onTabChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
