import React from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

// Component Info
// Description: Display form header with title and description based on edit/create mode.
// Date created: 2025-01-27
// Author: thangtruong

interface FormHeaderProps {
  isEdit: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isEdit }) => (
  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-400">
    {/* Header title section */}
    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
      <DocumentTextIcon className="h-8 w-8" />
      {isEdit ? "Edit Article" : "Create New Article"}
    </h2>
    {/* Header description section */}
    <p className="mt-1 text-sm text-white/80 ">
      {isEdit
        ? "Update the details of your article."
        : "Fill in the details to create a new article."}
    </p>
  </div>
);

export default FormHeader;
