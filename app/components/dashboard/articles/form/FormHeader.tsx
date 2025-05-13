import React from "react";

interface FormHeaderProps {
  isEdit: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isEdit }) => (
  <div className="px-6 pt-6 pb-2 border-b border-gray-100 bg-gradient-to-r from-violet-600 to-fuchsia-600">
    <h2 className="text-xl font-semibold text-white">
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
