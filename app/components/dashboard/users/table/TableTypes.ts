import { User } from "../../../../lib/definition";

export interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
}

export interface TableActionsProps {
  onEdit: (userId: number) => void;
  onDelete: (userData: {
    id: number;
    firstname: string;
    lastname: string;
  }) => void;
  isDeleting: boolean;
  user: User;
}

export interface TableViewProps {
  users: User[];
  currentPage: number;
  itemsPerPage: number;
  onEdit: (userId: number) => void;
  onDelete: (userData: {
    id: number;
    firstname: string;
    lastname: string;
  }) => void;
  isDeleting: boolean;
}

export interface TableProps {
  users: User[];
  searchQuery?: string;
}
