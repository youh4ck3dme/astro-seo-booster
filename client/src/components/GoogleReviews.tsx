import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Phone, Globe, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type GoogleReview = {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
};

type LocationData = {
  name: string;
  rating: number;
  userRatingsTotal: number;
  address: string;
  phone: string;
  website: string;
};

type GoogleReviewsData = {
  reviews: GoogleReview[];
  location: LocationData | null;
  message?: string;
};

export function GoogleReviews() {
  const { data, isLoading } = useQuery<GoogleReviewsData>({
    queryKey: ["/api/google-reviews"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!data || (!data.reviews.length && !data.location)) {
    return null;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5" data-testid={`stars-rating-${rating}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {data.location && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl flex items-center gap-2">
              Google Hodnotenia
              <Badge variant="secondary" className="text-sm font-normal">
                {data.location.rating.toFixed(1)} / 5.0
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-6">
              {data.location.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span data-testid="text-location-address">{data.location.address}</span>
                </div>
              )}
              {data.location.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a 
                    href={`tel:${data.location.phone.replace(/\s/g, '')}`}
                    className="hover:text-primary transition-colors"
                    data-testid="link-location-phone"
                  >
                    {data.location.phone}
                  </a>
                </div>
              )}
              {data.location.website && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={data.location.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                    data-testid="link-location-website"
                  >
                    Webová stránka
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              {renderStars(Math.round(data.location.rating))}
              <span className="text-sm text-muted-foreground" data-testid="text-total-reviews">
                ({data.location.userRatingsTotal} hodnotení)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {data.reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-semibold">
            Nedávne recenzie
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.reviews.slice(0, 6).map((review, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-review-${index}`}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate" data-testid={`text-reviewer-${index}`}>
                        {review.author_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {review.relative_time_description}
                      </div>
                    </div>
                    {review.author_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="flex-shrink-0"
                      >
                        <a
                          href={review.author_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-testid={`link-reviewer-profile-${index}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  {renderStars(review.rating)}
                  
                  {review.text && (
                    <p className="text-sm text-muted-foreground line-clamp-4" data-testid={`text-review-content-${index}`}>
                      {review.text}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {data.reviews.length > 6 && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                asChild
                data-testid="button-view-all-reviews"
              >
                <a
                  href={`https://search.google.com/local/reviews?placeid=${process.env.GOOGLE_PLACE_ID || 'ChIJAbCdYpBfbEcRYXZ3z0vLPPw'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  Zobraziť všetky recenzie na Google
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
