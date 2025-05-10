import { getSponsors } from "@/app/lib/actions/sponsors";
import { getArticles } from "@/app/lib/actions/articles";
import { getCategories } from "@/app/lib/actions/categories";
import {
  getAdvertisementById,
  updateAdvertisement,
} from "@/app/lib/actions/advertisements";
import CreateAdvertisementForm from "@/app/components/dashboard/advertisements/CreateAdvertisementForm";
import { AdvertisementFormData } from "@/app/lib/validations/advertisementSchema";
import {
  Sponsor,
  Article,
  Category,
  Advertisement,
} from "@/app/lib/definition";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditAdvertisementPage({ params }: PageProps) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    notFound();
  }

  try {
    const [sponsorsResult, articles, categoriesResult, advertisementResult] =
      await Promise.all([
        getSponsors(),
        getArticles(),
        getCategories(),
        getAdvertisementById(id),
      ]);

    if (
      sponsorsResult.error ||
      categoriesResult.error ||
      advertisementResult.error
    ) {
      return (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {sponsorsResult.error ||
                    categoriesResult.error ||
                    advertisementResult.error}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const advertisement = advertisementResult.data;
    if (!advertisement) {
      notFound();
    }

    const defaultValues: Partial<AdvertisementFormData> = {
      sponsor_id: advertisement.sponsor_id,
      article_id: advertisement.article_id,
      category_id: advertisement.category_id,
      ad_type: advertisement.ad_type as "banner" | "video",
      start_date: advertisement.start_date
        ? new Date(advertisement.start_date).toISOString().split("T")[0]
        : "",
      end_date: advertisement.end_date
        ? new Date(advertisement.end_date).toISOString().split("T")[0]
        : "",
      ad_content: advertisement.ad_content,
      image_url: advertisement.image_url || "",
      video_url: advertisement.video_url || "",
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Edit Advertisement
          </h1>
          <CreateAdvertisementForm
            sponsors={sponsorsResult.data || []}
            articles={articles || []}
            categories={categoriesResult.data || []}
            onSubmit={async (data) => {
              "use server";
              const updateData: Partial<Advertisement> = {
                sponsor_id: data.sponsor_id,
                article_id: data.article_id,
                category_id: data.category_id,
                ad_type: data.ad_type,
                ad_content: data.ad_content,
                start_date: data.start_date,
                end_date: data.end_date,
                image_url: data.image_url || undefined,
                video_url: data.video_url || undefined,
              };

              const result = await updateAdvertisement(id, updateData);
              if (!result.success) {
                throw new Error(
                  result.error || "Failed to update advertisement"
                );
              }
              return { success: true };
            }}
            defaultValues={defaultValues}
            isEditMode={true}
            imageUrl={advertisement.image_url}
            videoUrl={advertisement.video_url}
          />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
