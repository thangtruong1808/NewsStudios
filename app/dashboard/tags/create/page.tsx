import TagForm from "../../../components/dashboard/tags/form/TagForm";

export default function CreateTagPage() {
  return (
    <div className="bg-gray-50">
      <TagForm isEditMode={false} />
    </div>
  );
}
