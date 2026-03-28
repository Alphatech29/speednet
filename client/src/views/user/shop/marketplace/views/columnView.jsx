import { FiEye, FiShoppingCart, FiCheck } from "react-icons/fi";
import { HiLightningBolt } from "react-icons/hi";
import { BiPackage } from "react-icons/bi";

const ColumnView = ({ products, cart, openDetailsModal, handleAddToCart }) => {
  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => {
        const isAdded = cart.some((i) => i.id === product.id);
        const isDarkshop = product.store === "darkshop";

        return (
          <div
            key={product.id}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary-600/20 transition-all group flex items-center gap-4"
          >
            {/* Image */}
            <div className="relative flex-shrink-0 w-14 h-14 tab:w-16 tab:h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800/50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-slate-100 line-clamp-1 capitalize">{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {/* Platform */}
                    <div className="flex items-center gap-1">
                      {product.icon && (
                        <img src={product.icon} alt="" className="w-3.5 h-3.5 rounded-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                      )}
                      <span className="text-[11px] text-gray-400 dark:text-slate-500">{product.platform}</span>
                    </div>

                    {/* Badges */}
                    {product.instant_delivery && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                        <HiLightningBolt size={9} /> Instant
                      </span>
                    )}
                    {isDarkshop && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                        Advanced
                      </span>
                    )}
                    {product.stock_quantity != null && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-slate-500">
                        <BiPackage size={10} /> {product.stock_quantity} in stock
                      </span>
                    )}
                  </div>
                  {/* Seller */}
                  {product.seller && (
                    <div className="flex items-center gap-1.5 mt-1">
                      {product.avatar && (
                        <img src={product.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover border border-gray-200 dark:border-slate-700" onError={(e) => { e.target.style.display = "none"; }} />
                      )}
                      <span className="text-[11px] text-gray-400 dark:text-slate-500">{product.seller}</span>
                    </div>
                  )}
                </div>

                {/* Price + actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-sm font-extrabold text-primary-600">${product.price}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openDetailsModal(product)}
                      className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl transition-all"
                    >
                      <FiEye size={12} />
                      <span className="hidden tab:inline">Details</span>
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAdded}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl transition-all ${
                        isAdded
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-primary-600 hover:bg-primary-700 text-white"
                      }`}
                    >
                      {isAdded ? <FiCheck size={12} /> : <FiShoppingCart size={12} />}
                      <span className="hidden tab:inline">{isAdded ? "Added" : "Add"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ColumnView;
