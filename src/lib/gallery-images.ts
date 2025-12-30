
import data from './gallery.json';
import type { ImagePlaceholder } from './placeholder-images';

export type GalleryImageSet = {
    stamp: ImagePlaceholder;
    mumbaiGpo: ImagePlaceholder;
    kolkataGpo: ImagePlaceholder;
    floatingPo: ImagePlaceholder;
}

export const galleryImages: GalleryImageSet = data;
