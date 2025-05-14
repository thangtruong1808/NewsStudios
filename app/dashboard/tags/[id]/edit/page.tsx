import { getTagById } from "../../../../lib/actions/tags";
import TagForm from "../../../../components/dashboard/tags/form/TagForm";
import { Tag } from "../../../../lib/definition";

interface EditTagPageProps {
  params: {
    id: string;
  };
}

export default async function EditTagPage({ params }: EditTagPageProps) {
  const { id } = params;
  const result = await getTagById(Number(id));

  if (result.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading tag
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{result.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"></div>
      <TagForm tag={result.data} isEditMode tagId={Number(id)} />
    </div>
  );
}
