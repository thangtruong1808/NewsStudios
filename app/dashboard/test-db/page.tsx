import { testDatabaseConnection } from "../../lib/actions/test-db";

export default async function TestDBPage() {
  const result = await testDatabaseConnection();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

      <div
        className={`p-4 rounded-md ${
          result.success ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <h2
          className={`text-lg font-semibold ${
            result.success ? "text-green-800" : "text-red-800"
          }`}
        >
          {result.success ? "Connection Successful" : "Connection Failed"}
        </h2>
        <p className="mt-2 text-sm text-gray-600">{result.message}</p>

        {result.error && (
          <div className="mt-4 p-3 bg-red-100 rounded-md">
            <p className="text-sm font-medium text-red-800">Error:</p>
            <p className="mt-1 text-sm text-red-700">{result.error}</p>
          </div>
        )}

        {result.data && (
          <div className="mt-4 p-3 bg-green-100 rounded-md">
            <p className="text-sm font-medium text-green-800">Data:</p>
            <pre className="mt-1 text-sm text-green-700 overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold text-gray-800">
          Environment Variables
        </h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium text-gray-600">DB_HOST:</p>
            <p className="text-sm text-gray-800">
              {process.env.DB_HOST || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">DB_USER:</p>
            <p className="text-sm text-gray-800">
              {process.env.DB_USER || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">DB_NAME:</p>
            <p className="text-sm text-gray-800">
              {process.env.DB_NAME || "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">NODE_ENV:</p>
            <p className="text-sm text-gray-800">
              {process.env.NODE_ENV || "development"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
