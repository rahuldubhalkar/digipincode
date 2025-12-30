import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export interface AppPlaceholderImages {
    gdsIncentive: ImagePlaceholder;
    centralPayCommission: ImagePlaceholder;
}

export const placeholderImages: AppPlaceholderImages = data.placeholderImages;
