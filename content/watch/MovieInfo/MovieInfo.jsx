"use client";
import { useState, useEffect } from "react";
import { getSeason } from "@/utils/SmallPrograms";
import Image from "next/image";
import Link from "next/link";

const MovieInfo = ({ info }) => {
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDownloadLinks = async () => {
      try {
        // Fetch the movie data from the JSON file
        const response = await fetch("https://siamstv.vercel.app/tv/movies.json");
        if (!response.ok) {
          throw new Error("Failed to fetch download links");
        }

        const data = await response.json();

        // Find the matching movie by ID
        const matchedMovie = data.find(
          (movie) => movie.id === info.id.toString() // Ensure ID is matching as a string
        );

        if (matchedMovie) {
          setDownloadLinks(matchedMovie.download_links || []); // Set the download links if found
        } else {
          setDownloadLinks([]); // If no match is found, show no links
        }
      } catch (error) {
        console.error("Error fetching or processing download links:", error);
        setDownloadLinks([]); // Error fallback
      } finally {
        setIsLoading(false); // End loading state
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
        alt="Movie Poster"
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
                  className="px-6 py-3 text-sm font-bold font-['poppins'] text-white bg-gradient-to-r from-[#77dd77] via-[#66bb6a] to-[#60c060] rounded-lg shadow-xl hover:shadow-2xl hover:opacity-90 transition-all"
                >
                  {link.quality}
                </a>
              ))
            ) : (
              <p className="text-sm text-[#dadada]">No download links available for this movie.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
