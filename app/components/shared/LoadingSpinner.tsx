export const LoadingSpinner = () => (
  <div className="flex items-center justify-center mt-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    <span className="ml-2 text-sm text-gray-600">Upload is processing ...</span>
  </div>
);
