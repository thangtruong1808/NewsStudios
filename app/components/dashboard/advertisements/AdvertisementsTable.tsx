"use client";

import { Advertisement } from "@/app/lib/definition";
import { formatDate } from "@/app/lib/utils/dateUtils";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { deleteAdvertisement } from "@/app/lib/actions/advertisements";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AdvertisementsTableProps {
  advertisements: Advertisement[];
}

export default function AdvertisementsTable({
  advertisements,
}: AdvertisementsTableProps) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this advertisement?"
    );

    if (confirmed) {
      const { error } = await deleteAdvertisement(id);

      if (error) {
        toast.error("Failed to delete advertisement");
      } else {
        toast.success("Advertisement deleted successfully");
        router.refresh();
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sponsor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Article
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {advertisements.map((ad) => (
            <tr key={ad.id}>
              <td className="px-6 py-4 whitespace-nowrap">{ad.sponsor_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ad.article_title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {ad.category_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{ad.ad_type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(ad.start_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(ad.end_date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <Link href={`/dashboard/advertisements/${ad.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(ad.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
