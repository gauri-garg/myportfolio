
"use client";

import { useRef, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Wand2 } from "lucide-react";

export function AiAvatarGenerator() {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string>("https://placehold.co/128x128.png");
  const [description, setDescription] = useState<string>("");
  const [photoDataUri, setPhotoDataUri] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      const input: GenerateAvatarInput = { description, photoDataUri };
      const result = await generateAvatar(input);
      if (result?.avatarDataUri) {
        setAvatarUrl(result.avatarDataUri);
        toast({
          title: "Success!",
          description: "Your new avatar has been generated.",
        });
        setIsDialogOpen(false);
        // Reset state
        setDescription("");
        setPhotoDataUri(undefined);
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
    <div className="relative group transition-transform duration-300 hover:scale-105 flex flex-col items-center gap-4">
      <Avatar className="w-32 h-32 border-4 border-background shadow-lg transition-all duration-300 group-hover:shadow-2xl">
        <AvatarImage src={avatarUrl} alt="Developer Avatar" data-ai-hint="person" />
        <AvatarFallback>GG</AvatarFallback>
      </Avatar>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Avatar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate AI Avatar</DialogTitle>
            <DialogDescription>
              Describe your desired avatar. You can also upload a photo to use as a reference.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Reference Picture (Optional)</Label>
              <div className="flex items-center gap-2">
                 <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                 {photoDataUri && <Avatar><AvatarImage src={photoDataUri} /></Avatar>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., A pixel art cat wearing sunglasses, in a vibrant synthwave style"
                className="col-span-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
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
