"use client";

import { Column } from "./types";
import { User } from "../../../type/definitions";

interface TableBodyProps {
  users: User[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export default function TableBody({
  users,
  columns,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {users.map((user, index) => (
        <tr
          key={user.id}
          className="hover:bg-gray-100 transition-colors duration-150"
        >
          {columns.map((column) => {
            const isActionsColumn = column.key === "actions";
            const isMobileVisible = [
              "id",
              "firstname",
              "status",
              "actions",
            ].includes(column.key);

            return (
              <td
                key={`${user.id}-${column.key}`}
                className={`whitespace-nowrap px-2 py-2 text-xs ${
                  isActionsColumn ? "text-center" : ""
                } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
              >
                {column.cell(
                  user[column.accessor] || "",
                  (currentPage - 1) * itemsPerPage + index,
                  user
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
