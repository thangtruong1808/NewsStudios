import { toast } from "react-hot-toast";

/**
 * Base interface for toast properties
 * @property message - The message to display in the toast
 * @property duration - How long the toast should be visible (in milliseconds)
 * @property position - Where the toast should appear on the screen
 */
interface ToastProps {
  message?: string;
  duration?: number;
  position?:
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
}

/**
 * Interface for confirmation toast properties
 * Extends base ToastProps with additional properties for confirmation dialogs
 */
interface ConfirmationToastProps extends ToastProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

/**
 * Displays a success toast notification
 * Used for successful operations like create, update, or delete
 */
export const showSuccessToast = ({
  message = "Operation completed successfully",
  duration = 7000,
  position = "bottom-left",
}: ToastProps = {}) => {
  return toast.success(message, {
    duration,
    position,
    style: {
      background: "#FFFFFF",
      color: "#6B7280",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
    },
    icon: "✅",
  });
};

/**
 * Displays an information toast notification
 * Used for general information or updates
 */
export const showInfoToast = ({
  message = "Information",
  duration = 7000,
  position = "bottom-left",
}: ToastProps = {}) => {
  toast(message, {
    duration,
    position,
    style: {
      background: "#FFFFFF",
      color: "#6B7280",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
    },
    icon: "ℹ️",
  });
};

/**
 * Displays a warning toast notification
 * Used for important notices or potential issues
 */
export const showWarningToast = ({
  message = "Warning",
  duration = 7000,
  position = "bottom-left",
}: ToastProps = {}) => {
  toast(message, {
    duration,
    position,
    style: {
      background: "#FFFFFF",
      color: "#6B7280",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
    },
    icon: "⚠️",
  });
};

/**
 * Displays an error toast notification
 * Used for error messages or failed operations
 */
export const showErrorToast = ({
  message = "An error occurred",
  duration = 7000,
  position = "bottom-left",
}: ToastProps = {}) => {
  toast.error(message, {
    duration,
    position,
    style: {
      background: "#FFFFFF",
      color: "#6B7280",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
    },
    icon: "❌",
  });
};

/**
 * Displays a confirmation dialog toast
 * Used for actions that require user confirmation before proceeding
 *
 * @example
 * showConfirmationToast({
 *   title: "Delete Item",
 *   message: "Are you sure?",
 *   onConfirm: () => handleDelete(),
 *   confirmText: "Delete"
 * });
 */
export const showConfirmationToast = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  duration = 7000,
  position = "bottom-left",
}: ConfirmationToastProps) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2 bg-gray-50 rounded-md p-4 border border-gray-200">
        <p className="font-medium text-gray-500">{title}</p>
        <hr className="border-gray-300" />
        <p className="text-sm text-gray-500">{message}</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-3 py-1 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            onClick={() => {
              toast.dismiss(t.id);
              onCancel?.();
            }}
          >
            {cancelText}
          </button>
          <button
            className="px-3 py-1 text-sm text-white bg-red-400 hover:bg-red-500 rounded transition-colors font-medium"
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    ),
    {
      duration,
      position,
      style: {
        background: "transparent",
        boxShadow: "none",
        padding: 0,
      },
    }
  );
};
