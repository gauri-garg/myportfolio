import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AiAvatarGenerator } from "@/components/ai-avatar-generator";

export function Landing() {
  return (
    <section
      id="home"
      className="container flex flex-col md:flex-row items-center justify-center gap-16 px-4 md:px-6 py-24 md:py-32 relative aurora"
    >
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary-foreground fade-in">
          Gauri Garg
        </h1>
        <p className="max-w-[600px] mx-auto md:mx-0 text-muted-foreground md:text-xl my-6 fade-in-delay-1">
          A creative developer crafting beautiful and functional web
          experiences. Welcome to my animated portfolio.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start fade-in-delay-2">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20">
            <Link href="#projects">
              View My Work <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
      <div className="flex-1 flex justify-center md:justify-center fade-in-delay-3">
        <AiAvatarGenerator />
      </div>
    </section>
  );
}
