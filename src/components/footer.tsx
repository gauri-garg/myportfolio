import React from "react";
import Link from "next/link";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 bg-secondary">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">Gauri Garg</span>
        </div>
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Gauri Garg. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
