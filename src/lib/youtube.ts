import { YOUTUBE_CHANNEL_HANDLE, YOUTUBE_PLAYLISTS } from "./constants";

export const YOUTUBE_CHANNEL_ID = "UCwgXLL2oqCV-Os4o13vtcwA";
export const YOUTUBE_UPLOADS_PLAYLIST_ID = "UUwgXLL2oqCV-Os4o13vtcwA";

export type YoutubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
  publishedAtRelative: string;
  description: string;
  author: string;
};

export type YoutubePlaylist = {
  number: string;
  id: string;
  title: string;
  videoCount: number;
  url: string;
  thumbnail: string;
};

const CHANNEL_VIDEOS_URL = `https://www.youtube.com/${YOUTUBE_CHANNEL_HANDLE}/videos`;
const UPLOADS_FEED_URL = `https://www.youtube.com/feeds/videos.xml?playlist_id=${YOUTUBE_UPLOADS_PLAYLIST_ID}`;
const CHANNEL_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

function decodeHtml(value: string): string {
  return value
    .replace(/&/g, "&")
    .replace(/"/g, '"')
    .replace(/'|&apos;/g, "'")
    .replace(/</g, "<")
    .replace(/>/g, ">");
}

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
}

async function fetchRss(url: string, retries = 1): Promise<string | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/xml, application/rss+xml, text/xml",
        },
        next: { revalidate: 900, tags: ["youtube-rss"] },
      });
      if (res.ok) return await res.text();
      if (i < retries) await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    } catch {
      if (i < retries) await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  return null;
}

async function parseFeed(xml: string, author: string = YOUTUBE_CHANNEL_HANDLE.replace("@", "")): Promise<YoutubeVideo[]> {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  const videos: YoutubeVideo[] = [];
  for (const [, entry] of entries) {
    const id = entry.match(/<yt:videoId>([^<]*)<\/yt:videoId>/)?.[1];
    const title = stripCdata(entry.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const link = entry.match(/<link[^>]*href="([^"]+)"[^>]*>/)?.[1] ?? entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1];
    const published = entry.match(/<published>([^<]*)<\/published>/)?.[1];
    const updated = entry.match(/<updated>([^<]*)<\/updated>/)?.[1];
    const authorMatch = entry.match(/<name>([^<]*)<\/name>/)?.[1];
    const mediaContent = entry.match(/<media:thumbnail[^>]*url="([^"]*)"/)?.[1];

    let thumbnail = mediaContent;
    if (!thumbnail && id) {
      thumbnail = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    }

    if (!id || !title) continue;

    videos.push({
      id,
      title,
      url: link ?? `https://www.youtube.com/watch?v=${id}`,
      thumbnail: thumbnail ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      publishedAt: published ?? updated ?? "",
      publishedAtRelative: "",
      description: stripCdata(entry.match(/<media:description[^>]*>([\s\S]*?)<\/media:description>/)?.[1] ?? ""),
      author: authorMatch ?? author,
    });
  }
  return videos;
}

async function fetchLatestVideos(limit: number): Promise<YoutubeVideo[]> {
  // Try uploads playlist RSS feed (most reliable)
  let xml = await fetchRss(UPLOADS_FEED_URL);
  if (xml) {
    const videos = await parseFeed(xml);
    if (videos.length > 0) return videos.slice(0, limit);
  }

  // Fallback to channel RSS feed
  xml = await fetchRss(CHANNEL_FEED_URL);
  if (xml) {
    const videos = await parseFeed(xml);
    if (videos.length > 0) return videos.slice(0, limit);
  }

  // Final fallback: scrape channel page
  try {
    const res = await fetch(CHANNEL_VIDEOS_URL, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
      next: { revalidate: 900, tags: ["youtube-videos"] },
    });
    if (res.ok) {
      const html = await res.text();
      const ids = [...html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)].map((m) => m[1]);
      const unique = [...new Set(ids)].slice(0, limit);
      const results = await Promise.all(unique.map((id) => fetchVideoMetadata(id)));
      return results.filter((v): v is YoutubeVideo => v !== null);
    }
  } catch {}

  return [];
}

type OEmbedResponse = {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
};

async function fetchVideoMetadata(id: string): Promise<YoutubeVideo | null> {
  try {
    const endpoint = new URL("https://www.youtube.com/oembed");
    endpoint.searchParams.set("url", `https://www.youtube.com/watch?v=${id}`);
    endpoint.searchParams.set("format", "json");
    const res = await fetch(endpoint.toString(), {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400, tags: ["youtube-video-metadata"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as OEmbedResponse;
    if (!data.title) return null;
    return {
      id,
      title: decodeHtml(data.title),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: data.thumbnail_url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      publishedAt: "",
      publishedAtRelative: "",
      description: "",
      author: data.author_name ?? YOUTUBE_CHANNEL_HANDLE.replace("@", ""),
    };
  } catch {
    return null;
  }
}

async function fetchPlaylistMetadata(): Promise<YoutubePlaylist[]> {
  const out: YoutubePlaylist[] = [];

  for (const p of YOUTUBE_PLAYLISTS) {
    const playlistId = new URL(p.url).searchParams.get("list") ?? p.id;
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
    let videoCount = 0;
    let feedTitle = `Playlist ${p.number}`;

    try {
      const xml = await fetchRss(feedUrl, 0);
      if (xml) {
        videoCount = [...xml.matchAll(/<entry>/g)].length;
        feedTitle = xml.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? feedTitle;
      }
    } catch {}

    // Use first video's thumbnail from feed, or a valid placeholder
    let thumbnail = `https://img.youtube.com/vi/${playlistId}/default.jpg`;
    // Note: playlist ID thumbnails don't always exist, so this is a fallback

    out.push({
      number: p.number,
      id: playlistId,
      title: feedTitle,
      videoCount,
      url: p.url,
      thumbnail,
    });
  }

  return out;
}

export async function getLatestVideos(limit = 6): Promise<YoutubeVideo[]> {
  try {
    return await fetchLatestVideos(limit);
  } catch {
    return [];
  }
}

export async function getPlaylists(): Promise<YoutubePlaylist[]> {
  try {
    return await fetchPlaylistMetadata();
  } catch {
    return YOUTUBE_PLAYLISTS.map((p) => ({
      number: p.number,
      id: new URL(p.url).searchParams.get("list") ?? p.id,
      title: `Playlist ${p.number}`,
      videoCount: 0,
      url: p.url,
      thumbnail: `https://img.youtube.com/vi/${p.id}/default.jpg`,
    }));
  }
}

export function relativeTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}