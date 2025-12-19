import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Your privacy is important to us. It is digi-pincode's policy to respect your privacy regarding any information we may collect from you across our website.
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">1. Information We Collect</h3>
          <p>
            We do not collect any personally identifiable information from our users. Our service allows you to search for postal information without requiring you to create an account or provide any personal data.
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">2. Use of Data</h3>
          <p>
            The data you enter (such as pincodes or location names) is used solely to query the public API from data.gov.in to fetch the postal information you requested. We do not store your search queries.
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">3. Cookies</h3>
          <p>
            We do not use cookies to track users or store personal information. Our website is designed to be stateless from a user perspective.
          </p>
          
          <h3 className="font-semibold text-lg text-card-foreground pt-4">4. Third-Party Services</h3>
          <p>
            This website uses the Government of India's public API (data.gov.in) to provide postal information. We are not responsible for the privacy practices of this third-party service. We encourage you to read their privacy policies.
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">5. Changes to This Privacy Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h3 className="font-semibold text-lg text-card-foreground pt-4">6. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, you can contact us via the details on our Contact Us page.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
