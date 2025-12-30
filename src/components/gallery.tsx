
"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/use-translation";
import { galleryImages } from "@/lib/gallery-images";

export default function Gallery() {
  const { t } = useTranslation();

  const galleryItems = [
    {
      id: "stamp",
      title: t("gallery.item1.title"),
      description: t("gallery.item1.description"),
      image: galleryImages.stamp,
    },
    {
      id: "mumbai-gpo",
      title: t("gallery.item2.title"),
      description: t("gallery.item2.description"),
      image: galleryImages.mumbaiGpo,
    },
    {
      id: "kolkata-gpo",
      title: t("gallery.item3.title"),
      description: t("gallery.item3.description"),
      image: galleryImages.kolkataGpo,
    },
    {
      id: "floating-po",
      title: t("gallery.item4.title"),
      description: t("gallery.item4.description"),
      image: galleryImages.floatingPo,
    },
  ];

  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight text-center">
          {t("gallery.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <div className="group cursor-pointer">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={item.image.imageUrl}
                      alt={item.title}
                      width={600}
                      height={400}
                      data-ai-hint={item.image.imageHint}
                      className="w-full h-full object-cover aspect-[3/2] transform transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-center text-muted-foreground group-hover:text-primary">
                    {item.title}
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl mb-4">{item.title}</DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-4">
                       <div className="overflow-hidden rounded-lg">
                         <Image
                            src={item.image.imageUrl}
                            alt={item.title}
                            width={1200}
                            height={800}
                            data-ai-hint={item.image.imageHint}
                            className="w-full h-auto object-contain"
                         />
                       </div>
                       <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
