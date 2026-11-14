import { YoutubePlaylist } from "@/lib/youtube";

export async function PlaylistSection() {
  const playlists = await getPlaylistsSafe();

  return (
    <section id="playlists" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              Playlists
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
              Curated learning sequences
            </h2>
            <p className="mt-3 text-text-secondary">
              Progressive video sequences designed for focused, structured learning.
            </p>
          </div>
          <a
            href="https://youtube.com/@aorticedu_haidersciencelabs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-brand-500 transition hover:text-brand-400 sm:inline-flex sm:items-center sm:gap-1"
          >
            View all on YouTube
            <ArrowIcon />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group relative overflow-hidden rounded-2xl border border-white/5 bg-bg.card"
            >
              <div className="relative aspect-video overflow-hidden bg-bg.elevated">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg.deep/90 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/5">
                  Playlist {p.number}
                </span>
                <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/5">
                  <PlayIcon />
                  {p.videoCount} videos
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text-main transition group-hover:text-brand-400">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs text-text-muted">Watch the full sequence on YouTube</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

async function getPlaylistsSafe(): Promise<(YoutubePlaylist & { number: string })[]> {
  const { getPlaylists } = await import("@/lib/youtube");
  const playlists = await getPlaylists();
  return playlists.map((p, i) => ({
    number: p.number || String(i + 1).padStart(2, "0"),
    id: p.id,
    title: p.title,
    videoCount: p.videoCount,
    url: p.url,
    thumbnail: p.thumbnail,
  }));
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