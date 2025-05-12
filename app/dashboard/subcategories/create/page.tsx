import SubCategoryForm from "../../../components/dashboard/subcategories/SubCategoryForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function CreateSubcategoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <SubCategoryForm />
    </div>
  );
}
