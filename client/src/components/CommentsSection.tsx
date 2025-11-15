import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { MessageSquare, User, Calendar } from "lucide-react";
import { formatDate } from "@/lib/seo";
import type { Comment } from "@shared/schema";

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { toast } = useToast();
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/blog/posts", postId, "comments"],
  });

  const createCommentMutation = useMutation({
    mutationFn: async (commentData: { authorName: string; authorEmail: string; content: string }) => {
      return await apiRequest("POST", `/api/blog/posts/${postId}/comments`, commentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts", postId, "comments"] });
      setAuthorName("");
      setAuthorEmail("");
      setContent("");
      toast({
        title: "Komentár odoslaný",
        description: "Váš komentár bol odoslaný a čaká na schválenie.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: error.message || "Nepodarilo sa odoslať komentár.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Všetky polia sú povinné.",
      });
      return;
    }

    createCommentMutation.mutate({
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      content: content.trim(),
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Komentáre ({comments.length})
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-4">
              Načítavam komentáre...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Zatiaľ žiadne komentáre. Buďte prvý, kto pridá komentár!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(new Date(comment.createdAt))}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-serif text-xl font-bold">
            Pridať komentár
          </h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="comment-name" className="text-sm font-medium mb-2 block">
                  Meno *
                </label>
                <Input
                  id="comment-name"
                  type="text"
                  placeholder="Vaše meno"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                  data-testid="input-comment-name"
                />
              </div>
              <div>
                <label htmlFor="comment-email" className="text-sm font-medium mb-2 block">
                  Email *
                </label>
                <Input
                  id="comment-email"
                  type="email"
                  placeholder="vas@email.sk"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  required
                  data-testid="input-comment-email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="comment-content" className="text-sm font-medium mb-2 block">
                Komentár *
              </label>
              <Textarea
                id="comment-content"
                placeholder="Váš komentár..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                data-testid="textarea-comment-content"
              />
            </div>
            <div className="text-xs text-muted-foreground mb-4">
              * Váš komentár bude zverejnený po schválení administrátorom.
            </div>
            <Button 
              type="submit" 
              disabled={createCommentMutation.isPending}
              data-testid="button-submit-comment"
            >
              {createCommentMutation.isPending ? "Odosiela sa..." : "Odoslať komentár"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
