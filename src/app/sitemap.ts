import { SITE } from "@/lib/constants";

export default async function Sitemap() {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}