import { Product, User, Category, Order, OrderItem, Review, ProductImage } from '@prisma/client';

export type { Product, User, Category, Order, OrderItem, Review };
export type ProductWithImages = Product & {
  images: ProductImage[];
  category?: Category | null;
};
export type OrderItemWithProduct = OrderItem & {
  product: Product;
};

// Extend Order to include items with product & user:
export type OrderWithItemsAndUser = Order & {
  items: OrderItemWithProduct[];
  user: User;
};