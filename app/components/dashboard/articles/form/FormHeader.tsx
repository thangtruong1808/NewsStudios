import React from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

interface FormHeaderProps {
  isEdit: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isEdit }) => (
  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-400">
    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
      <DocumentTextIcon className="h-8 w-8" />
      {isEdit ? "Edit Article" : "Create New Article"}
    </h2>
    <p className="mt-1 text-sm text-white/80">
      {isEdit
        ? "Update the details of your article."
        : "Fill in the details to create a new article."}
    </p>
  </div>
);

export default FormHeader;
