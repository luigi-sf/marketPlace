import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { sellerService } from "../../services/sellerService";
import type {
  SellerProfileResponse,
  CreateSellerProfileDTO,
  UpdateSellerProfileDTO,
} from "../../types/seller/seller";
import { SellerContext } from "./sellerContext";
import "../../assets/styles/seller.scss";

export function SellerProvider({ children }: { children: ReactNode }) {
  const [seller, setSeller] = useState<SellerProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const isSeller = !!seller;
  const isApproved = seller?.isApproved === true;

  // 🔄 Atualiza dados do seller
 async function refreshSeller() {
  setLoading(true)
  try {
    const sellerData = await sellerService.getMyStore()
    console.log("SELLER DATA:", sellerData)

    setSeller({
      ...sellerData,
      isApproved: !!sellerData.isApproved
    })

  } catch (err) {
    console.error(err)
    setSeller(null)
  } finally {
    setLoading(false)
  }
}

  // 🏪 Criar seller
  async function createSeller(data: CreateSellerProfileDTO) {
    setLoading(true);
    try {
      const newSeller = await sellerService.create(data);
      setSeller({
        ...newSeller,
        isApproved: !!newSeller.isApproved,
      });
    } catch (err) {
      console.error("Erro ao criar seller:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✏️ Atualizar seller
  async function updateSeller(data: UpdateSellerProfileDTO) {
  if (!seller) return;

  setLoading(true);
  try {
    const updated = await sellerService.updateMyStore(data);

    setSeller({
      ...updated,
      isApproved: !!updated.isApproved,
    });

  } catch (err) {
    console.error("Erro ao atualizar seller:", err);
  } finally {
    setLoading(false);
  }
}

  // 🚀 Auto refresh a cada 5 segundos
  useEffect(() => {
    refreshSeller();

    const interval = setInterval(() => {
      refreshSeller();
    }, 500000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SellerContext.Provider
      value={{
        seller,
        loading,
        isSeller,
        isApproved,
        createSeller,
        updateSeller,
        refreshSeller,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}