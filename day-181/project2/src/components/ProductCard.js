import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ProductCard = ({ product }) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden transition-shadow hover:shadow-lg">
      {/* Product Image */}
      <div className="flex h-64 items-center justify-center bg-muted p-6">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        </Link>
      </div>

      {/* Product Details */}
      <CardContent className="space-y-3 p-5">
        {/* Category */}
        <p className="text-sm font-medium capitalize text-muted-foreground">
          {product.category}
        </p>
        {/* Title */}
        <h2 className="line-clamp-2 text-lg font-semibold text-card-foreground">
          {product.title}
        </h2>
        {/* Description */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">★</span>

          <span className="text-sm font-medium text-card-foreground">
            {product.rating.rate}
          </span>

          <span className="text-sm text-muted-foreground">
            ({product.rating.count} reviews)
          </span>
        </div>
        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-card-foreground">
            ${product.price}
          </span>

          <Button>Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
