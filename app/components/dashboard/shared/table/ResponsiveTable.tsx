"use client";

import { Column } from "./TableTypes";
import { MobileView, TabletView, DesktopView } from "./views";

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  itemsPerPage: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
}

export default function ResponsiveTable<T extends { id: number }>({
  data,
  columns,
  currentPage,
  itemsPerPage,
  onEdit,
  onDelete,
  isDeleting = false,
}: ResponsiveTableProps<T>) {
  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <MobileView
              data={data}
              columns={columns}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
            <TabletView
              data={data}
              columns={columns}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
            <DesktopView
              data={data}
              columns={columns}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
