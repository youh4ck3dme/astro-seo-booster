import { useState, useEffect } from "react";
import { MessageSquare, Calendar } from "lucide-react";

interface Comment {
    id: number;
    authorName: string;
    authorEmail: string;
    content: string;
    createdAt: string;
    isApproved: boolean;
}

interface CommentsSectionProps {
    postId: number;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
    const [authorName, setAuthorName] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");
    const [content, setContent] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    async function fetchComments() {
        try {
            const response = await fetch(`/api/blog/posts/${postId}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch(`/api/blog/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authorName, authorEmail, content }),
            });

            if (response.ok) {
                setAuthorName("");
                setAuthorEmail("");
                setContent("");
                setMessage({ type: 'success', text: "Komentár odoslaný! Čaká na schválenie administrátorom." });
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.error || "Nepodarilo sa odoslať komentár." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Chyba pri odosielaní komentára." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('sk-SK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="comments-section space-y-12">
            <div className="comments-list-container">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    Komentáre ({comments.length})
                </h2>

                {isLoading ? (
                    <div className="text-gray-400 italic py-4">Načítavam komentáre...</div>
                ) : comments.length === 0 ? (
                    <div className="text-gray-500 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center">
                        Zatiaľ žiadne komentáre. Buďte prvý, kto pridá komentár!
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment-item p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                        {comment.authorName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-gray-900">{comment.authorName}</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="add-comment-container bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h3 className="text-xl font-black mb-6">Pridať komentár</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Vaše meno"
                            className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Váš email"
                            className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                            value={authorEmail}
                            onChange={(e) => setAuthorEmail(e.target.value)}
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Váš komentár..."
                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all min-h-[120px]"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                    {message && (
                        <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Odosiela sa..." : "Odoslať komentár"}
                    </button>
                </form>
            </div>
        </div>
    );
}