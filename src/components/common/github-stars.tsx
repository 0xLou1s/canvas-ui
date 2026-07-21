import { Star } from "lucide-react";

export const REPO = "DavidHDev/canvas-ui";

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return `${n}`;
}

async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

export async function GitHubStars() {
  const stars = await getStars();

  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noreferrer"
      aria-label={
        stars === null
          ? "Canvas UI on GitHub"
          : `Canvas UI on GitHub, ${stars} stars`
      }
      className="group inline-flex h-8 items-center gap-2 rounded-full border border-border/70 px-3 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:border-border hover:text-foreground"
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-[15px] fill-current">
        <path d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A8.01 8.01 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
      </svg>
      {stars !== null && (
        <span className="inline-flex items-center gap-1">
          <Star aria-hidden className="size-3 fill-current opacity-60" />
          {formatStars(stars)}
        </span>
      )}
    </a>
  );
}
