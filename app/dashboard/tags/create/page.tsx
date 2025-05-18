import TagForm from "../../../components/dashboard/tags/form/TagForm";

export default function CreateTagPage() {
  return (
    <div className="w-full">
      <TagForm isEditMode={false} />
    </div>
  );
}
