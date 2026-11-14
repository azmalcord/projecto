import { getLatestVideos, relativeTime } from "@/lib/youtube";
import { YoutubeVideo } from "@/lib/youtube";

export async function LatestSection() {
  const videos = await getLatestVideos(6);

  return (
    <section id="latest" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              Latest Videos
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
              Fresh from the lab
            </h2>
            <p className="mt-3 text-text-secondary">
              New lessons and science facts released regularly from HAIDER SCIENCE LAB.
            </p>
          </div>
          <a
            href="https://youtube.com/@aorticedu_haidersciencelabs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-brand-500 transition hover:text-brand-400 sm:inline-flex sm:items-center sm:gap-1"
          >
            Subscribe on YouTube
            <ArrowIcon />
          </a>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-bg.card p-10 text-center">
            <p className="text-text-secondary">Latest videos are temporarily unavailable. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function VideoCard({ video }: { video: YoutubeVideo }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover group relative overflow-hidden rounded-2xl border border-white/5 bg-bg.card"
    >
      <div className="relative aspect-video overflow-hidden bg-bg.elevated">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg.deep/85 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/75 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/5">
          <PlayIcon />
          {relativeTime(video.publishedAt)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug text-text-main transition group-hover:text-brand-400">
          {video.title}
        </h3>
        <p className="mt-2 text-xs text-text-muted">
          {video.author} · {relativeTime(video.publishedAt)}
        </p>
      </div>
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}