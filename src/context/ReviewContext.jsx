import React, { createContext, useContext, useState } from "react";

const ReviewContext = createContext();

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReview must be used within a ReviewProvider");
  }
  return context;
};

export const ReviewProvider = ({ children }) => {
  const [reviewCount, setReviewCount] = useState(0);

  const incrementReviewCount = () => {
    setReviewCount((prev) => prev + 1);
  };

  const refreshReviews = () => {
    // Trigger para componentes recarregarem reviews
    setReviewCount((prev) => prev + 1);
  };

  return (
    <ReviewContext.Provider
      value={{
        reviewCount,
        incrementReviewCount,
        refreshReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
