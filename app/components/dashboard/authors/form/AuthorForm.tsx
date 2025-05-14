"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Author } from "@/app/lib/definition";
import { authorSchema } from "./authorSchema";
import { useRouter } from "next/navigation";
import { createAuthor, updateAuthor } from "@/app/lib/actions/authors";
import toast from "react-hot-toast";
import { AuthorFormFields } from "./fields";

interface AuthorFormProps {
  author?: Author;
}

export default function AuthorForm({ author }: AuthorFormProps) {
  const router = useRouter();
  const isEditMode = !!author;

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(authorSchema),
    defaultValues: author || {
      name: "",
      description: "",
      bio: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    try {
      if (isEditMode && author) {
        await updateAuthor(author.id, data);
        toast.success("Author updated successfully");
      } else {
        await createAuthor(data);
        toast.success("Author created successfully");
      }
      router.push("/dashboard/author");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-lg font-medium text-white">
          {isEditMode ? "Edit Author" : "Create Author"}
        </h2>
        <p className="mt-1 text-sm text-white/80">
          {isEditMode
            ? "Update the author's information below."
            : "Fill in the author's information below."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        <AuthorFormFields
          register={register}
          errors={errors}
          control={control}
          isEditMode={isEditMode}
        />

        {/* Form actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update Author"
              : "Create Author"}
          </button>
        </div>
      </form>
    </div>
  );
}
