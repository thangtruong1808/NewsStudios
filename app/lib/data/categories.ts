export interface SubCategory {
  id: number;
  name: string;
  category_id: number;
}

export interface Category {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export const categories: Category[] = [
  {
    id: 125,
    name: "Technology",
    created_at: new Date(),
    updated_at: new Date(),
  },
  { id: 126, name: "Business", created_at: new Date(), updated_at: new Date() },
  {
    id: 127,
    name: "Lifestyle",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 128,
    name: "Entertainment",
    created_at: new Date(),
    updated_at: new Date(),
  },
  { id: 129, name: "Science", created_at: new Date(), updated_at: new Date() },
  { id: 130, name: "Sports", created_at: new Date(), updated_at: new Date() },
  {
    id: 131,
    name: "Education",
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const subcategories: SubCategory[] = [
  // Technology
  { id: 251, name: "Artificial Intelligence", category_id: 125 },
  { id: 252, name: "Web Development", category_id: 125 },
  { id: 253, name: "Mobile Apps", category_id: 125 },
  { id: 254, name: "Cybersecurity", category_id: 125 },
  { id: 255, name: "Cloud Computing", category_id: 125 },
  { id: 256, name: "Hardware Reviews", category_id: 125 },
  { id: 257, name: "Programming Languages", category_id: 125 },

  // Business
  { id: 258, name: "Entrepreneurship", category_id: 126 },
  { id: 259, name: "Marketing", category_id: 126 },
  { id: 260, name: "Finance", category_id: 126 },
  { id: 261, name: "Startups", category_id: 126 },
  { id: 262, name: "Leadership", category_id: 126 },
  { id: 263, name: "Digital Marketing", category_id: 126 },
  { id: 264, name: "E-commerce", category_id: 126 },

  // Lifestyle
  { id: 265, name: "Health & Fitness", category_id: 127 },
  { id: 266, name: "Fashion & Beauty", category_id: 127 },
  { id: 267, name: "Travel & Adventure", category_id: 127 },
  { id: 268, name: "Food & Cooking", category_id: 127 },
  { id: 269, name: "Home & Living", category_id: 127 },
  { id: 270, name: "Personal Development", category_id: 127 },
  { id: 271, name: "Relationships", category_id: 127 },

  // Entertainment
  { id: 272, name: "Movies & TV Shows", category_id: 128 },
  { id: 273, name: "Music & Concerts", category_id: 128 },
  { id: 274, name: "Gaming & Esports", category_id: 128 },
  { id: 275, name: "Books & Literature", category_id: 128 },
  { id: 276, name: "Celebrity News", category_id: 128 },
  { id: 277, name: "Art & Design", category_id: 128 },
  { id: 278, name: "Theater & Performance", category_id: 128 },

  // Science
  { id: 279, name: "Physics", category_id: 129 },
  { id: 280, name: "Biology", category_id: 129 },
  { id: 281, name: "Chemistry", category_id: 129 },
  { id: 282, name: "Astronomy", category_id: 129 },
  { id: 283, name: "Environmental Science", category_id: 129 },
  { id: 284, name: "Medical Research", category_id: 129 },
  { id: 285, name: "Technology Innovation", category_id: 129 },

  // Sports
  { id: 286, name: "Football", category_id: 130 },
  { id: 287, name: "Basketball", category_id: 130 },
  { id: 288, name: "Tennis", category_id: 130 },
  { id: 289, name: "Olympics", category_id: 130 },
  { id: 298, name: "Badminton", category_id: 130 },
  { id: 290, name: "Fitness & Training", category_id: 130 },

  // Education
  { id: 291, name: "Online Learning", category_id: 131 },
  { id: 292, name: "Higher Education", category_id: 131 },
  { id: 293, name: "Career Development", category_id: 131 },
  { id: 294, name: "K-12 Education", category_id: 131 },
  { id: 295, name: "Language Learning", category_id: 131 },
  { id: 296, name: "Study Tips", category_id: 131 },
  { id: 297, name: "Educational Technology", category_id: 131 },
];
