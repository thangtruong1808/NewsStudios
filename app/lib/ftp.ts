import * as ftp from "basic-ftp";

let ftpClient: ftp.Client | null = null;

export async function getFtpClient(): Promise<ftp.Client> {
  if (ftpClient) {
    return ftpClient;
  }

  ftpClient = new ftp.Client();

  try {
    await ftpClient.access({
      host: process.env.FTP_HOST || "srv876-files.hstgr.io",
      user: process.env.FTP_USER || "33f9f3e6b3a8af46",
      password: process.env.FTP_PASSWORD || "",
      secure: true,
    });

    return ftpClient;
  } catch (error) {
    console.error("Error connecting to FTP server:", error);
    throw new Error("Failed to connect to FTP server");
  }
}

export async function closeFtpClient(): Promise<void> {
  if (ftpClient) {
    await ftpClient.close();
    ftpClient = null;
  }
}
