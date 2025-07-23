import { SidebarContext } from "@context/SidebarContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

//internal import
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import OfferCard from "@components/offer/OfferCard";
import StickyCart from "@components/cart/StickyCart";
import Loading from "@components/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import MainCarousel from "@components/carousel/MainCarousel";
import AttributeServices from "@services/AttributeServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import FeatureCategory from "@components/category/FeatureCategory";

const Home = ({ popularProducts, discountProducts, attributes }) => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { loading, error, storeCustomizationSetting } = useGetSetting();

  useEffect(() => {
    if (router.asPath === "/") {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <StickyCart />
            
            {/* Hero Section with Modern Design */}
            <div className="bg-white shadow-sm">
              <div className="mx-auto py-8 max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                <div className="flex w-full gap-6">
                  <div className="flex-shrink-0 w-full lg:w-3/5">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <MainCarousel />
                    </div>
                  </div>
                  <div className="w-full hidden lg:flex">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <OfferCard />
                    </div>
                  </div>
                </div>
                
                {/* Modern Promotion Banner */}
               
              </div>
            </div>
 <FeatureCategory />
            {/* Ultra-Modern Feature Categories Section */}
            {storeCustomizationSetting?.home?.featured_status && (
              <div className="py-20 lg:py-28 relative overflow-hidden">
                
                {/* Dynamic Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), 
                                     radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), 
                                     radial-gradient(circle at 40% 80%, rgba(72, 187, 120, 0.1) 0%, transparent 50%)`
                  }}>
                  </div>
                </div>

                <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                  {/* Modern Header Section */}
                  <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center mb-8">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse animation-delay-200"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-600 rounded-full animate-pulse animation-delay-400"></div>
                      </div>
                    </div>
                    
                    <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6 tracking-tight">
                      <CMSkeleton
                        count={1}
                        height={60}
                        loading={loading}
                        data={storeCustomizationSetting?.home?.feature_title || "Shop by Category"}
                      />
                    </h2>
                    
                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light">
                      <CMSkeleton
                        count={4}
                        height={16}
                        error={error}
                        loading={loading}
                        data={storeCustomizationSetting?.home?.feature_description || "Discover our curated collection of premium products across various categories"}
                      />
                    </p>
                  </div>

                  {/* Revolutionary Category Cards Grid */}
                  <div className="relative">
                    {/* Glassmorphism Container */}
                    <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 lg:p-12 border border-white/30 shadow-2xl">
                     <FeatureCategory />
                    </div>

                    {/* Floating Action Button */}
                    <div className="flex justify-center mt-12">
                      <button className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <span className="flex items-center">
                          View All Categories
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Popular Products with Glass Morphism Effect */}
            {storeCustomizationSetting?.home?.popular_products_status && (
              <div className="py-16 lg:py-20">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                  <div className="mb-16 flex justify-center">
                    <div className="text-center w-full lg:w-3/5">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h2 className="text-3xl lg:text-4xl mb-4 font-bold text-gray-900 tracking-tight">
                        <CMSkeleton
                          count={1}
                          height={40}
                          loading={loading}
                          data={storeCustomizationSetting?.home?.popular_title}
                        />
                      </h2>
                      <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        <CMSkeleton
                          count={5}
                          height={12}
                          error={error}
                          loading={loading}
                          data={storeCustomizationSetting?.home?.popular_description}
                        />
                      </p>
                    </div>
                  </div>
                  
                  <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/20">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                        {popularProducts
                          ?.slice(0, storeCustomizationSetting?.home?.popular_product_limit)
                          .map((product) => (
                            <div key={product._id} className="transform hover:scale-105 transition-all duration-300">
                              <ProductCard
                                product={product}
                                attributes={attributes}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Modern CTA Card */}
       

            {/* Discount Products with Animated Background */}
            {storeCustomizationSetting?.home?.discount_product_status &&
              discountProducts?.length > 0 && (
                <div id="discount" className="py-16 lg:py-20 relative overflow-hidden">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-r from-pink-200 to-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-red-200 to-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                  </div>
                  
                  <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 flex justify-center">
                      <div className="text-center w-full lg:w-3/5">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <h2 className="text-3xl lg:text-4xl mb-4 font-bold text-gray-900 tracking-tight">
                          <CMSkeleton
                            count={1}
                            height={40}
                            loading={loading}
                            data={storeCustomizationSetting?.home?.latest_discount_title}
                          />
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                          <CMSkeleton
                            count={5}
                            height={12}
                            loading={loading}
                            data={storeCustomizationSetting?.home?.latest_discount_description}
                          />
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/30">
                      {loading ? (
                        <CMSkeleton
                          count={20}
                          height={20}
                          error={error}
                          loading={loading}
                        />
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                          {discountProducts
                            ?.slice(0, storeCustomizationSetting?.home?.latest_discount_product_limit)
                            .map((product) => (
                              <div key={product._id} className="transform hover:scale-105 transition-all duration-300">
                                <ProductCard
                                  product={product}
                                  attributes={attributes}
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </Layout>
      )}
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { cookies } = context.req;
  const { query, _id } = context.query;

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? query : "",
    }),
    AttributeServices.getShowingAttributes(),
  ]);

  return {
    props: {
      attributes,
      cookies: cookies,
      popularProducts: data.popularProducts,
      discountProducts: data.discountedProducts,
    },
  };
};

export default Home;
