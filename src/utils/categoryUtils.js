const getCategoryOwnerId = (category) => {
  const rawUserId = category?.userId;

  if (!rawUserId) {
    return "";
  }

  if (typeof rawUserId === "string") {
    return rawUserId;
  }

  if (typeof rawUserId === "object") {
    return rawUserId._id || rawUserId.id || "";
  }

  return "";
};

export const normalizeCategory = (category, fallbackUserId = "") => {
  if (!category || typeof category !== "object") {
    return category;
  }

  const normalizedUserId = getCategoryOwnerId(category) || fallbackUserId || "";

  return {
    ...category,
    _id: category._id || category.id,
    id: category.id || category._id,
    userId: normalizedUserId,
  };
};

export const normalizeCategories = (categories = []) =>
  categories.map((category) => normalizeCategory(category));
