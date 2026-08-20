import type { ReactNode } from "react";
import { CartProvider } from "@/features/cart/context/CartContext";
import { WishlistProvider } from "@/features/wishlist/context/WishlistContext";
import { ToastProvider } from "@/features/toast/context/ToastContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Storefront chrome — deliberately not shared with /admin, which has its
// own dashboard shell (sidebar, dense internal-tool layout) instead of a
// reskinned version of this.
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
