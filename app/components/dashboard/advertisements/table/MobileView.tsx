import { Advertisement } from "@/app/lib/definition";
import { format } from "date-fns";
import Link from "next/link";

interface MobileViewProps {
  advertisements: Advertisement[];
  onDelete: (id: number) => void;
}

export default function MobileView({
  advertisements,
  onDelete,
}: MobileViewProps) {
  return (
    <div className="space-y-4 sm:hidden">
      {advertisements.map((ad, index) => (
        <div
          key={ad.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                #{index + 1} - ID: {ad.id} -{" "}
                {ad.sponsor_name || `Sponsor ID: ${ad.sponsor_id}`} -{" "}
                {ad.ad_type}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {ad.article_title || `Article ID: ${ad.article_id}`}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {ad.category_name || `Category ID: ${ad.category_id}`}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {format(new Date(ad.start_date), "MMM d, yyyy")} -{" "}
                {format(new Date(ad.end_date), "MMM d, yyyy")}
              </p>
            </div>
            <div className="ml-4 flex gap-2">
              <Link
                href={`/dashboard/advertisements/${ad.id}/edit`}
                className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-50"
              >
                Edit
              </Link>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this advertisement?"
                    )
                  ) {
                    onDelete(ad.id);
                  }
                }}
                className="rounded border border-red-500 px-3 py-1 text-red-500 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
