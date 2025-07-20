
"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, RefreshCw, Loader2, Trash2 } from "lucide-react";
import type { GitHubRepo } from "./sections/projects";
import Image from "next/image";

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
  onRefresh,
  isFetchingRepos,
}: ManageProjectsDialogProps) {
  
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


  const selectedRepos = allRepos.filter(repo => selectedRepoIds.includes(repo.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-4 right-4">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Manage Projects</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Manage Projects</DialogTitle>
          <DialogDescription>
            Select repositories to display and upload a custom image for each project.
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Select Repositories</Label>
              <ScrollArea className="h-72 w-full rounded-md border mt-2">
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
                <Label>Project Images</Label>
                <ScrollArea className="h-72 w-full rounded-md border mt-2">
                    <div className="p-4 space-y-4">
                        {selectedRepos.length > 0 ? selectedRepos.map(repo => (
                            <div key={`img-${repo.id}`} className="space-y-2">
                                <Label htmlFor={`img-upload-${repo.id}`} className="text-sm font-medium">{repo.name}</Label>
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
                        )) : (
                            <p className="text-sm text-muted-foreground text-center pt-4">Select a repository to upload an image.</p>
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
