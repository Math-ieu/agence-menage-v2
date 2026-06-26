"use client";

import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { validatePromoCode } from "@/lib/api";
import { Ticket, CheckCircle2, AlertCircle } from "lucide-react";

interface PromoCodeInputProps {
  segment: 'particulier' | 'entreprise';
  service: string;
  onApplyPromo: (promo: {
    id: number;
    code: string;
    name: string;
    reduction: number;
    reduction_type: 'pourcentage' | 'montant_fixe';
    promo_type: 'simple' | 'bd';
  } | null) => void;
  getPhoneNumber?: () => string;
}

export default function PromoCodeInput({ segment, service, onApplyPromo, getPhoneNumber }: PromoCodeInputProps) {
  const [hasPromo, setHasPromo] = useState<string>("no");
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleVerify = async () => {
    if (!code.trim()) {
      setErrorMsg("Veuillez saisir un code promo.");
      return;
    }

    const phone = getPhoneNumber ? getPhoneNumber() : "";

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await validatePromoCode(code.trim(), segment, service, phone);
      if (res.valid) {
        setAppliedPromo(res);
        onApplyPromo(res);
        setErrorMsg("");
      } else {
        setAppliedPromo(null);
        onApplyPromo(null);
        setErrorMsg(res.message || "Code promo invalide.");
      }
    } catch (err) {
      setErrorMsg("Erreur lors de la validation du code.");
      setAppliedPromo(null);
      onApplyPromo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setHasPromo("no");
    setCode("");
    setAppliedPromo(null);
    setErrorMsg("");
    onApplyPromo(null);
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Ticket className="w-5 h-5 text-teal-600" />
        <h3 className="font-semibold text-slate-800 text-base">Code Promotionnel</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm text-slate-600 mb-2 block font-medium">
            Disposez-vous d'un code promo ?
          </Label>
          <RadioGroup
            value={hasPromo}
            onValueChange={(val) => {
              setHasPromo(val);
              if (val === "no") {
                handleReset();
              }
            }}
            className="flex gap-4 mt-1"
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              <RadioGroupItem value="no" id="promo-no" />
              <Label htmlFor="promo-no" className="cursor-pointer font-normal text-slate-700">Non</Label>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <RadioGroupItem value="yes" id="promo-yes" />
              <Label htmlFor="promo-yes" className="cursor-pointer font-normal text-slate-700">Oui</Label>
            </div>
          </RadioGroup>
        </div>

        {hasPromo === "yes" && (
          <div className="space-y-3 pt-2">
            {!appliedPromo ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Saisissez votre code promo (ex: OFFRE20)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 uppercase font-mono tracking-wider border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                  disabled={loading}
                />
                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={loading}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 transition-colors"
                >
                  {loading ? "Vérification..." : "Vérifier"}
                </Button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-900">
                    Code promo "{appliedPromo.code}" appliqué !
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    {appliedPromo.name} : -{appliedPromo.reduction_type === 'pourcentage' ? `${appliedPromo.reduction}%` : `${appliedPromo.reduction} MAD`}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-emerald-800 underline hover:text-emerald-900 font-medium mt-1.5 block"
                  >
                    Retirer le code promo
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-rose-900 flex-1">
                  {errorMsg}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
