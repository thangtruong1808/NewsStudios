"use client";

import { useState, useEffect } from "react";
import { getSponsors } from "@/app/lib/actions/sponsors";
import { Sponsor } from "@/app/lib/definition";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [displayedSponsors, setDisplayedSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const result = await getSponsors();
        if (result.error) {
          throw new Error(result.error);
        }
        if (result.data) {
          setSponsors(result.data);
          setDisplayedSponsors(result.data);
          // Set initial selected letter based on the first sponsor
          if (result.data.length > 0) {
            const firstLetter = result.data[0].name.charAt(0).toUpperCase();
            setSelectedLetter(firstLetter);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch sponsors"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  // Update displayed sponsors when selected letter changes
  useEffect(() => {
    if (selectedLetter) {
      const filteredSponsors = sponsors.filter(
        (sponsor) => sponsor.name.charAt(0).toUpperCase() === selectedLetter
      );
      setDisplayedSponsors(filteredSponsors);
      setCurrentIndex(0);
    } else {
      setDisplayedSponsors(sponsors);
    }
  }, [selectedLetter, sponsors]);

  // Get unique first letters from sponsor names and count sponsors for each letter
  const letterCounts = sponsors.reduce((acc, sponsor) => {
    const firstLetter = sponsor.name.charAt(0).toUpperCase();
    acc[firstLetter] = (acc[firstLetter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort letters alphabetically
  const firstLetters = Object.keys(letterCounts).sort();

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      // If we're at the last possible index, go back to the start
      if (prevIndex >= displayedSponsors.length - 3) {
        return 0;
      }
      // Otherwise, move to the next index
      return prevIndex + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      // If we're at the start, go to the last possible index
      if (prevIndex === 0) {
        return Math.max(0, displayedSponsors.length - 3);
      }
      // Otherwise, move to the previous index
      return prevIndex - 1;
    });
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter === selectedLetter ? null : letter);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (sponsors.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No sponsors available.</p>
      </div>
    );
  }

  const totalSlides = sponsors.length - 2;

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Our Sponsors
          </h2>

          {/* Alphabetical Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {firstLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedLetter === letter
                    ? "bg-indigo-600 text-white scale-110"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={`${letterCounts[letter]} sponsor${
                  letterCounts[letter] > 1 ? "s" : ""
                } starting with ${letter}`}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div className="relative h-[300px] overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${
                    currentIndex * (100 / Math.min(3, displayedSponsors.length))
                  }%)`,
                  width: `${
                    (displayedSponsors.length * 100) /
                    Math.min(3, displayedSponsors.length)
                  }%`,
                }}
              >
                {displayedSponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className={`px-3 ${
                      displayedSponsors.length <= 2 ? "w-full" : "w-1/3"
                    }`}
                  >
                    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl h-full border border-indigo-100">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-md">
                          <span className="text-2xl font-bold text-white">
                            {sponsor.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                          {sponsor.name}
                        </h3>
                        {sponsor.website_url && (
                          <a
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 transition-colors duration-300"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons - Only show if there are more than 3 sponsors */}
            {displayedSponsors.length > 3 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronRightIcon className="h-6 w-6 text-gray-600" />
                </button>
              </>
            )}

            {/* Progress Indicator - Only show if there are more than 3 sponsors */}
            {displayedSponsors.length > 3 && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} -{" "}
                  {Math.min(currentIndex + 3, displayedSponsors.length)} of{" "}
                  {displayedSponsors.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
