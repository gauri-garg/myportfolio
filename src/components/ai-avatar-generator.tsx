
"use client";

import { useRef, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

export function AiAvatarGenerator() {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const storedAvatar = localStorage.getItem("avatarUrl");
      if (storedAvatar) {
        setAvatarUrl(JSON.parse(storedAvatar));
      }
    } catch (error) {
      console.error("Failed to parse avatar from localStorage", error);
      localStorage.removeItem("avatarUrl");
    }
  }, []);

  useEffect(() => {
    if (avatarUrl) {
      localStorage.setItem("avatarUrl", JSON.stringify(avatarUrl));
    } else {
      localStorage.removeItem("avatarUrl");
    }
  }, [avatarUrl]);

  const handleUploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setAvatarUrl(newAvatarUrl);
        toast({
          title: "Success!",
          description: "Your avatar has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    toast({
      title: "Avatar Removed",
      description: "Your avatar has been reset to the default.",
    });
  };

  return (
    <div className="relative group transition-transform duration-300 hover:scale-105 flex flex-col items-center gap-4">
      <Avatar className="w-32 h-32 border-4 border-background shadow-lg transition-all duration-300 group-hover:shadow-2xl">
        {avatarUrl && <AvatarImage src={avatarUrl} alt="Developer Avatar" data-ai-hint="person" />}
        <AvatarFallback>GG</AvatarFallback>
      </Avatar>
       <div className="flex gap-2">
        <Button
            size="sm"
            variant="outline"
            onClick={() => uploadInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={uploadInputRef}
            onChange={handleUploadAvatar}
            className="hidden"
          />
        {avatarUrl && (
          <Button
            size="sm"
            variant="destructive"
            onClick={handleRemoveAvatar}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
