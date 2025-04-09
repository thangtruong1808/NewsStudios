import TagForm from "../../../components/dashboard/tags/TagForm";

export default function CreateTagPage() {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Create New Tag</h1>
      </div>

      <div className="mt-4">
        <TagForm />
      </div>
    </div>
  );
}
