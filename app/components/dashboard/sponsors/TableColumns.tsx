import { Sponsor } from "../../../type/definitions";
import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import DeleteSponsorButton from "./DeleteSponsorButton";

interface Column {
  header: string;
  accessorKey: keyof Sponsor | "sequence";
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
      header: "No",
      accessorKey: "sequence",
      cell: (info) => (currentPage - 1) * itemsPerPage + info.row.index + 1,
    },
    {
      header: "ID",
      accessorKey: "id",
      cell: (info) => <div>{info.getValue()}</div>,
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
      header: "Actions",
      accessorKey: "id",
      cell: (info) => {
        const sponsor = info.row.original;
        return (
          <div className="flex items-center space-x-2">
            <Link
              href={`/dashboard/sponsor/${sponsor.id}/edit`}
              className="text-blue-600 hover:text-blue-800"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>
            <DeleteSponsorButton
              id={sponsor.id}
              name={sponsor.name}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        );
      },
    },
  ];
}
