import React, { useState } from "react";
import Sidebar from "../../views/user/partials/sidebar";
import Marketplace from "../../views/user/shop/marketplace/marketplace";

const MarketplacePage = () => {
  const [platformFilter, setPlatformFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  return (
    <div className="flex bg-gray-900 min-h-screen w-full">
      {/* FIX: Sidebar is fixed, so add margin-left to content */}
      <Sidebar
        platformFilter={platformFilter}
        setPlatformFilter={setPlatformFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      {/* FIX: add margin-left equal to sidebar width so Marketplace is visible */}
      <div className="ml-[265px] flex-1">
        <Marketplace
          platformFilter={platformFilter}
          priceRange={priceRange}
        />
      </div>
    </div>
  );
};

export default MarketplacePage;
