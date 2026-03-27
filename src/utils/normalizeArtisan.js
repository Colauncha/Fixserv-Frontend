
export const normalizeArtisan = (artisan = {}) => {
  const cleanText = (v, fallback = "") =>
    typeof v === "string" && v.trim() === "" ? fallback : v ?? fallback;

  const reviewsCount = Number(
    artisan?.reviewsCount ||
      (Array.isArray(artisan?.reviewsList) ? artisan.reviewsList.length : 0) ||
      artisan?.reviews ||
      0
  );

  const yearsFromCreatedAt = artisan?.createdAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(artisan.createdAt).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )
      )
    : null;

  const professionLabel =
    artisan?.profession ||
    artisan?.roleTitle ||
    artisan?.categoryTitle ||
    artisan?.specialty ||
    (Array.isArray(artisan?.skills) && artisan.skills[0]?.name) ||
    "Technician";

  const categories =
    Array.isArray(artisan?.categories) && artisan.categories.length
      ? artisan.categories.slice(0, 3)
      : ["Phone", "Tablet", "Laptop"];


  const services =
    artisan?.services ||
    artisan?.service ||
    artisan?.serviceList ||
    artisan?.skills ||
    [];

  return {
    id: artisan?._id || artisan?.id,

    name: cleanText(
      artisan?.fullName,
      cleanText(artisan?.businessName, "Unnamed Artisan")
    ),

    image:
      artisan?.profilePicture ||
      artisan?.profileImage ||
      artisan?.avatar ||
      null,

    verified: true,

    profession: professionLabel,

    skills: Array.isArray(artisan?.skills)
      ? artisan.skills.map((s) =>
          typeof s === "string" ? s : s?.title || s?.name
        )
      : [],

    rating: Number(artisan?.rating || 0),
    reviewsCount,

    categories: categories.map((c) =>
      typeof c === "string" ? c : c?.name || c?.title
    ),

    experience: yearsFromCreatedAt,

    location: cleanText(artisan?.location, "Unknown"),


    services: Array.isArray(services) ? services : [],


    startingPrice: artisan?.startingPrice ?? null,

    raw: artisan,
  };
};
