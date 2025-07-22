"use client"

import Hero from "./components/Hero"
import FeaturedProducts from "./components/FeaturedProducts"
import ProductModal from "./components/ProductModal"
import { useApp } from "./contexts/AppContext"

export default function BuyerHomePage() {
  const { state, dispatch } = useApp()

  const handleCloseModal = () => {
    dispatch({ type: "SET_PRODUCT_MODAL_OPEN", payload: false })
    dispatch({ type: "SET_SELECTED_PRODUCT", payload: null })
  }

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <ProductModal product={state.selectedProduct} isOpen={state.isProductModalOpen} onClose={handleCloseModal} />
    </>
  )
}
