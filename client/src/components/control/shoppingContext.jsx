import React, { createContext, useState, useContext } from "react";

const ShoppingContext = createContext();

export const ShoppingProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [scrollY, setScrollY] = useState(0);

  return (
    <ShoppingContext.Provider
      value={{
        categories,
        setCategories,
        products,
        setProducts,
        currentSlide,
        setCurrentSlide,
        openCategoryId,
        setOpenCategoryId,
        selectedGroupId,
        setSelectedGroupId,
        currentProductPage,
        setCurrentProductPage,
        scrollY,
        setScrollY,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

// Custom hook to use context
export const useShopping = () => useContext(ShoppingContext);
