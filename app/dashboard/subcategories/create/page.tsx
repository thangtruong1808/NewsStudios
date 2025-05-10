import SubCategoryForm from "../../../components/dashboard/subcategories/SubCategoryForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CreateSubcategoryPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Subcategory</h1>
        <p className="text-gray-600">
          Add a new subcategory to organize your content.
        </p>
      </div>
      <SubCategoryForm />
    </div>
  );
}
