import { Metadata } from 'next';
import TagForm from "../../../components/dashboard/tags/form/TagForm";

export const metadata: Metadata = {
  title: 'Create Tag | NewsStudios',
  description: 'Create a new tag for better content organization',
  keywords: ['tags', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function CreateTagPage() {
  return (
    <div className="bg-gray-50">
      <TagForm isEditMode={false} />
    </div>
  );
}
