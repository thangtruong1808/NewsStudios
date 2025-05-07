import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/app/lib/definition";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import useEmblaCarousel from "embla-carousel-react";

interface TrendingImageCarouselProps {
  articles: Article[];
}

export const TrendingImageCarousel = ({
  articles,
}: TrendingImageCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="space-y-4 h-full">
      <div className="relative h-full">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {articles.map((article) => (
              <div key={article.id} className="flex-[0_0_100%] min-w-0 h-full">
                <Link
                  href={`/article/${article.id}`}
                  className="group block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="relative h-full w-full">
                    {article.image ? (
                      <div className="relative w-full h-full overflow-hidden bg-gray-100">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          priority={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className="text-xl font-semibold text-white line-clamp-2">
                            {article.title}
                          </h4>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <div className="text-orange-600 text-4xl font-bold">
                          {article.title.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};
