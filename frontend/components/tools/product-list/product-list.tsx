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

type ProductCardProps = {
  product: ProductDetails;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="mx-auto w-full max-w-md my-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{product.productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">{product.productDescription}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Manufacturer</p>
            <p className="text-lg font-medium">{product.manufacturer}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Power Output</p>
            <p className="text-lg font-medium">{product.powerOutput} W</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Efficiency</p>
            <p className="text-lg font-medium">{product.efficiency}%</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Warranty</p>
            <p className="text-lg font-medium">{product.warrantyYears} years</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Dimensions</p>
            <p className="text-lg font-medium">{product.dimensions}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type ProductListProps = {
  products: ProductDetails[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  );
}
