import { Product } from '../context/CartContext';

export const products: Product[] = [
  {
    id: 1,
    name: "Salmon Roll",
    description: "Fresh salmon, avocado, cucumber, and rice",
    fullDescription: "Our signature salmon roll features premium Norwegian salmon, fresh avocado, crisp cucumber, and perfectly seasoned sushi rice. Served with wasabi, ginger, and soy sauce.",
    price: 32,
    rating: 4.9,
    reviewCount: 128,
    isHit: true,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"
    ],
    category: "rolls"
  },
  {
    id: 2,
    name: "Dragon Set",
    description: "Eel, avocado, cucumber topped with avocado and eel sauce",
    fullDescription: "A spectacular dragon roll with grilled eel, fresh cucumber, and creamy avocado, topped with more avocado and drizzled with sweet eel sauce. A feast for both eyes and palate.",
    price: 65,
    rating: 4.8,
    reviewCount: 95,
    isHit: true,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"
    ],
    category: "sets"
  },
  {
    id: 3,
    name: "Ebi Tempura",
    description: "Shrimp tempura roll with spicy mayo",
    fullDescription: "Crispy shrimp tempura wrapped in sushi rice and nori, topped with spicy mayo and eel sauce. A customer favorite!",
    price: 45,
    rating: 4.7,
    reviewCount: 203,
    isHit: true,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"
    ],
    category: "rolls"
  },
  {
    id: 4,
    name: "Miso Soup",
    description: "Traditional Japanese soup with tofu and seaweed",
    fullDescription: "Warm and comforting traditional Japanese miso soup with tofu cubes, wakame seaweed, and green onions.",
    price: 12,
    rating: 4.5,
    reviewCount: 67,
    isHit: false,
    image: "https://images.unsplash.com/photo-1618160702438-9b02fe65c1b4?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618160702438-9b02fe65c1b4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"
    ],
    category: "drinks"
  },
  {
    id: 5,
    name: "California Set",
    description: "Crab, avocado, cucumber with sesame seeds",
    fullDescription: "Classic California roll with real crab meat, fresh avocado, cucumber, and toasted sesame seeds.",
    price: 48,
    rating: 4.9,
    reviewCount: 312,
    isHit: false,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"
    ],
    category: "sets"
  },
  {
    id: 6,
    name: "Rainbow Roll",
    description: "Assorted fish on top of California roll",
    fullDescription: "Beautiful rainbow of fresh fish including salmon, tuna, shrimp, and avocado atop a California roll.",
    price: 58,
    rating: 4.8,
    reviewCount: 156,
    isHit: false,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"
    ],
    category: "rolls"
  },
  {
    id: 7,
    name: "Salmon Sashimi",
    description: "5 slices of fresh salmon",
    fullDescription: "Premium Norwegian salmon sashimi, 5 thick slices served with daikon radish and fresh shiso leaf.",
    price: 42,
    rating: 4.9,
    reviewCount: 89,
    isHit: false,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"
    ],
    category: "sets"
  },
  {
    id: 8,
    name: "Green Tea",
    description: "Japanese premium green tea",
    fullDescription: "Authentic Japanese sencha green tea, rich in antioxidants and perfectly refreshing.",
    price: 8,
    rating: 4.6,
    reviewCount: 45,
    isHit: true,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&h=600&fit=crop"
    ],
    category: "drinks"
  }
];