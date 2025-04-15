import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getImages } from "../../../lib/actions/images";

const getImageUrl = (url: string | null): string => {
  if (!url) {
    return "/image-not-found.svg";
  }

  // Check if the URL already contains the full path
  if (url.startsWith("http")) {
    return url;
  }

  // If it's just a filename, construct the full URL
  return `https://srv876-files.hstgr.io/83e36b91bb471f62/files/public_html/Images/${url}`;
};
