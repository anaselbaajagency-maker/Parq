"use client";

import { Wallet } from 'lucide-react';

interface BalanceBadgeProps {
    balance: number;
    className?: string;
}

export default function BalanceBadge({ balance, className = "" }: BalanceBadgeProps) {
    return (
        <div className={`flex items-center gap-2 bg-gray-50 border px-3 py-1.5 rounded-full ${className}`}>
            <Wallet size={16} className="text-gray-600" />
            <span className="text-sm font-semibold text-gray-900">
                {balance.toLocaleString()} <span className="text-[10px] text-gray-500 font-bold ml-0.5">SD</span>
            </span>
        </div>
    );
}
