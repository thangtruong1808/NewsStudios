import React from "react";

interface DebugDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    currentPage: number;
    isLoading: boolean;
    articlesCount: number;
    totalCount: number;
    hasMore: boolean;
    newArticlesCount?: number;
    stateChanges?: string[];
  };
}

export default function DebugDialog({
  isOpen,
  onClose,
  data,
}: DebugDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Debug Information</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Page</p>
              <p className="text-lg">{data.currentPage}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Loading</p>
              <p className="text-lg">{data.isLoading ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Articles Count
              </p>
              <p className="text-lg">{data.articlesCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Count</p>
              <p className="text-lg">{data.totalCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Has More</p>
              <p className="text-lg">{data.hasMore ? "Yes" : "No"}</p>
            </div>
            {data.newArticlesCount !== undefined && (
              <div>
                <p className="text-sm font-medium text-gray-500">
                  New Articles
                </p>
                <p className="text-lg">{data.newArticlesCount}</p>
              </div>
            )}
          </div>

          {data.stateChanges && data.stateChanges.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">
                State Changes
              </p>
              <div className="bg-gray-50 rounded p-3">
                {data.stateChanges.map((change, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {change}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
