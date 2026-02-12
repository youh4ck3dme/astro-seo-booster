import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { insertContactSubmissionSchema, type InsertContactSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle2 } from "lucide-react";
import { trackQuoteRequest } from "@/lib/analytics";

export function QuoteForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<InsertContactSubmission>({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      apartmentSize: undefined,
      moveDate: undefined,
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertContactSubmission) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: (_, variables) => {
      setSubmitted(true);
      form.reset();
      trackQuoteRequest(variables.apartmentSize || undefined);
      toast({
        title: "Ďakujeme za vašu správu!",
        description: "Ozveme sa vám čo najskôr s cenovou ponukou.",
      });
    },
    onError: () => {
      toast({
        title: "Chyba pri odosielaní",
        description: "Skúste to prosím znova alebo nás kontaktujte telefonicky.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactSubmission) => {
    submitMutation.mutate(data);
  };

  if (submitted) {
    return (
      <Card className="bg-primary/5 border-primary/20" data-testid="card-quote-success">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold mb-2">
            Ďakujeme za vašu požiadavku!
          </h3>
          <p className="text-muted-foreground">
            Ozveme sa vám čo najskôr s presnou cenovou ponukou.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setSubmitted(false)}
            data-testid="button-submit-another"
          >
            Odoslať ďalšiu požiadavku
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-quote-form">
      <CardHeader>
        <CardTitle className="font-serif text-2xl md:text-3xl">
          Nezáväzná cenová ponuka
        </CardTitle>
        <CardDescription className="text-base">
          Vyplňte krátky formulár a my sa vám ozveme s návrhom riešenia a
          orientačnou cenou.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meno / Firma *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Vaše meno alebo názov firmy"
                        {...field}
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefón *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+421 xxx xxx xxx"
                        type="tel"
                        {...field}
                        data-testid="input-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="vas@email.sk"
                        type="email"
                        {...field}
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apartmentSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veľkosť bytu/domu</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="napr. 2-izbový byt"
                        {...field}
                        value={field.value ?? ""}
                        data-testid="input-apartment-size"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="moveDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferovaný termín sťahovania</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="napr. 15.3.2024 alebo začiatok apríla"
                      {...field}
                      value={field.value ?? ""}
                      data-testid="input-move-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poznámka *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Popíšte, čo potrebujete presťahovať, z akého poschodia, či je výťah, atď."
                      className="min-h-[120px] resize-none"
                      {...field}
                      data-testid="input-message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Honeypot field for bot protection */}
            <div className="hidden" aria-hidden="true">
              <Input
                name="website_url"
                tabIndex={-1}
                autoComplete="off"
                placeholder="Leave this empty"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={submitMutation.isPending}
                data-testid="button-submit-quote"
              >
                {submitMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitMutation.isPending ? "Odosielam..." : "Odoslať požiadavku"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
