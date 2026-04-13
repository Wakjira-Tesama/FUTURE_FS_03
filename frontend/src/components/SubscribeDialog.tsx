import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { apiFetch, authApi, type ApiError } from "@/lib/api";

export type PricingPlan = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  features: string[];
};

function getToken() {
  return localStorage.getItem("apexfit_token") || "";
}

function setToken(token: string) {
  localStorage.setItem("apexfit_token", token);
}

export function SubscribeDialog({
  open,
  onOpenChange,
  plan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PricingPlan | null;
}) {
  const [tab, setTab] = useState<"register" | "login">("register");
  const [loading, setLoading] = useState(false);

  const [registerValues, setRegisterValues] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });

  const token = useMemo(() => getToken(), [open]);

  async function subscribeWithToken(accessToken: string) {
    if (!plan) return;

    await apiFetch("/api/memberships/subscribe", {
      method: "POST",
      token: accessToken,
      json: { planId: plan._id, billingPeriod: "monthly" },
    });
  }

  function onError(e: unknown) {
    const err = e as ApiError;
    const message =
      err?.body?.message || err?.message || "Something went wrong";
    toast.error(message);
  }

  async function onSubscribeExisting() {
    if (!plan) return;
    if (!token) {
      toast.error("Please sign up or log in first");
      return;
    }

    try {
      setLoading(true);
      await subscribeWithToken(token);
      toast.success(`Subscribed to ${plan.name} (monthly)`);
      onOpenChange(false);
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  }

  async function onRegisterAndSubscribe() {
    if (!plan) return;
    try {
      setLoading(true);
      const res = await authApi.register({
        email: registerValues.email,
        password: registerValues.password,
        fullName: registerValues.fullName || undefined,
      });
      setToken(res.token);

      await subscribeWithToken(res.token);
      toast.success(`Welcome! Subscribed to ${plan.name} (monthly)`);
      onOpenChange(false);
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  }

  async function onLoginAndSubscribe() {
    if (!plan) return;
    try {
      setLoading(true);
      const res = await authApi.login({
        email: loginValues.email,
        password: loginValues.password,
      });
      setToken(res.token);

      await subscribeWithToken(res.token);
      toast.success(`Subscribed to ${plan.name} (monthly)`);
      onOpenChange(false);
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setLoading(false);
      }}
    >
      <DialogContent className="glass-card border-border/30">
        <DialogHeader>
          <DialogTitle>
            {plan ? `Get Started — ${plan.name}` : "Get Started"}
          </DialogTitle>
          <DialogDescription>
            {token
              ? "Confirm your subscription."
              : "Create an account or log in to subscribe."}
          </DialogDescription>
        </DialogHeader>

        {token ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              You’re signed in. Click below to subscribe.
            </div>
            <Button
              variant="hero"
              className="w-full"
              onClick={onSubscribeExisting}
              disabled={loading || !plan}
            >
              {loading ? "Processing…" : "Subscribe (Monthly)"}
            </Button>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="register">Sign up</TabsTrigger>
              <TabsTrigger value="login">Log in</TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={registerValues.fullName}
                  onChange={(e) =>
                    setRegisterValues((s) => ({
                      ...s,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regEmail">Email</Label>
                <Input
                  id="regEmail"
                  type="email"
                  value={registerValues.email}
                  onChange={(e) =>
                    setRegisterValues((s) => ({ ...s, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regPassword">Password</Label>
                <Input
                  id="regPassword"
                  type="password"
                  value={registerValues.password}
                  onChange={(e) =>
                    setRegisterValues((s) => ({
                      ...s,
                      password: e.target.value,
                    }))
                  }
                  placeholder="At least 8 characters"
                />
              </div>

              <Button
                variant="hero"
                className="w-full"
                onClick={onRegisterAndSubscribe}
                disabled={loading || !plan}
              >
                {loading ? "Creating account…" : "Create account & Subscribe"}
              </Button>
            </TabsContent>

            <TabsContent value="login" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={loginValues.email}
                  onChange={(e) =>
                    setLoginValues((s) => ({ ...s, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={loginValues.password}
                  onChange={(e) =>
                    setLoginValues((s) => ({ ...s, password: e.target.value }))
                  }
                />
              </div>

              <Button
                variant="hero"
                className="w-full"
                onClick={onLoginAndSubscribe}
                disabled={loading || !plan}
              >
                {loading ? "Signing in…" : "Log in & Subscribe"}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
