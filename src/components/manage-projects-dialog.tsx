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
import { Settings, RefreshCw, Loader2 } from "lucide-react";
import type { GitHubRepo } from "./sections/projects";

interface ManageProjectsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  githubUsername: string;
  setGithubUsername: (username: string) => void;
  allRepos: GitHubRepo[];
  selectedRepoIds: number[];
  setSelectedRepoIds: (ids: number[]) => void;
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
  onRefresh,
  isFetchingRepos,
}: ManageProjectsDialogProps) {
  
  const handleCheckboxChange = (repoId: number) => {
    const newSelectedRepoIds = selectedRepoIds.includes(repoId)
      ? selectedRepoIds.filter((id) => id !== repoId)
      : [...selectedRepoIds, repoId];
    setSelectedRepoIds(newSelectedRepoIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-4 right-4">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Manage Projects</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Projects</DialogTitle>
          <DialogDescription>
            Select the repositories you want to display in your portfolio.
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
                placeholder="e.g., gaurigr"
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
          <Label>Select Projects</Label>
          <ScrollArea className="h-72 w-full rounded-md border">
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
                    No repositories found for this user, or there was an error.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
