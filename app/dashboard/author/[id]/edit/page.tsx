import { getAuthorById } from "../../../../lib/actions/authors";
import AuthorForm from "../../../../components/dashboard/authors/AuthorForm";
import { notFound } from "next/navigation";

export default async function EditAuthorPage({
  params,
}: {
  params: { id: string };
}) {
  const authorId = parseInt(params.id);

  if (isNaN(authorId)) {
    notFound();
  }

  const { data: author, error } = await getAuthorById(authorId);

  if (error || !author) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error || "Author not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Author</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <AuthorForm author={author} />
        </div>
      </div>
    </div>
  );
}
