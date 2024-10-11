"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PricingDetails = {
  productId: string;
  basePrice: number;
  availableFinancing: boolean;
  financingOptions: string[];
};

type PricingCardProps = {
  pricing: PricingDetails;
};

export function PricingCard({ pricing }: PricingCardProps) {
  return (
    <Card className="mx-auto w-full max-w-md my-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Product ID: {pricing.productId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Base Price</p>
            <p className="text-lg font-medium">${pricing.basePrice}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Available Financing</p>
            <p className="text-lg font-medium">
              {pricing.availableFinancing ? "Yes" : "No"}
            </p>
          </div>
          {pricing.availableFinancing && (
            <div className="col-span-2">
              <p className="text-muted-foreground text-sm">Financing Options</p>
              <ul className="text-lg font-medium">
                {pricing.financingOptions.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type PricingListProps = {
  pricings: PricingDetails[];
};

export function PricingList({ pricings }: PricingListProps) {
  return (
    <div>
      {pricings.map((pricing) => (
        <PricingCard key={pricing.productId} pricing={pricing} />
      ))}
    </div>
  );
}
