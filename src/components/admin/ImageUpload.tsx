"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
  placeholder = "URL ou uploader un fichier",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'upload");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Erreur réseau");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  async function handleRemove() {
    if (value && value.startsWith("http") && value.includes("vercel-storage")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
      } catch {
        // ignore delete errors
      }
    }
    onChange("");
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-afro-dark/70">{label}</label>

      {value ? (
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-afro-dark/10 bg-white">
            <img src={value} alt="Aperçu" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-afro-dark/40">{value}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-afro-dark/30 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="Supprimer l'image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[80px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-afro-dark/10 bg-afro-light px-4 py-4 transition-colors hover:border-afro-orange/30 hover:bg-afro-orange/5"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-afro-orange" />
          ) : (
            <>
              <Upload className="mb-1 h-5 w-5 text-afro-dark/25" />
              <p className="text-xs text-afro-dark/40">{placeholder}</p>
              <p className="text-[10px] text-afro-dark/25">JPG, PNG, WebP, SVG — max 4 MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Fallback URL manuelle */}
      {!value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 min-h-[44px] w-full rounded-xl border border-afro-dark/10 bg-afro-light px-4 text-base text-afro-dark transition-colors focus:border-afro-orange focus:outline-none focus:ring-1 focus:ring-afro-orange/30"
          placeholder={placeholder}
        />
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
