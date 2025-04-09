import AuthorForm from "../../../components/dashboard/authors/AuthorForm";

export default function CreateAuthorPage() {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create New Author
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <AuthorForm />
        </div>
      </div>
    </div>
  );
}
