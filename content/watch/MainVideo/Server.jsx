import React, { useEffect } from "react";
import { useWatchContext } from "@/context/Watch";

const Server = () => {
  const { MovieId, setWatchInfo, watchInfo, MovieInfo, episode, season } =
    useWatchContext();

  const defaultVideoServers = ["autoembed"];

  const MovieVideoPlayers = {
    vidsrcpro: `https://vidsrc.pro/embed/movie/${MovieId}`,
    autoembed: `https://player.autoembed.cc/embed/movie/${MovieId}`,
    smashystream: `https://embed.smashystream.com/playere.php?tmdb=${MovieId}?playerList=D|SM`,     
  };

  const TVVideoPlayers = {
    vidsrcpro: `https://vidsrc.pro/embed/tv/${MovieId}/${season}/${episode}`,
    autoembed: `https://player.autoembed.cc/embed/tv/${MovieId}/${season}/${episode}`,
  };

  const MovievideoPlayerEntry = Object.entries(MovieVideoPlayers);
  const TVVideoPlayerEntry = Object.entries(TVVideoPlayers);

  const fetchServerUrl = async (server) => {
    const BASE_URL = "https://api.vidjoy.pro/rabbit/fetch/";
    const PROXY_URL = "https://slave.docadan488.workers.dev/proxy?url=";

    const headers = {
      "x-api-key": process.env.RABBIT_API_KEY
    };

    let url = BASE_URL + MovieId;

    url += `?sr=${server === "upcloud" ? 0 : 1}`

    if (MovieInfo?.type === "tv") {
      url += `&ss=${season}&ep=${episode}`;
    }

    try {
      const fetchURL = PROXY_URL + btoa(url) + `&headers=${btoa(JSON.stringify(headers))}`;

      const response = await fetch(fetchURL, { next: { revalidate: 43200 } });

      if (!response.ok) {
        return null;
      }

      const jsondata = await response.json();

      return {
        url: jsondata?.url[0]?.link,
        referer: jsondata?.headers?.Referer,
        subtitle: jsondata?.tracks,
        item: server
      };
    } catch (error) {
      console.error("Error in fetchServerUrl:", error);
      return null;
    }
  };

  const setdefault = async (server) => {
    try {
      const data = await fetchServerUrl(server);
      console.log(data);
      if (data) {
        setWatchInfo({
          server: data.url,
          item: data.item,
          referer: data.referer,
          subtitle: data.subtitle,
          iframe: false,
          loading: false,
        });
        return;
      } else {
        setWatchInfo({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching server URL:", error);
      setWatchInfo({ loading: false });
    }

    // Fallback if no server URL found
    if (!watchInfo?.url) {
      setWatchInfo({
        url: MovieInfo?.type === "tv" ? TVVideoPlayerEntry[0][1] : MovievideoPlayerEntry[0][1],
        iframe: true,
        loading: false,
      });
    }

  };

  useEffect(() => {
    setdefault("upcloud");
  }, [episode, season, MovieInfo]);

  const changeServer = async (item, isIframe = true) => {
    setWatchInfo({ loading: true });

    if (isIframe) {
      // Handle iframe-based URL setup
      if (item) {
        setWatchInfo({
          url: item[1],
          iframe: true,
          loading: false,
        });
      }
      return;
    }

    try {
      const data = await fetchServerUrl(item);

      if (data) {
        setWatchInfo({
          server: data.url,
          item: item,
          referer: data.referer,
          subtitle: data.subtitle,
          iframe: false,
          loading: false,
        });

      } else {
        setWatchInfo({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching server URL:", error);
      setWatchInfo({ loading: false });
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-1 ">
      <div className="bg-[#323044] w-full h-full px-4 flex items-center gap-8 max-[880px]:py-2">
        <div className="flex items-center">
          <span>
            <svg
              viewBox="0 0 32 32"
              className="w-5 h-5 mr-1 max-[500px]:w-4"
              fill="none"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.6661 6.66699C4.29791 6.66699 3.99943 6.96547 3.99943 7.33366V24.667C3.99943 25.0352 4.29791 25.3337 4.6661 25.3337H27.3328C27.701 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.701 6.66699 27.3328 6.66699H4.6661ZM8.66667 21.3333C8.29848 21.3333 8 21.0349 8 20.6667V11.3333C8 10.9651 8.29848 10.6667 8.66667 10.6667H14C14.3682 10.6667 14.6667 10.9651 14.6667 11.3333V12.6667C14.6667 13.0349 14.3682 13.3333 14 13.3333H10.8C10.7264 13.3333 10.6667 13.393 10.6667 13.4667V18.5333C10.6667 18.607 10.7264 18.6667 10.8 18.6667H14C14.3682 18.6667 14.6667 18.9651 14.6667 19.3333V20.6667C14.6667 21.0349 14.3682 21.3333 14 21.3333H8.66667ZM18 21.3333C17.6318 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6318 10.6667 18 10.6667H23.3333C23.7015 10.6667 24 10.9651 24 11.3333V12.6667C24 13.0349 23.7015 13.3333 23.3333 13.3333H20.1333C20.0597 13.3333 20 13.393 20 13.4667V18.5333C20 18.607 20.0597 18.6667 20.1333 18.6667H23.3333C23.7015 18.6667 24 18.9651 24 19.3333V20.6667C24 21.0349 23.7015 21.3333 23.3333 21.3333H18Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
          Server
        </div>
        <div className="flex gap-2">
          {(MovieInfo?.type === "movie"
            ? MovievideoPlayerEntry
            : TVVideoPlayerEntry
          )?.map((item) => (
            <div
              key={item[0]}
              onClick={() => changeServer(item)}
              style={{ background: watchInfo?.url === item[1] ? "#4a446c" : undefined }}
              className="px-4 py-[6px] text-[15px] bg-[#413d57] hover:bg-[#4a446c] border border-[#5b5682] rounded-md cursor-pointer"
            >
              {item[0]}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#323044] w-full h-full px-4 flex items-center gap-8 max-[880px]:py-2">
        <div className="flex items-center">
          <span>
            <svg
              viewBox="0 0 32 32"
              className="w-5 h-5 mr-1 max-[500px]:w-4"
              fill="none"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.6661 6.66699C4.29791 6.66699 3.99943 6.96547 3.99943 7.33366V24.667C3.99943 25.0352 4.29791 25.3337 4.6661 25.3337H27.3328C27.701 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.701 6.66699 27.3328 6.66699H4.6661ZM8.66667 21.3333C8.29848 21.3333 8 21.0349 8 20.6667V11.3333C8 10.9651 8.29848 10.6667 8.66667 10.6667H14C14.3682 10.6667 14.6667 10.9651 14.6667 11.3333V12.6667C14.6667 13.0349 14.3682 13.3333 14 13.3333H10.8C10.7264 13.3333 10.6667 13.393 10.6667 13.4667V18.5333C10.6667 18.607 10.7264 18.6667 10.8 18.6667H14C14.3682 18.6667 14.6667 18.9651 14.6667 19.3333V20.6667C14.6667 21.0349 14.3682 21.3333 14 21.3333H8.66667ZM18 21.3333C17.6318 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6318 10.6667 18 10.6667H23.3333C23.7015 10.6667 24 10.9651 24 11.3333V12.6667C24 13.0349 23.7015 13.3333 23.3333 13.3333H20.1333C20.0597 13.3333 20 13.393 20 13.4667V18.5333C20 18.607 20.0597 18.6667 20.1333 18.6667H23.3333C23.7015 18.6667 24 18.9651 24 19.3333V20.6667C24 21.0349 23.7015 21.3333 23.3333 21.3333H18Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
          Player&nbsp;
        </div>
        <div className="flex gap-2">
          {defaultVideoServers?.map((item) => (
            <div
              key={item}
              onClick={() => changeServer(item, false)}
              style={{ background: watchInfo?.item === item ? "#4a446c" : undefined }}
              className="px-4 py-[6px] text-[15px] bg-[#413d57] hover:bg-[#4a446c] border border-[#5b5682] rounded-md cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Server;
