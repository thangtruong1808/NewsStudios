"use client";

import { User } from "../../../type/definitions";

interface TableHeaderProps {
  sortField: keyof User;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof User) => void;
}

export default function TableHeader({
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <thead className="rounded-lg text-left text-sm font-normal bg-zinc-200">
      <tr>
        <th
          scope="col"
          className="px-4 py-5 font-medium sm:pl-6 border-b border-zinc-300"
        >
          #
        </th>
        <th
          scope="col"
          className="px-4 py-5 font-medium sm:pl-6 border-b border-zinc-300"
          onClick={() => onSort("id")}
        >
          ID
          {sortField === "id" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </th>
        <th
          scope="col"
          className="px-3 py-5 font-medium border-b border-zinc-300"
          onClick={() => onSort("firstname")}
        >
          First Name{" "}
          {sortField === "firstname" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </th>
        <th
          scope="col"
          className="px-3 py-5 font-medium border-b border-zinc-300"
          onClick={() => onSort("lastname")}
        >
          Last Name{" "}
          {sortField === "lastname" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </th>
        <th
          scope="col"
          className="px-3 py-5 font-medium border-b border-zinc-300"
          onClick={() => onSort("description")}
        >
          Description{" "}
          {sortField === "description" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </th>
        <th
          scope="col"
          className="px-3 py-5 font-medium border-b border-zinc-300"
          onClick={() => onSort("email")}
        >
          Email{" "}
          {sortField === "email" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </th>
        <th
          scope="col"
          className="px-3 py-5 font-medium border-b border-zinc-300"
          onClick={() => onSort("role")}
        >
          Role{" "}
          {sortField === "role" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </th>
        <th
          scope="col"
          className="px-3 py-5 font-medium border-b border-zinc-300"
          onClick={() => onSort("status")}
        >
          Status{" "}
          {sortField === "status" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </th>
        <th
          scope="col"
          className="relative py-3 pl-6 pr-3 border-b border-zinc-300 text-center"
        >
          <span className="font-medium">Actions</span>
        </th>
      </tr>
    </thead>
  );
}
