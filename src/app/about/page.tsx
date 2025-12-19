"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">About digi-pincode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to digi-pincode, your one-stop solution for finding postal information across India. Our mission is to provide an easy-to-use, fast, and reliable tool for looking up pincodes and post office details.
          </p>
          <p>
            This application is built with modern web technologies to ensure a seamless experience on any device. We leverage the official Indian postal data API to provide you with the most accurate and up-to-date information available.
          </p>
          <p>
            Whether you're sending a letter, shipping a package, or just curious about a location, digi-pincode is here to help.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
