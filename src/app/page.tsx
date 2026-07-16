import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="dark flex flex-1 flex-col items-center justify-center bg-background px-6 py-24 text-foreground">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <Image
          src="/logo-icon.svg"
          alt="Canvas UI icon"
          width={64}
          height={59}
          priority
        />
        <Image
          src="/logo.svg"
          alt="Canvas UI"
          width={222}
          height={46}
          priority
        />
        <Badge variant="secondary">v0.1.0 &middot; Open Source</Badge>
        <p className="max-w-md text-lg leading-8 text-muted-foreground">
          An innovative open source creative UI library for building
          expressive, playful interfaces.
        </p>
        <div className="flex items-center gap-3">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            GitHub
          </Button>
        </div>
        <Separator className="max-w-xs" />
        <p className="text-sm text-muted-foreground">
          Built with Next.js, Tailwind CSS v4 &amp; shadcn/ui.
        </p>
      </main>
    </div>
  );
}
