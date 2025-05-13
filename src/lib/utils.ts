import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isHeicImage = (file: File) => {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return (
    fileType === 'image/heic' || fileType === 'image/heif' || fileName.endsWith('.heic') || fileName.endsWith('.heif')
  );
};
