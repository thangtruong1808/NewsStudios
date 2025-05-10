import { Sponsor } from "../../../lib/definition";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Column {
  header: string;
  accessorKey: keyof Sponsor | "sequence" | "actions";
  cell: (info: {
    getValue: () => any;
    row: { original: Sponsor; index: number };
  }) => React.ReactNode;
}

export function getTableColumns(
  currentPage: number,
  itemsPerPage: number,
  handleDelete: (id: number, sponsorName: string) => void,
  isDeleting: boolean
): Column[] {
  return [
    {
      header: "#",
      accessorKey: "sequence",
      cell: (info) => (currentPage - 1) * itemsPerPage + info.row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    },
    {
      header: "Contact Email",
      accessorKey: "contact_email",
      cell: (info) => <div>{info.getValue() || "N/A"}</div>,
    },
    {
      header: "Contact Phone",
      accessorKey: "contact_phone",
      cell: (info) => <div>{info.getValue() || "N/A"}</div>,
    },
    {
      header: "Website",
      accessorKey: "website_url",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {url}
          </a>
        ) : (
          "N/A"
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (info) => {
        const description = info.getValue();
        return (
          <div className="max-w-xs truncate" title={description || ""}>
            {description || "N/A"}
          </div>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: (info) => (
        <div>
          {new Date(info.getValue()).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      header: "Updated At",
      accessorKey: "updated_at",
      cell: (info) => (
        <div>
          {new Date(info.getValue()).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (info) => {
        const sponsor = info.row.original;
        return (
          <div className="flex justify-center items-center gap-4">
            <Link
              href={`/dashboard/sponsor/${sponsor.id}/edit`}
              className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-100"
            >
              <PencilIcon className="h-3.5 w-3.5" />
              Edit
            </Link>
            <button
              onClick={() => handleDelete(sponsor.id, sponsor.name)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 disabled:opacity-50"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        );
      },
    },
  ];
}
