"use client";
import { useState, useEffect } from "react";
import { getSeason } from "@/utils/SmallPrograms";
import Image from "next/image";
import Link from "next/link";

const MovieInfo = ({ info }) => {
  const [downloadLinks, setDownloadLinks] = useState([]);

  useEffect(() => {
    // Fetch JSON data and filter links based on the movie's TMDB ID
    const fetchDownloadLinks = async () => {
      try {
        const response = await fetch("https://siamstv.vercel.app/tv/movies.json");
        if (!response.ok) {
          throw new Error("Failed to fetch download links");
        }
        const data = await response.json();
        const matchedMovie = data.find((movie) => movie.id === info.id.toString()); // Match TMDB ID with JSON ID
        if (matchedMovie) {
          setDownloadLinks(matchedMovie.download_links || []);
        } else {
          setDownloadLinks([]); // No match found
        }
      } catch (error) {
        console.error("Error fetching download links:", error);
        setDownloadLinks([]);
      }
    };

    fetchDownloadLinks();
  }, [info.id]);

  const media_type = info.type;

  return (
    <div className="text-white flex gap-6">
      <Image
        src={`https://image.tmdb.org/t/p/w500${info?.poster_path}`}
        alt="movieVerse Poster"
        width={215}
        height={300}
        className="rounded-2xl object-cover h-80 w-[16rem] max-[840px]:h-[14rem] max-[380px]:h-[9rem]"
      />
      <div className="mt-2">
        <h1 className="text-2xl font-['poppins'] font-medium max-[840px]:text-[22px] max-[380px]:text-[19px]">
          {info?.title || info?.name || ""}
        </h1>
        <div className="flex gap-2 mt-1 mb-2">
          <span className="bg-[#727587] text-[13px] px-1 rounded-[4px] text-slate-900 font-medium">HD</span>
          <span className="bg-[#727587] text-[13px] px-1 rounded-[4px] text-slate-900 font-medium">SD</span>
        </div>

        <p className="text-[15px] font-['poppins'] text-[#fff4f4b1] overflow-hidden text-ellipsis line-clamp-4 mb-2">
          {info?.overview}
        </p>

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
                  ? media_type?.charAt(0).toUpperCase() + media_type?.slice(1).toLowerCase()
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
                {info?.origin_country[0]}
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
                    }).format(new Date(info?.release_date))
                  : "N/A"}
              </Link>
            </div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Date aired:{" "}
              <Link
                href={`/year/${info?.seasonYear}`}
                className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]"
              >
                {info?.release_date ? info?.release_date?.slice(0, 4) : 2024}
              </Link>
            </div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Season:{" "}
              <Link
                href={`/season/${info?.season}`}
                className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]"
              >
                {getSeason(new Date(info?.release_date))}
              </Link>
            </div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Status:{" "}
              <Link
                target="_"
                href={`/catalog?airing=${info?.status}&sort=POPULARITY_DESC`}
                className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]"
              >
                {info?.status}
              </Link>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Genres:{" "}
              <span className="text-[#e26bbcd9]">
                {info?.genres.map((item, index) => (
                  <Link
                    key={item?.id}
                    target="_"
                    href={`/catalog?genres=%5B"${item?.name}"%5D&sort=POPULARITY_DESC`}
                    className="cursor-pointer hover:text-[#ff3df9]"
                  >
                    {item?.name}
                    {info?.genres?.length - 1 === index ? null : ", "}
                  </Link>
                ))}
              </span>
            </div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Episodes:{" "}
              <Link
                target="_"
                href={`/catalog?episodes=${info?.episodes}&sort=POPULARITY_DESC`}
                className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]"
              >
                {media_type === "movie"
                  ? 1
                  : info?.number_of_episodes
                  ? info?.number_of_episodes
                  : 1}
              </Link>
            </div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Studios:{" "}
              <span className="text-[#e26bbcd9]">
                <Link
                  href={`/`}
                  className="cursor-pointer hover:text-[#ff3df9]"
                >
                  {info?.production_companies[0]?.name}
                </Link>
              </span>
            </div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Rating:{" "}
              <span className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">
                {info?.vote_average}
              </span>
            </div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">
              Budget:{" "}
              <span className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">
                {info?.budget
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(info?.budget)
                  : "150 paisa"}
              </span>
            </div>
          </div>
        </div>

        {/* Download Links */}
        <div className="mt-4">
          <h2 className="text-lg font-['poppins'] font-medium text-[#77dd77]">
            Download Links:
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {downloadLinks.length > 0 ? (
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
              <p className="text-sm text-[#dadada]">
                No download links available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;
