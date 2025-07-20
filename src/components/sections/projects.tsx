"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ManageProjectsDialog } from "@/components/manage-projects-dialog";
import { useToast } from "@/hooks/use-toast";

export type GitHubRepo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  language: string;
};

async function getGitHubRepos(username: string): Promise<GitHubRepo[]> {
    if (!username) return [];
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`, {
        next: { revalidate: 3600 } // Revalidate every hour
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch GitHub repos for user ${username}. Status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
}

export function Projects() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [githubUsername, setGithubUsername] = useState("gauri-garg");
  const [allRepos, setAllRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([]);
  const [projectImages, setProjectImages] = useState<{ [key: number]: string }>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedUsername = localStorage.getItem("githubUsername");
      if (storedUsername) setGithubUsername(JSON.parse(storedUsername));

      const storedRepoIds = localStorage.getItem("selectedRepoIds");
      if (storedRepoIds) setSelectedRepoIds(JSON.parse(storedRepoIds));
      
      const storedImages = localStorage.getItem("projectImages");
      if (storedImages) setProjectImages(JSON.parse(storedImages));
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("githubUsername", JSON.stringify(githubUsername));
    }
  }, [githubUsername, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("selectedRepoIds", JSON.stringify(selectedRepoIds));
    }
  }, [selectedRepoIds, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("projectImages", JSON.stringify(projectImages));
    }
  }, [projectImages, isClient]);
  
  const fetchRepos = useCallback(async () => {
    if (!githubUsername) return;
    setIsLoading(true);
    try {
      const repos = await getGitHubRepos(githubUsername);
      setAllRepos(repos);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching projects",
        description: "Could not fetch projects from GitHub. Please check the username and try again.",
      });
      setAllRepos([]);
    } finally {
      setIsLoading(false);
    }
  }, [githubUsername, toast]);

  useEffect(() => {
    if (isClient) {
      fetchRepos();
    }
  }, [fetchRepos, isClient]);
  
  const displayedProjects = allRepos.filter(repo => selectedRepoIds.includes(repo.id));

  if (!isClient) {
    return (
      <section id="projects" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="bg-accent text-accent-foreground">Projects</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">My Recent Work</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Here are some of the projects I've chosen to feature from my GitHub profile.
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge className="bg-accent text-accent-foreground">Projects</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">My Recent Work</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Here are some of the projects I've chosen to feature from my GitHub profile.
            </p>
          </div>
          <ManageProjectsDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            githubUsername={githubUsername}
            setGithubUsername={setGithubUsername}
            allRepos={allRepos}
            selectedRepoIds={selectedRepoIds}
            setSelectedRepoIds={setSelectedRepoIds}
            projectImages={projectImages}
            setProjectImages={setProjectImages}
            onRefresh={fetchRepos}
            isFetchingRepos={isLoading}
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : displayedProjects.length > 0 ? (
          <div className="mx-auto grid gap-8 py-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {displayedProjects.map((project) => (
              <Card key={project.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <CardHeader>
                  <Image
                    src={projectImages[project.id] || `https://placehold.co/600x400.png`}
                    alt={project.name}
                    width={600}
                    height={400}
                    className="rounded-t-lg object-cover aspect-[3/2]"
                    data-ai-hint="project screenshot"
                    onError={(e) => e.currentTarget.src = `https://placehold.co/600x400.png`}
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
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No projects selected.</p>
            <p>Click the settings icon to add projects from GitHub.</p>
          </div>
        )}
      </div>
    </section>
  );
}
