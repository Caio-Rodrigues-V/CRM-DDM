"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bot, Loader2, Key, MessageSquare, ToggleLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SettingsPanelHead } from "./settings-panel-head";

export function AiAgentSettings() {
  const supabase = createClient();
  const { accountId, canEditSettings } = useAuth();

  const [enabled, setEnabled] = useState(false);
  const [apiProvider, setApiProvider] = useState<"gemini" | "openai" | "claude" | "hermes">("gemini");
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    loadConfig();
  }, [accountId]);

  async function loadConfig() {
    setLoading(false);
    try {
      const { data, error } = await supabase
        .from("ai_config")
        .select("*")
        .eq("account_id", accountId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setEnabled(data.enabled);
        setApiProvider(data.api_provider);
        setApiKey(data.api_key || "");
        setSystemPrompt(data.system_prompt || "");
      }
    } catch (err) {
      console.error("Failed to load AI config:", err);
      toast.error("Falha ao carregar configuração do Agente de IA");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!accountId) return;

    if (enabled && apiProvider !== "hermes" && !apiKey.trim()) {
      toast.error("A chave de API é obrigatória para ativar o Agente de IA");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("ai_config")
        .upsert({
          account_id: accountId,
          enabled,
          api_provider: apiProvider,
          api_key: apiKey.trim(),
          system_prompt: systemPrompt.trim(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "account_id" });

      if (error) throw error;
      toast.success("Configurações do Agente de IA salvas!");
    } catch (err) {
      console.error("Failed to save AI config:", err);
      toast.error("Erro ao salvar configurações do Agente de IA");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="max-w-3xl space-y-6 animate-in fade-in-50 duration-200">
      <SettingsPanelHead
        title="Agente de Atendimento com IA"
        description="Configure um atendente virtual inteligente para responder automaticamente seus clientes no WhatsApp."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Bot className="size-4 text-primary" />
                  Status do Agente
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Ative ou desative as respostas automáticas do agente inteligente.
                </CardDescription>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                disabled={!canEditSettings}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
              <MessageSquare className="size-4 shrink-0 text-amber-400" />
              <span>
                <strong>Nota:</strong> O agente de IA responderá apenas as conversas que <strong>não possuírem</strong> um atendente humano atribuído. Se um atendente assumir o chat, a IA parará de responder automaticamente.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className={!enabled ? "opacity-60" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Key className="size-4 text-primary" />
              Integração e Chave de API
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Escolha seu provedor e insira sua chave de API para habilitar o serviço.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Provedor de IA</Label>
                <select
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value as any)}
                  disabled={!enabled || !canEditSettings}
                  className="h-9 w-full rounded-lg border border-border bg-muted px-2.5 text-sm text-foreground outline-none focus:border-primary disabled:cursor-not-allowed"
                >
                  <option value="gemini">Google Gemini (Recomendado)</option>
                  <option value="openai">OpenAI (ChatGPT)</option>
                  <option value="claude">Anthropic Claude</option>
                  <option value="hermes">Nous Hermes (Modo Billing - Sem Chave)</option>
                </select>
              </div>

               <div className="space-y-2">
                <Label className="text-muted-foreground">Chave de API (API Key)</Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={!enabled || !canEditSettings}
                  placeholder={
                    apiProvider === "gemini"
                      ? "AIzaSy..."
                      : apiProvider === "openai"
                      ? "sk-proj-..."
                      : apiProvider === "claude"
                      ? "sk-ant-..."
                      : "Opcional (Deixe em branco para usar o billing da plataforma)"
                  }
                  className="text-sm placeholder:text-muted-foreground"
                />
                {apiProvider === "hermes" && (
                  <div className="mt-3 space-y-2 border-t border-border/40 pt-2.5">
                    <p className="text-[10px] text-emerald-400 leading-normal">
                      <strong>Modo Billing:</strong> Se você deixar o campo de chave em branco, os custos de tokens serão faturados no saldo da plataforma.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">Quer usar sua própria assinatura?</span>
                      <a
                        href="https://portal.nousresearch.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline flex items-center gap-0.5 font-medium"
                      >
                        Fazer Login no Nous Portal ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={!enabled ? "opacity-60" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageSquare className="size-4 text-primary" />
              Instruções de Comportamento (System Prompt)
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Defina a personalidade, as regras de atendimento e as respostas que a IA deve dar aos clientes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Instruções para o Agente</Label>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                disabled={!enabled || !canEditSettings}
                rows={8}
                placeholder={`Você é um assistente virtual atencioso da empresa [Nome].
Seu objetivo é ajudar os clientes com dúvidas frequentes sobre nossos produtos e serviços.
Seja sempre simpático, direto e escreva em português do Brasil.`}
                className="text-sm font-sans"
              />
            </div>
          </CardContent>
        </Card>

        {canEditSettings && (
          <Button
            type="submit"
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" />
                Salvando...
              </>
            ) : (
              "Salvar Configurações"
            )}
          </Button>
        )}
      </form>
    </section>
  );
}
