import SubcategoryForm from "@/app/components/dashboard/subcategories/form/SubcategoryForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CreateSubcategoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/subcategories"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Subcategories
        </Link>
      </div>
      <SubcategoryForm />
    </div>
  );
}
