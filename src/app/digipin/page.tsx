"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DigiPinPage() {
  const digipinUrl = "https://dac.indiapost.gov.in/mydigipin/home";

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Know Your DIGIPIN</CardTitle>
          <CardDescription>
            Use the official India Post service below to find or create your DIGIPIN.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[800px] rounded-lg overflow-hidden border">
            <iframe
              src={digipinUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              title="India Post DIGIPIN"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
