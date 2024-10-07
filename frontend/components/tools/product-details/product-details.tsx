"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductDetails = {
  productId: string;
  productName: string;
  manufacturer: string;
  efficiency: number;
  warrantyYears: number;
  powerOutput: number;
  dimensions: string;
  productDescription: string;
};

export function ProductDetailsCard({
  productId,
  productName,
  manufacturer,
  efficiency,
  warrantyYears,
  powerOutput,
  dimensions,
  productDescription,
}: ProductDetails) {
  return (
    <Card className="mx-auto w-full max-w-md my-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">{productDescription}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Manufacturer</p>
            <p className="text-lg font-medium">{manufacturer}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Power Output</p>
            <p className="text-lg font-medium">{powerOutput} W</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Efficiency</p>
            <p className="text-lg font-medium">{efficiency}%</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Warranty</p>
            <p className="text-lg font-medium">{warrantyYears} years</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Dimensions</p>
            <p className="text-lg font-medium">{dimensions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
