import { FiEye, FiShoppingCart, FiCheck } from "react-icons/fi";
import { HiLightningBolt } from "react-icons/hi";
import { BiPackage } from "react-icons/bi";

const GridView = ({ products, cart, openDetailsModal, handleAddToCart }) => {
  return (
    <div className="grid grid-cols-2 tab:grid-cols-3 pc:grid-cols-4 gap-4">
      {products.map((product) => {
        const isAdded = cart.some((i) => i.id === product.id);
        const isDarkshop = product.store === "darkshop";

        return (
          <div
            key={product.id}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary-600/20 transition-all group flex flex-col"
          >
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-50 dark:bg-slate-800/50 aspect-[4/3]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              {isDarkshop && (
                <span className="absolute top-2 left-2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  ADVANCED
                </span>
              )}
              {product.instant_delivery && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <HiLightningBolt size={8} /> Fast
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col flex-1 gap-2">
              <p className="text-sm font-bold text-gray-800 dark:text-slate-100 line-clamp-2 capitalize leading-snug">{product.name}</p>

              {/* Platform icon + seller */}
              <div className="flex items-center gap-1.5">
                {product.icon && (
                  <img src={product.icon} alt="" className="w-4 h-4 rounded-full object-cover flex-shrink-0" onError={(e) => { e.target.style.display = "none"; }} />
                )}
                <span className="text-[11px] text-gray-400 dark:text-slate-500 truncate">{product.platform}</span>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-extrabold text-primary-600">${product.price}</span>
                {product.stock_quantity != null && (
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1">
                    <BiPackage size={10} /> {product.stock_quantity}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => openDetailsModal(product)}
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 text-[11px] font-semibold py-1.5 rounded-xl transition-all"
                >
                  <FiEye size={12} /> Details
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isAdded}
                  className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 rounded-xl transition-all ${
                    isAdded
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-primary-600 hover:bg-primary-700 text-white"
                  }`}
                >
                  {isAdded ? <><FiCheck size={11} /> Added</> : <><FiShoppingCart size={11} /> Cart</>}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GridView;
