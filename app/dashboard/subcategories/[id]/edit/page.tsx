import SubCategoryForm from "../../../../components/dashboard/subcategories/SubCategoryForm";
import { getSubcategoryById } from "../../../../lib/actions/subcategories";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function EditSubcategoryPage({
  params,
}: {
  params: { id: string };
}) {
  // Validate that the ID is a valid number
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid Subcategory ID
          </h1>
          <p className="text-gray-600 mt-2">
            The subcategory ID you provided is not valid. Please check the URL
            and try again.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/subcategories"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back to Subcategories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch the subcategory data
  const { data: subcategory, error } = await getSubcategoryById(id);

  // Handle case where subcategory is not found
  if (!subcategory) {
    return (
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-red-600">
            Subcategory Not Found
          </h1>
          <p className="text-gray-600 mt-2">
            The subcategory you are looking for does not exist or has been
            deleted.
          </p>
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
          <div className="mt-6">
            <Link
              href="/dashboard/subcategories"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Back to Subcategories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the edit form if subcategory is found
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Subcategory</h1>
        <p className="text-gray-600">Update the details of this subcategory.</p>
      </div>
      <SubCategoryForm subcategoryId={params.id} />
    </div>
  );
}
