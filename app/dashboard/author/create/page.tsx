import AuthorForm from "../../../components/dashboard/authors/form/AuthorForm";

export default function CreateAuthorPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <AuthorForm />
        </div>
      </div>
    </div>
  );
}
