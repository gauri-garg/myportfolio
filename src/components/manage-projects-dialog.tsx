
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, RefreshCw, Loader2, Trash2, Wand2 } from "lucide-react";
import type { GitHubRepo } from "./sections/projects";
import Image from "next/image";
import { generateProjectDescription } from "@/ai/flows/generate-project-description";
import { useToast } from "@/hooks/use-toast";

interface ManageProjectsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  githubUsername: string;
  setGithubUsername: (username: string) => void;
  allRepos: GitHubRepo[];
  selectedRepoIds: number[];
  setSelectedRepoIds: (ids: number[]) => void;
  projectImages: { [key: number]: string };
  setProjectImages: (images: { [key: number]: string }) => void;
  projectDescriptions: { [key: number]: string };
  setProjectDescriptions: (descriptions: { [key: number]: string }) => void;
  onRefresh: () => void;
  isFetchingRepos: boolean;
}

export function ManageProjectsDialog({
  isOpen,
  setIsOpen,
  githubUsername,
  setGithubUsername,
  allRepos,
  selectedRepoIds,
  setSelectedRepoIds,
  projectImages,
  setProjectImages,
  projectDescriptions,
  setProjectDescriptions,
  onRefresh,
  isFetchingRepos,
}: ManageProjectsDialogProps) {
  
  const { toast } = useToast();
  const [generatingStates, setGeneratingStates] = useState<{[key: number]: boolean}>({});

  const handleCheckboxChange = (repoId: number) => {
    const newSelectedRepoIds = selectedRepoIds.includes(repoId)
      ? selectedRepoIds.filter((id) => id !== repoId)
      : [...selectedRepoIds, repoId];
    setSelectedRepoIds(newSelectedRepoIds);
  };

  const handleImageUpload = (repoId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectImages({
          ...projectImages,
          [repoId]: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (repoId: number) => {
    const newProjectImages = { ...projectImages };
    delete newProjectImages[repoId];
    setProjectImages(newProjectImages);
  };
  
  const handleDescriptionChange = (repoId: number, value: string) => {
    setProjectDescriptions({
      ...projectDescriptions,
      [repoId]: value,
    });
  };

  const handleGenerateDescription = async (repo: GitHubRepo) => {
    setGeneratingStates(prev => ({...prev, [repo.id]: true}));
    try {
      const result = await generateProjectDescription({
        projectName: repo.name,
        language: repo.language
      });
      if (result.description) {
        handleDescriptionChange(repo.id, result.description);
        toast({
            title: "Description Generated!",
            description: `A new description for "${repo.name}" has been created.`,
        });
      }
    } catch (error) {
      console.error("Error generating description", error);
      toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Could not generate a description for this project.",
      });
    } finally {
      setGeneratingStates(prev => ({...prev, [repo.id]: false}));
    }
  };


  const selectedRepos = allRepos.filter(repo => selectedRepoIds.includes(repo.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-4 right-4">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Manage Projects</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[800px] lg:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Manage Projects</DialogTitle>
          <DialogDescription>
            Select repositories to display and customize their content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center gap-4">
            <Label htmlFor="github-username" className="text-left">
              GitHub Username
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="github-username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="col-span-3"
                placeholder="e.g., gauri-garg"
              />
              <Button onClick={onRefresh} disabled={isFetchingRepos} size="icon" variant="outline">
                {isFetchingRepos ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                 <span className="sr-only">Refresh Repositories</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label>Select Repositories</Label>
              <ScrollArea className="h-96 w-full rounded-md border mt-2">
                <div className="p-4">
                  {isFetchingRepos ? (
                     <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     </div>
                  ) : allRepos.length > 0 ? (
                    allRepos.map((repo) => (
                      <div key={repo.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={`repo-${repo.id}`}
                          checked={selectedRepoIds.includes(repo.id)}
                          onCheckedChange={() => handleCheckboxChange(repo.id)}
                        />
                        <label
                          htmlFor={`repo-${repo.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {repo.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                        No repositories found for this user.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
            <div>
                <Label>Customize Projects</Label>
                <ScrollArea className="h-96 w-full rounded-md border mt-2">
                    <div className="p-4 space-y-6">
                        {selectedRepos.length > 0 ? selectedRepos.map(repo => (
                            <div key={`custom-${repo.id}`} className="space-y-3 p-3 rounded-md bg-background/50">
                                <Label htmlFor={`desc-${repo.id}`} className="text-base font-semibold">{repo.name}</Label>
                                
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                      <Label htmlFor={`desc-${repo.id}`} className="text-xs font-medium text-muted-foreground">Description</Label>
                                      <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          className="text-xs h-7"
                                          onClick={() => handleGenerateDescription(repo)}
                                          disabled={generatingStates[repo.id]}
                                      >
                                          {generatingStates[repo.id] ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1.5" />}
                                          Generate with AI
                                      </Button>
                                    </div>
                                    <Textarea
                                      id={`desc-${repo.id}`}
                                      value={projectDescriptions[repo.id] || repo.description || ""}
                                      onChange={(e) => handleDescriptionChange(repo.id, e.target.value)}
                                      placeholder="Enter project description..."
                                      className="h-24"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor={`img-upload-${repo.id}`} className="text-xs font-medium text-muted-foreground">Custom Image</Label>
                                    <div className="flex items-center gap-2">
                                      <Input 
                                          id={`img-upload-${repo.id}`}
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleImageUpload(repo.id, e)}
                                          className="text-xs h-9 flex-grow"
                                      />
                                      {projectImages[repo.id] && (
                                        <>
                                          <Image 
                                            src={projectImages[repo.id]} 
                                            alt={`${repo.name} preview`} 
                                            width={32} 
                                            height={32} 
                                            className="rounded-sm object-cover h-8 w-8"
                                          />
                                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleRemoveImage(repo.id)}>
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Remove image</span>
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground text-center pt-4">Select a repository to customize it.</p>
                        )}
                    </div>
                </ScrollArea>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
