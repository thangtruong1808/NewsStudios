"use client";

import { useState } from "react";
import {
  testFTPConnection,
  uploadFileToFTP,
  createIndexHtmlFile,
  listImagesDir,
  checkFileAccess,
  createDiagnosticHtmlFile,
} from "../../lib/actions/ftpUploadActions";

export default function TestUploadPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFilename, setCustomFilename] = useState("");
  const [directoryContents, setDirectoryContents] = useState<any>(null);
  const [accessibilityResult, setAccessibilityResult] = useState<any>(null);
  const [urlToCheck, setUrlToCheck] = useState("");
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  const handleTestUpload = async () => {
    setLoading(true);
    try {
      const result = await testFTPConnection();
      setResult(result);
      if (result.url) {
        setUrlToCheck(result.url);
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error during test upload",
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCustomUpload = async () => {
    if (!selectedFile) {
      setResult({
        success: false,
        message: "Please select a file first",
      });
      return;
    }

    setLoading(true);
    try {
      const filename = customFilename || selectedFile.name;
      const result = await uploadFileToFTP(selectedFile, filename);
      setResult(result);
      if (result.url) {
        setUrlToCheck(result.url);
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error during custom upload",
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIndexHtml = async () => {
    setLoading(true);
    try {
      const result = await createIndexHtmlFile();
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message: "Error creating index.html",
        error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleListDirectory = async () => {
    setLoading(true);
    try {
      const result = await listImagesDir();
      setDirectoryContents(result);
    } catch (error) {
      setDirectoryContents({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAccessibility = async () => {
    if (!urlToCheck) {
      setAccessibilityResult({
        success: false,
        message: "Please enter a URL to check",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await checkFileAccess(urlToCheck);
      setAccessibilityResult(result);
    } catch (error) {
      setAccessibilityResult({
        success: false,
        message: "Error checking accessibility",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiagnosticHtml = async () => {
    setLoading(true);
    try {
      const result = await createDiagnosticHtmlFile();
      setDiagnosticResult(result);
      if (result.url) {
        setUrlToCheck(result.url);
      }
    } catch (error) {
      setDiagnosticResult({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">FTP Upload Test</h1>

      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Upload</h2>
        <p className="mb-2">
          Click the button below to upload a test file via FTP:
        </p>
        <button
          onClick={handleTestUpload}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Test File"}
        </button>
      </div>

      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Create Index HTML</h2>
        <p className="mb-2">
          Click the button below to create an index.html file in the Images
          directory:
        </p>
        <button
          onClick={handleCreateIndexHtml}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Index HTML"}
        </button>
      </div>

      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Custom Upload</h2>
        <div className="mb-2">
          <input type="file" onChange={handleFileChange} className="mb-2" />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Custom filename (optional)"
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleCustomUpload}
          disabled={loading || !selectedFile}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Custom File"}
        </button>
      </div>

      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Directory Contents</h2>
        <p className="mb-4">
          Click the button below to list all files in the Images directory.
        </p>
        <button
          onClick={handleListDirectory}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Loading..." : "List Directory Contents"}
        </button>
      </div>

      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Check File Accessibility</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL to check:
          </label>
          <input
            type="text"
            value={urlToCheck}
            onChange={(e) => setUrlToCheck(e.target.value)}
            placeholder="Enter the URL of the file to check"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleCheckAccessibility}
          disabled={loading || !urlToCheck}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Checking..." : "Check Accessibility"}
        </button>
      </div>

      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Create Diagnostic HTML</h2>
        <p className="mb-4">
          Click the button below to create a diagnostic HTML file to help
          troubleshoot web server issues.
        </p>
        <button
          onClick={handleCreateDiagnosticHtml}
          disabled={loading}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? "Creating..." : "Create Diagnostic HTML"}
        </button>
      </div>

      {directoryContents && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">
            Directory Listing Results
          </h2>
          {directoryContents.success ? (
            <div>
              <p className="mb-2">{directoryContents.message}</p>
              {directoryContents.files && directoryContents.files.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permissions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {directoryContents.files.map((file: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {file.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.type === 2 ? "Directory" : "File"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(file.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.permissions || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No files found in the directory.</p>
              )}
            </div>
          ) : (
            <div className="text-red-500">
              <p>Error: {directoryContents.message}</p>
              {directoryContents.error && (
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(directoryContents.error, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      {accessibilityResult && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">
            Accessibility Check Results
          </h2>
          <div
            className={`p-4 rounded ${
              accessibilityResult.success ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p className="font-medium">{accessibilityResult.message}</p>
            {accessibilityResult.status && (
              <p className="mt-2">HTTP Status: {accessibilityResult.status}</p>
            )}
          </div>
        </div>
      )}

      {diagnosticResult && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">
            Diagnostic HTML Results
          </h2>
          <div
            className={`p-4 rounded ${
              diagnosticResult.success ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p className="font-medium">{diagnosticResult.message}</p>
            {diagnosticResult.url && (
              <p className="mt-2">
                URL:{" "}
                <a
                  href={diagnosticResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {diagnosticResult.url}
                </a>
              </p>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
          {result.url && (
            <div className="mt-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View uploaded file
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
