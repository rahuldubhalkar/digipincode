"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Have questions or feedback? We'd love to hear from you. Reach out to us through any of the channels below.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:rdubhalkar10@gmail.com" className="text-muted-foreground hover:text-primary">
                  rdubhalkar10@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <span className="text-muted-foreground">
                  +91 8237418168
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
