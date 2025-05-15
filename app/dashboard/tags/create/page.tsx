import TagForm from "../../../components/dashboard/tags/form/TagForm";

export default function CreateTagPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <TagForm isEditMode={false} />
        </div>
      </div>
    </div>
  );
}
