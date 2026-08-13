"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createAccount, generatePrivateKey } from "genlayer-js";
type Mode = "none" | "injected" | "browser";
type Wallet = { address?: string; mode: Mode; privateKey?: string; connectInjected: () => Promise<void>; ensureBrowserWallet: () => void; disconnect: () => void; exportKey: () => void; importKey: (key: string) => void; };
const keyName = "gsource.browser_wallet.v1"; const Context = createContext<Wallet | null>(null);
declare global { interface Window { ethereum?: { request: (args: { method: string }) => Promise<unknown> } } }
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string>(); const [privateKey, setPrivateKey] = useState<string>(); const [mode, setMode] = useState<Mode>("none");
  useEffect(() => { const key = localStorage.getItem(keyName); if (key) { try { setPrivateKey(key); setAddress(createAccount(key as `0x${string}`).address); setMode("browser"); } catch { localStorage.removeItem(keyName); } } }, []);
  const connectInjected = async () => { if (!window.ethereum) throw new Error("No injected wallet found. Choose Browser wallet instead."); const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[]; if (!accounts[0]) throw new Error("No wallet account was selected."); setAddress(accounts[0]); setPrivateKey(undefined); setMode("injected"); };
  const ensureBrowserWallet = () => { let key = localStorage.getItem(keyName); if (!key) { if (!window.confirm("GSource will store a wallet key in this browser. Export it before clearing browser data.")) return; key = generatePrivateKey(); localStorage.setItem(keyName, key); } setPrivateKey(key); setAddress(createAccount(key as `0x${string}`).address); setMode("browser"); };
  const disconnect = () => { setAddress(undefined); setPrivateKey(undefined); setMode("none"); };
  const exportKey = () => { if (privateKey) void navigator.clipboard.writeText(privateKey); };
  const importKey = (key: string) => { const account = createAccount(key as `0x${string}`); localStorage.setItem(keyName, key); setPrivateKey(key); setAddress(account.address); setMode("browser"); };
  const value = useMemo(() => ({ address, mode, privateKey, connectInjected, ensureBrowserWallet, disconnect, exportKey, importKey }), [address, mode, privateKey]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useWallet = () => { const value = useContext(Context); if (!value) throw new Error("Wallet provider missing"); return value; };
