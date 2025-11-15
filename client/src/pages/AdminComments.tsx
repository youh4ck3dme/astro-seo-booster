import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { MessageSquare, Check, Calendar, User, FileText, Lock } from "lucide-react";
import { formatDate } from "@/lib/seo";
import { Link } from "wouter";

interface PendingComment {
  id: string;
  postId: string;
  postTitle: string;
  postSlug: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export default function AdminCommentsPage() {
  const { toast } = useToast();
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Security: Only use localStorage (no URL params to prevent credential leaks)
    const savedKey = localStorage.getItem("admin_key");
    
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  const { data: pendingComments = [], isLoading } = useQuery<PendingComment[]>({
    queryKey: ["/api/comments/pending"],
    enabled: isAuthenticated && !!adminKey,
    queryFn: async () => {
      const response = await fetch(`/api/comments/pending`, {
        headers: {
          'x-admin-key': adminKey,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending comments');
      }
      
      return response.json();
    },
  });

  const approveCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/comments/${commentId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to approve comment');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments/pending"] });
      toast({
        title: "Komentár schválený",
        description: "Komentár bol úspešne schválený a je teraz viditeľný.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: error.message || "Nepodarilo sa schváliť komentár.",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim()) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_key", adminKey);
    } else {
      toast({
        variant: "destructive",
        title: "Chyba",
        description: "Zadajte admin kľúč.",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey("");
    localStorage.removeItem("admin_key");
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Lock className="h-6 w-6 text-primary" />
                <h1 className="font-serif text-2xl font-bold">
                  Admin Prihlásenie
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Zadajte admin kľúč pre prístup k správe komentárov
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="admin-key" className="text-sm font-medium mb-2 block">
                    Admin Kľúč
                  </label>
                  <Input
                    id="admin-key"
                    type="password"
                    placeholder="Zadajte admin kľúč..."
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required
                    data-testid="input-admin-key"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="button-admin-login">
                  Prihlásiť sa
                </Button>
              </form>
              <div className="mt-4 text-xs text-muted-foreground">
                Admin kľúč musí byť nastavený v prostredí ADMIN_KEY pre bezpečnosť.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-serif text-4xl font-bold">
              Správa komentárov
            </h1>
            <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-admin-logout">
              Odhlásiť sa
            </Button>
          </div>
          <p className="text-muted-foreground">
            Prehliadajte a schvaľujte komentáre čakajúce na moderáciu
          </p>
        </header>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                Načítavam neschválené komentáre...
              </div>
            </CardContent>
          </Card>
        ) : pendingComments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-serif text-xl font-bold mb-2">
                Žiadne neschválené komentáre
              </h2>
              <p className="text-muted-foreground">
                Momentálne nie sú žiadne komentáre čakajúce na schválenie.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingComments.map((comment) => (
              <Card key={comment.id} data-testid={`pending-comment-${comment.id}`}>
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Neschválené</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(new Date(comment.createdAt))}
                        </span>
                      </div>
                      <Link href={`/blog/${comment.postSlug}`}>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" data-testid={`link-post-${comment.postSlug}`}>
                          <FileText className="h-4 w-4" />
                          <span>{comment.postTitle}</span>
                        </div>
                      </Link>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => approveCommentMutation.mutate(comment.id)}
                      disabled={approveCommentMutation.isPending}
                      data-testid={`button-approve-${comment.id}`}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Schváliť
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium" data-testid={`text-comment-author-${comment.id}`}>{comment.authorName}</span>
                    <span className="text-muted-foreground">
                      ({comment.authorEmail})
                    </span>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm leading-relaxed" data-testid={`text-comment-content-${comment.id}`}>
                      {comment.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
