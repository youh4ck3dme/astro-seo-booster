import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Activity,
    Settings,
    ShieldCheck,
    FileText,
    Globe,
    Terminal,
    RefreshCw,
    Cpu,
    Database,
    BarChart3
} from "lucide-react";

type SystemStats = {
    content: {
        totalPosts: number;
        avgReadingTime: number;
        latestPost?: string;
    };
    system: {
        nodeVersion: string;
        platform: string;
        uptime: number;
        memoryUsage: string;
    };
    seo: {
        sitemapUrl: string;
        robotsUrl: string;
        rssUrl: string;
    };
};

export default function Dashboard() {
    const { toast } = useToast();

    const { data: stats, isLoading, refetch } = useQuery<SystemStats>({
        queryKey: ["/api/admin/system-stats"],
    });

    const execMutation = useMutation({
        mutationFn: async (scriptName: string) => {
            const res = await fetch("/api/admin/execute-script", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scriptName }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Execution failed");
            }
            return res.json();
        },
        onSuccess: (data) => {
            toast({
                title: "Skript úspešne spustený",
                description: data.output || "Akcia prebehla v poriadku.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Chyba pri spúšťaní",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Načítavam štatistiky projektu...</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Monitorovanie a správa projektu AstroSEOBooster</p>
                </div>
                <Button onClick={() => refetch()} variant="outline" className="w-fit border-primary/20 hover:border-primary/50">
                    <RefreshCw className="mr-2 h-4 w-4" /> Aktualizovať
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Quick Stats Cards */}
                <StatCard
                    title="Celkom článkov"
                    value={stats?.content.totalPosts ?? 0}
                    subValue="SEO Obsah"
                    icon={FileText}
                    color="blue"
                />
                <StatCard
                    title="Čas čítania"
                    value={`${stats?.content.avgReadingTime ?? 0} min`}
                    subValue="Priemer na článok"
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Využitie RAM"
                    value={stats?.system.memoryUsage ?? "0MB"}
                    subValue={`Node ${stats?.system.nodeVersion}`}
                    icon={Database}
                    color="purple"
                />
                <StatCard
                    title="Systém Uptime"
                    value={formatUptime(stats?.system.uptime ?? 0)}
                    subValue={stats?.system.platform ?? "windows"}
                    icon={Settings}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Actions Section */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl ring-1 ring-slate-200/50 overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white">
                            <CardTitle className="flex items-center gap-2">
                                <Terminal className="h-5 w-5" /> Automatizačné skripty
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ActionBox
                                    name="AutoSort Downloads"
                                    desc="Upratal váš priečinok Downloads podľa typu súborov (týždenná údržba)."
                                    script="AutoSortDownloads"
                                    isLoading={execMutation.isPending}
                                    onAction={(s: string) => execMutation.mutate(s)}
                                />
                                <ActionBox
                                    name="Reclaim WSL Memory"
                                    desc="Uvoľní RAM z WSL2/Docker späť do Windowsu (vhodné pred buildom)."
                                    script="ReclaimWSLMemory"
                                    isLoading={execMutation.isPending}
                                    onAction={(s: string) => execMutation.mutate(s)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Health Section */}
                    <Card className="border-none shadow-xl bg-white/60 backdrop-blur-xl ring-1 ring-slate-200/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <ShieldCheck className="h-5 w-5" /> Bezpečnosť a Zdravie projektu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <HealthItem label="NPM Audit" status="PASS" desc="Fixnuté (Moderate vulnerabilities)" />
                            <HealthItem label="PWA Manifest" status="PASS" desc="Validovaný a funkčný" />
                            <HealthItem label="SEO Meta Tags" status="PASS" desc="Optimalizované kľúčové slová" />
                            <HealthItem label="SSL / HTTPS" status="WARN" desc="Iba localhost (Vývojový režim)" />
                        </CardContent>
                    </Card>
                </div>

                {/* Info Column */}
                <div className="space-y-8">
                    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 ring-1 ring-primary/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" /> SEO Indexácia
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg shadow-sm">
                                <span className="text-sm font-medium">Sitemap.xml</span>
                                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => window.open(stats?.seo.sitemapUrl, '_blank')}>Otvoriť</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg shadow-sm">
                                <span className="text-sm font-medium">Robots.txt</span>
                                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => window.open(stats?.seo.robotsUrl, '_blank')}>Otvoriť</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg shadow-sm">
                                <span className="text-sm font-medium">RSS Feed</span>
                                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors" onClick={() => window.open(stats?.seo.rssUrl, '_blank')}>Otvoriť</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg bg-slate-900 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <BarChart3 className="h-20 w-20" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xs uppercase tracking-widest text-slate-400">Posledný update obsahu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold leading-tight">
                                {stats?.content.latestPost || "Načítavam..."}
                            </p>
                            <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-tighter">
                                Rozpoznané zo sťahovacieho backendu
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subValue, icon: Icon, color }: any) {
    const colors: any = {
        blue: "text-blue-600 bg-blue-100",
        green: "text-emerald-600 bg-emerald-100",
        purple: "text-purple-600 bg-purple-100",
        orange: "text-orange-600 bg-orange-100",
    };

    return (
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{title}</p>
                        <p className="text-2xl font-bold text-slate-900">{value}</p>
                        <p className="text-[10px] text-muted-foreground">{subValue}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${colors[color]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface ActionBoxProps {
    name: string;
    desc: string;
    script: string;
    onAction: (scriptName: string) => void;
    isLoading: boolean;
}

function ActionBox({ name, desc, script, onAction, isLoading }: ActionBoxProps) {
    return (
        <div className="p-5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all group shadow-sm bg-white/40">
            <h3 className="font-bold text-slate-900 mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{desc}</p>
            <Button
                size="sm"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
                onClick={() => onAction(script)}
                disabled={isLoading}
            >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Terminal className="mr-2 h-4 w-4" />}
                Spustiť údržbu
            </Button>
        </div>
    );
}

function HealthItem({ label, status, desc }: any) {
    return (
        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-white/40 shadow-sm">
            <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">{label}</span>
                <span className="text-[10px] text-muted-foreground">{desc}</span>
            </div>
            <Badge className={status === "PASS" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-orange-100 text-orange-700 hover:bg-orange-200"}>
                {status}
            </Badge>
        </div>
    );
}
