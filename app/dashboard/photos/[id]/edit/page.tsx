import { getImageById } from "@/app/lib/actions/images";
import { getArticles } from "@/app/lib/actions/articles";
import PhotoUploadForm from "@/app/components/dashboard/photos/form/PhotoUploadForm";
import { notFound } from "next/navigation";

interface EditPhotoPageProps {
  params: {
    id: string;
  };
}

export default async function EditPhotoPage({ params }: EditPhotoPageProps) {
  const [imageResult, articlesResult] = await Promise.all([
    getImageById(parseInt(params.id)),
    getArticles(),
  ]);

  if (imageResult.error || !imageResult.data) {
    notFound();
  }

  if (articlesResult.error) {
    throw new Error(articlesResult.error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <PhotoUploadForm
          articles={articlesResult.data || []}
          image={{
            ...imageResult.data,
            description: imageResult.data.description || null,
          }}
        />
      </div>
    </div>
  );
}
