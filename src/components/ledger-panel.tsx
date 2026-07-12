"use client";

import { ArrowDown, ArrowUp } from "@gravity-ui/icons";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { skillApi } from "@/lib/api";
import type { Transaction } from "@/lib/types";

export function LedgerPanel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]); const [balance, setBalance] = useState<number | null>(null); const [error, setError] = useState("");
  useEffect(() => { skillApi.ledger().then((data) => { setTransactions(data.transactions); setBalance(data.balance); }).catch((requestError: Error) => setError(requestError.message)); }, []);
  return <AuthGuard><div className="shell page-section ledger-page"><header className="ledger-header"><div><p className="eyebrow rust">YOUR TIME BANK</p><h1>Credit ledger.</h1><p>A transparent record of every completed hour. Nothing moves until both members confirm.</p></div><div className="balance-card"><span>Current balance</span><strong>{balance ?? "—"}</strong><em>credits</em></div></header>{error ? <div className="inline-message error"><strong>Ledger unavailable</strong><span>{error}</span></div> : balance === null ? <div className="skeleton ledger-skeleton" /> : transactions.length ? <div className="ledger-table" role="table"><div className="ledger-row ledger-head" role="row"><span>Date</span><span>Skill & member</span><span>Credits</span><span>Balance</span></div>{transactions.map((transaction) => <div className="ledger-row" role="row" key={transaction._id}><span>{new Date(transaction.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span><span><strong>{transaction.skillName}</strong><small>{transaction.type === "Earned" ? "Taught" : "Learned"} with {transaction.counterparty.name}</small></span><span className={transaction.type === "Earned" ? "credit-earned" : "credit-spent"}>{transaction.type === "Earned" ? <ArrowUp /> : <ArrowDown />}{transaction.type === "Earned" ? "+" : "−"}{transaction.credits}</span><span>{transaction.runningBalance}</span></div>)}</div> : <div className="empty-panel"><h2>Your ledger is ready.</h2><p>Once a lesson is confirmed by both people, its hour and credit transfer will appear here.</p></div>}</div></AuthGuard>;
}
