import React, { useRef, useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";

interface BannerProps {
  title: string;
  description?: string;
  backgroundImage: string;
  trailerUrl?: string;
}

const Banner: React.FC<BannerProps> = ({ title, description, backgroundImage, trailerUrl }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!trailerUrl) return;

    let timer: NodeJS.Timeout | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timer = setTimeout(() => setShowVideo(true), 5000);
          } else {
            setShowVideo(false);
            if (timer) clearTimeout(timer);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) observer.unobserve(bannerRef.current);
      if (timer) clearTimeout(timer);
    };
  }, [trailerUrl]);

  return (
    <div ref={bannerRef} className="relative h-[56.25vw] max-h-[700px]">
      {!showVideo || !trailerUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        </>
      ) : (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={trailerUrl}
          autoPlay
          muted
          loop
        />
      )}

      <div className="absolute bottom-[35%] left-4 md:left-12 space-y-4 max-w-lg z-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-xl">
          {title}
        </h1>
        
        {description && (
          <p className="text-white text-sm md:text-lg drop-shadow-xl line-clamp-3">
            {description}
          </p>
        )}

        <div className="flex gap-3">
          <button className="bg-white text-black px-6 py-2 rounded flex items-center gap-2 hover:bg-opacity-80 transition">
            <FaPlay className="text-black" />
            Play
          </button>
          <button className="bg-gray-500 bg-opacity-50 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-opacity-40 transition">
            <MdInfoOutline className="text-white text-xl" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
