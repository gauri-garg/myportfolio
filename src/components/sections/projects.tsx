import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type GitHubRepo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  language: string;
};

async function getProjects(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch("https://api.github.com/users/vercel/repos?sort=updated&per_page=6", {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!res.ok) {
      console.error("Failed to fetch GitHub repos");
      return [];
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function Projects() {
  const projects = await getProjects();

  return (
    <section id="projects" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge className="bg-accent text-accent-foreground">Projects</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">My Recent Work</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Here are some of the projects I've been working on. These are automatically updated from my GitHub profile.
            </p>
          </div>
        </div>
        <div className="mx-auto grid gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <CardHeader>
                <Image
                  src={`https://placehold.co/600x400.png?text=${project.name.replace(/-/g, ' ')}`}
                  alt={project.name}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover"
                  data-ai-hint="project screenshot"
                />
                <CardTitle className="pt-4 font-headline">{project.name}</CardTitle>
                <div className="flex items-center pt-2">
                  {project.language && <Badge variant="secondary">{project.language}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{project.description || "No description available."}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={project.html_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
                {project.homepage && (
                  <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                    <Link href={project.homepage} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
