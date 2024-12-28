"use client";
import { useState, useEffect } from "react";
import { getSeason } from "@/utils/SmallPrograms";
import Image from "next/image";
import Link from "next/link";

const MovieInfo = ({ info }) => {
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchDownloadLinks = async () => {
      try {
        // Fetch JSON file from the provided URL
        const response = await fetch("https://siamstv.vercel.app/tv/movies.json");
        if (!response.ok) {
          throw new Error("Failed to fetch download links.");
        }
        const data = await response.json();

        // Match the current movie's ID with the JSON ID
        const matchedMovie = data.find(
          (movie) => movie.id === info.id.toString() // Ensure both are strings for comparison
        );

        // Update state with download links
        if (matchedMovie) {
          setDownloadLinks(matchedMovie.download_links || []);
        } else {
          setDownloadLinks([]); // No links if no match found
        }
      } catch (error) {
        console.error("Error fetching download links:", error);
        setDownloadLinks([]); // Default to empty links on error
      } finally {
        setIsLoading(false); // Remove loading state
      }
    };

    fetchDownloadLinks();
  }, [info.id]);

  const media_type = info.type;

  return (
    <div className="text-white flex gap-6">
      {/* Movie Poster */}
      <Image
        src={`https://image.tmdb.org/t/p/w500${info?.poster_path}`}
        alt="movie poster"
        width={215}
        height={300}
        className="rounded-2xl object-cover h-80 w-[16rem] max-[840px]:h-[14rem] max-[380px]:h-[9rem]"
      />

      {/* Movie Details */}
      <div className="mt-2">
        <h1 className="text-2xl font-['poppins'] font-medium max-[840px]:text-[22px] max-[380px]:text-[19px]">
          {info?.title || info?.name || ""}
        </h1>

        {/* Overview */}
        <p className="text-[15px] font-['poppins'] text-[#fff4f4b1] overflow-hidden text-ellipsis line-clamp-4 mb-2">
          {info?.overview}
        </p>

        {/* Other Details */}
        <div className="flex gap-32 justify-between max-[960px]:flex-col max-[960px]:gap-0">
          <div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Type:{" "}
              <Link
                target="_"
                href={`/`}
                className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]"
              >
                {media_type.length > 2
                  ? media_type.charAt(0).toUpperCase() + media_type.slice(1).toLowerCase()
                  : media_type.toUpperCase()}
              </Link>
            </div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Country:{" "}
              <Link
                target="_"
                href={`/`}
                className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]"
              >
                {info?.origin_country?.[0] || "N/A"}
              </Link>
            </div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Premiered:{" "}
              <Link
                target="_"
                href={`/`}
                className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]"
              >
                {info?.release_date
                  ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(info.release_date))
                  : "N/A"}
              </Link>
            </div>
          </div>
        </div>

        {/* Download Links Section */}
        <div className="mt-4">
          <h2 className="text-lg font-['poppins'] font-medium text-[#77dd77]">
            Download Links:
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {isLoading ? (
              <p className="text-sm text-[#dadada]">Loading download links...</p>
            ) : downloadLinks.length > 0 ? (
              downloadLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-['poppins'] text-white bg-[#77dd77] rounded-lg hover:bg-[#60c060] transition-colors"
                >
                  {link.quality}
                </a>
              ))
            ) : (
              <p className="text-sm text-[#dadada]">No download links available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
