// Serviço simples para reviews - sem classes complicadas
const API_BASE = "http://localhost:5000/api";

// Buscar reviews de um jogo
export const getReviews = async (gameId) => {
  try {
    const response = await fetch(`${API_BASE}/reviews?gameId=${gameId}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar reviews");
    }
    const data = await response.json();
    return data.reviews || data || [];
  } catch (error) {
    console.error("Erro ao buscar reviews:", error);
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro na API:", errorText);
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("❌ Erro ao criar review:", error);
    throw error;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro ao atualizar:", errorText);
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("❌ Erro ao atualizar review:", error);
    throw error;
  }
};

// Deletar review
export const deleteReview = async (reviewId) => {
  try {
    console.log("🗑️ Deletando review:", reviewId);

    const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro ao deletar:", errorText);
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao deletar review:", error);
    throw error;
  }
};

// Buscar reviews de um usuário
export const getReviewsByUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/reviews?userId=${userId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return {
      success: true,
      data: data.reviews || data || [],
    };
  } catch (error) {
    console.error("Erro ao buscar reviews do usuário:", error);
    return {
      success: false,
      message: error.message,
      data: [],
    };
  }
};

