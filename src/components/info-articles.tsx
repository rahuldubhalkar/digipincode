
import { getTranslation } from "@/lib/i18n/get-translation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

async function getInfoArticles(t: (key: string) => string) {
    return [
        {
            title: t('info_articles.what_is_digi_pincode.title'),
            content: t('info_articles.what_is_digi_pincode.content'),
        },
        {
            title: t('info_articles.what_is_pincode.title'),
            content: t('info_articles.what_is_pincode.content'),
        },
        {
            title: t('info_articles.how_to_use.title'),
            content: t('info_articles.how_to_use.content'),
        },
    ];
}

export default async function InfoArticles() {
    const t = await getTranslation('en');
    const articles = await getInfoArticles(t);

    return (
        <div className="space-y-8">
            {articles.map((article, index) => (
                <Card key={index} className="shadow-lg border-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline tracking-tight">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base text-gray-700 dark:text-gray-300">{article.content}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
