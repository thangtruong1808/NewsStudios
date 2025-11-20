"use client";

// Component Info
// Description: Left drawer search component with title search, expandable category and subcategory filters, and search button.
// Date updated: 2025-November-21
// Author: thangtruong

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { NavMenuCategory } from "./types";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: NavMenuCategory[];
}

export default function SearchDrawer({ isOpen, onClose, categories }: SearchDrawerProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>([]);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isSubcategoriesExpanded, setIsSubcategoriesExpanded] = useState(true);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Toggle handlers
  const toggleCategory = (categoryId: number) => {
    const isCurrentlySelected = selectedCategories.includes(categoryId);
    if (isCurrentlySelected) {
      // Uncheck category and remove its subcategories
      const category = categories.find((cat) => cat.id === categoryId);
      const subcategoryIdsToRemove = category?.subcategories.map((sub) => sub.id) || [];
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
      setSelectedSubcategories((prev) => prev.filter((id) => !subcategoryIdsToRemove.includes(id)));
    } else {
      // Check category
      setSelectedCategories((prev) => [...prev, categoryId]);
    }
  };
  const toggleSubcategory = (subcategoryId: number) => {
    setSelectedSubcategories((prev) => (prev.includes(subcategoryId) ? prev.filter((id) => id !== subcategoryId) : [...prev, subcategoryId]));
  };
  const handleClear = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedSubcategories([]);
  };

  // Handle search submission
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (selectedSubcategories.length > 0) params.set("subcategories", selectedSubcategories.join(","));
    onClose();
    router.push(`/search?${params.toString()}`);
  };

  // Filter subcategories based on selected categories - only show if categories are selected
  const filteredSubcategories = selectedCategories.length > 0
    ? categories
        .filter((category) => selectedCategories.includes(category.id))
        .flatMap((category) => category.subcategories)
    : [];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed left-0 top-0 z-[2001] flex h-full w-full max-w-md flex-col transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Search Articles</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" aria-label="Close search">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Search input */}
        <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-4 py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by article title..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Clear search">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search articles"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filters - scrollable container */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {/* Clear button */}
          {(searchQuery || selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
            <button onClick={handleClear} className="mb-4 text-sm text-blue-600 hover:text-blue-700">
              Clear all filters
            </button>
          )}

          {/* Categories section */}
          <div className="mb-6">
            <button
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className="flex w-full items-center justify-between mb-3 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span>Categories</span>
              {isCategoriesExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            {isCategoriesExpanded && (
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={selectedCategories.includes(category.id)} onChange={() => toggleCategory(category.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Subcategories section */}
          <div>
            <button
              onClick={() => setIsSubcategoriesExpanded(!isSubcategoriesExpanded)}
              className="flex w-full items-center justify-between mb-3 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span>Subcategories</span>
              {isSubcategoriesExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            {isSubcategoriesExpanded && (
              <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
                {filteredSubcategories.length > 0 ? (
                  filteredSubcategories.map((subcategory) => {
                    const parentCategory = categories.find((cat) => cat.subcategories.some((sub) => sub.id === subcategory.id));
                    return (
                      <label key={subcategory.id} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={selectedSubcategories.includes(subcategory.id)} onChange={() => toggleSubcategory(subcategory.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700">{parentCategory?.name} - {subcategory.name}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 italic">Select categories to see subcategories</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

