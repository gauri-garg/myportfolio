"use client";

import { useState } from "react";
import { generateAvatar, type GenerateAvatarInput } from "@/ai/flows/generate-avatar";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";

export function AiAvatarGenerator() {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string>("https://placehold.co/128x128.png");
  const [description, setDescription] = useState<GenerateAvatarInput>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a description for your avatar.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await generateAvatar(description);
      if (result?.avatarDataUri) {
        setAvatarUrl(result.avatarDataUri);
        toast({
          title: "Success!",
          description: "Your new avatar has been generated.",
        });
        setIsDialogOpen(false);
      } else {
        throw new Error("Failed to generate avatar.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating your avatar. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group">
      <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
        <AvatarImage src={avatarUrl} alt="Developer Avatar" />
        <AvatarFallback>DA</AvatarFallback>
      </Avatar>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Wand2 className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate AI Avatar</DialogTitle>
            <DialogDescription>
              Describe your desired avatar. Be as creative as you like!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="description"
              placeholder="e.g., A pixel art cat wearing sunglasses, in a vibrant synthwave style"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
