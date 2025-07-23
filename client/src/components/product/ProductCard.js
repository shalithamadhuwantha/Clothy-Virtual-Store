import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { IoAdd, IoBagAddSharp, IoRemove } from "react-icons/io5";
import { useCart } from "react-use-cart";

//internal import
import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import { notifyError } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import useGetSetting from "@hooks/useGetSetting";
import Discount from "@components/common/Discount";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { handleLogEvent } from "src/lib/analytics";

const ProductCard = ({ product, attributes }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const currency = globalSetting?.default_currency || "$";

  const handleAddItem = (p) => {
    if (p.stock < 1) return notifyError("Insufficient stock!");

    if (p?.variants?.length > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const { slug, variants, categories, description, ...updatedProduct } = product;
    const newItem = {
      ...updatedProduct,
      title: showingTranslateValue(p?.title),
      id: p._id,
      variant: p.prices,
      price: p.prices.price,
      originalPrice: product.prices?.originalPrice,
    };
    addItem(newItem);
  };

  const handleModalOpen = (event, id) => {
    setModalOpen(event);
  };

  return (
    <>
      {modalOpen && (
        <ProductModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          product={product}
          currency={currency}
          attributes={attributes}
        />
      )}

      <div 
        className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges Container */}
        <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-start">
          <Stock product={product} stock={product.stock} card />
          <Discount product={product} />
        </div>

        {/* Image Container */}
        <div
          onClick={() => {
            handleModalOpen(!modalOpen, product._id);
            handleLogEvent(
              "product",
              `opened ${showingTranslateValue(product?.title)} product modal`
            );
          }}
          className="relative flex-shrink-0 cursor-pointer overflow-hidden rounded-t-2xl bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200"
          style={{ aspectRatio: '1/1' }}
        >
          <div className="relative w-full h-full p-4 sm:p-6">
            {product.image[0] ? (
              <ImageWithFallback 
                src={product.image[0]} 
                alt={showingTranslateValue(product?.title)}
                className={`object-contain transition-all duration-300 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
            ) : (
              <Image
                src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt="product placeholder"
                className={`object-contain transition-all duration-300 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col p-4 sm:p-5 lg:p-6">
          {/* Product Info */}
          <div className="flex-1 mb-4">
            {product.unit && (
              <span className="inline-block px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-full mb-2">
                {product.unit}
              </span>
            )}
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 leading-tight mb-2">
              <span className="line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200">
                {showingTranslateValue(product?.title)}
              </span>
            </h3>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between gap-3 mt-auto">
            <div className="flex-1 min-w-0">
              <Price
                card
                product={product}
                currency={currency}
                price={
                  product?.isCombination
                    ? product?.variants[0]?.price
                    : product?.prices?.price
                }
                originalPrice={
                  product?.isCombination
                    ? product?.variants[0]?.originalPrice
                    : product?.prices?.originalPrice
                }
              />
            </div>

            {/* Cart Controls */}
            <div className="flex-shrink-0">
              {inCart(product._id) ? (
                <div>
                  {items.map(
                    (item) =>
                      item.id === product._id && (
                        <div
                          key={item.id}
                          className="flex items-center bg-emerald-50 border border-emerald-200 rounded-xl p-1 min-w-[100px] sm:min-w-[110px]"
                        >
                          <button
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity - 1)
                            }
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white hover:bg-emerald-500 hover:text-white text-emerald-600 border border-emerald-200 hover:border-emerald-500 transition-all duration-200"
                            aria-label="Decrease quantity"
                          >
                            <IoRemove className="w-4 h-4" />
                          </button>
                          <span className="flex-1 text-center text-sm font-semibold text-emerald-700 px-2">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              item?.variants?.length > 0
                                ? handleAddItem(item)
                                : handleIncreaseQuantity(item)
                            }
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-500 hover:border-emerald-600 transition-all duration-200"
                            aria-label="Increase quantity"
                          >
                            <IoAdd className="w-4 h-4" />
                          </button>
                        </div>
                      )
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleAddItem(product)}
                  className="group/btn flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-emerald-500 border-2 border-gray-200 hover:border-emerald-500 rounded-xl text-gray-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="Add to cart"
                >
                  <IoBagAddSharp className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
