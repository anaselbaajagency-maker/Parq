"use client";

import { AlertTriangle } from 'lucide-react';

interface WalletWarningProps {
    currentBalance: number;
    dailyCost: number;
    canPublish: boolean;
}

export default function WalletWarning({ currentBalance, dailyCost, canPublish }: WalletWarningProps) {
    if (canPublish) return null;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
            <AlertTriangle className="flex-shrink-0" />
            <div>
                <h4 className="font-semibold text-sm">Solde insuffisant</h4>
                <p className="text-sm mt-1">
                    Votre solde actuel est de <strong>{currentBalance} crédits</strong>.
                    Cette catégorie requiert <strong>{dailyCost} crédits/jour</strong>.
                    Veuillez recharger votre portefeuille avant de publier.
                </p>
                <button className="mt-3 text-sm font-medium underline">
                    Recharger mon portefeuille
                </button>
            </div>
        </div>
    );
}
