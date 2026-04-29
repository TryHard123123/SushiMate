const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/Product');

const products = [
  // ==================== РОЛЛЫ (20 шт) ====================
  {
    name: "California Roll",
    description: "Crab meat, avocado, cucumber with sesame seeds",
    fullDescription: "Classic California roll with real crab meat, fresh avocado, cucumber, and toasted sesame seeds. A perfect starter for sushi beginners.",
    price: 38,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.9,
    reviewCount: 312,
    isHit: true
  },
  {
    name: "Spicy Tuna Roll",
    description: "Fresh tuna, spicy mayo, cucumber, scallions",
    fullDescription: "Premium tuna mixed with spicy mayo, fresh cucumber, and scallions. For those who love a kick of heat!",
    price: 42,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.8,
    reviewCount: 189,
    isHit: true
  },
  {
    name: "Rainbow Roll",
    description: "Assorted fish on top of California roll",
    fullDescription: "Beautiful rainbow of fresh fish including salmon, tuna, shrimp, and avocado atop a California roll.",
    price: 58,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.9,
    reviewCount: 256,
    isHit: true
  },
  {
    name: "Philadelphia Roll",
    description: "Smoked salmon, cream cheese, cucumber",
    fullDescription: "Creamy Philadelphia cream cheese paired with smoked salmon and fresh cucumber. A customer favorite!",
    price: 45,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.9,
    reviewCount: 278,
    isHit: false
  },
  {
    name: "Dragon Roll",
    description: "Eel, avocado, cucumber topped with avocado",
    fullDescription: "Grilled eel, fresh cucumber, and creamy avocado, topped with more avocado and drizzled with sweet eel sauce.",
    price: 65,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.8,
    reviewCount: 195,
    isHit: true
  },
  {
    name: "Volcano Roll",
    description: "Spicy baked scallop on top of California roll",
    fullDescription: "Baked scallop mixed with spicy mayo and masago, served on top of a California roll. Explosive flavor!",
    price: 62,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.7,
    reviewCount: 134,
    isHit: false
  },
  {
    name: "Crunchy Shrimp Roll",
    description: "Tempura shrimp, avocado, crunchy topping",
    fullDescription: "Crispy tempura shrimp with creamy avocado, topped with crunchy panko and spicy mayo.",
    price: 48,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.8,
    reviewCount: 167,
    isHit: false
  },
  {
    name: "Salmon Avocado Roll",
    description: "Fresh salmon, avocado, cucumber",
    fullDescription: "Simple yet delicious combination of fresh salmon, creamy avocado, and crisp cucumber.",
    price: 35,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.7,
    reviewCount: 203,
    isHit: false
  },
  {
    name: "Spicy Salmon Roll",
    description: "Fresh salmon, spicy mayo, jalapeno",
    fullDescription: "Fresh salmon with spicy mayo and fresh jalapeno slices. A perfect balance of heat and freshness.",
    price: 44,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.8,
    reviewCount: 98,
    isHit: false
  },
  {
    name: "Soft Shell Crab Roll",
    description: "Deep-fried soft shell crab, avocado, cucumber",
    fullDescription: "Crispy deep-fried soft shell crab with fresh avocado and cucumber, topped with spicy mayo and eel sauce.",
    price: 72,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.9,
    reviewCount: 76,
    isHit: true
  },
  {
    name: "Spicy Scallop Roll",
    description: "Fresh scallops, spicy mayo, masago, cucumber",
    fullDescription: "Sweet and tender scallops mixed with spicy mayo and masago, wrapped with fresh cucumber.",
    price: 56,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.8,
    reviewCount: 54,
    isHit: false
  },
  {
    name: "Boston Roll",
    description: "Shrimp, avocado, cucumber, lettuce",
    fullDescription: "Poached shrimp with fresh avocado, cucumber, and lettuce. Light and refreshing!",
    price: 40,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.6,
    reviewCount: 87,
    isHit: false
  },
  {
    name: "Alaskan Roll",
    description: "Smoked salmon, cream cheese, avocado",
    fullDescription: "Smoked salmon with cream cheese and avocado. Simple yet delicious!",
    price: 43,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.7,
    reviewCount: 112,
    isHit: false
  },
  {
    name: "Miami Roll",
    description: "Spicy tuna, cream cheese, avocado, breaded and fried",
    fullDescription: "Spicy tuna and cream cheese rolled and lightly fried, topped with spicy mayo and eel sauce.",
    price: 52,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.8,
    reviewCount: 143,
    isHit: false
  },
  {
    name: "Black Dragon Roll",
    description: "Spicy tuna, shrimp tempura, avocado, black tobiko",
    fullDescription: "Spicy tuna and crispy shrimp tempura, topped with avocado and black tobiko. A signature roll!",
    price: 68,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.9,
    reviewCount: 203,
    isHit: true
  },
  {
    name: "Lobster Roll",
    description: "Lobster salad, avocado, cucumber, topped with tobiko",
    fullDescription: "Luxurious lobster salad with fresh avocado and cucumber, topped with masago and drizzled with wasabi aioli.",
    price: 85,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 5.0,
    reviewCount: 45,
    isHit: true
  },
  {
    name: "Shrimp Tempura Roll",
    description: "Tempura shrimp, avocado, cucumber, masago",
    fullDescription: "Classic shrimp tempura roll with fresh avocado, cucumber, and masago. Crunchy and delicious!",
    price: 46,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.8,
    reviewCount: 234,
    isHit: false
  },
  {
    name: "Spider Roll",
    description: "Soft shell crab, avocado, cucumber, masago",
    fullDescription: "Crispy soft shell crab with fresh avocado and cucumber, drizzled with unagi sauce and spicy mayo.",
    price: 66,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.9,
    reviewCount: 178,
    isHit: true
  },
  {
    name: "Green Dragon Roll",
    description: "Shrimp tempura, cucumber, topped with avocado and eel sauce",
    fullDescription: "Shrimp tempura roll topped with fresh avocado and drizzled with sweet eel sauce.",
    price: 58,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.8,
    reviewCount: 156,
    isHit: false
  },
  {
    name: "Tiger Roll",
    description: "Shrimp tempura, spicy tuna, avocado, tobiko",
    fullDescription: "Shrimp tempura and spicy tuna, topped with avocado and tobiko. A tiger's stripe pattern!",
    price: 62,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "rolls",
    rating: 4.9,
    reviewCount: 112,
    isHit: true
  },

  // ==================== СЕТЫ (15 шт) ====================
  {
    name: "Deluxe Sushi Set",
    description: "12 pcs assorted premium sushi",
    fullDescription: "12 pieces of chef's selection premium sushi including salmon, tuna, shrimp, and tamago. Served with miso soup.",
    price: 89,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.9,
    reviewCount: 89,
    isHit: true
  },
  {
    name: "Family Roll Set",
    description: "3 classic rolls: California, Spicy Tuna, Philadelphia",
    fullDescription: "Perfect for family sharing! Includes California Roll, Spicy Tuna Roll, and Philadelphia Roll. 24 pieces total.",
    price: 95,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.8,
    reviewCount: 145,
    isHit: false
  },
  {
    name: "Premium Sashimi Set",
    description: "15 slices of assorted fresh sashimi",
    fullDescription: "15 thick slices of premium sashimi including salmon, tuna, yellowtail, and shrimp. Served with fresh wasabi.",
    price: 110,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.9,
    reviewCount: 67,
    isHit: true
  },
  {
    name: "Vegan Sushi Set",
    description: "8 pcs vegetable rolls & avocado maki",
    fullDescription: "Delicious vegan-friendly rolls with avocado, cucumber, carrot, and pickled radish. Served with gluten-free soy sauce.",
    price: 52,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.6,
    reviewCount: 34,
    isHit: false
  },
  {
    name: "Chef's Special Omakase",
    description: "Chef's selection of the freshest fish of the day",
    fullDescription: "Experience the best of SushiMate with our chef's omakase selection. 8 pieces of chef's choice nigiri and 1 specialty roll.",
    price: 125,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 5.0,
    reviewCount: 23,
    isHit: true
  },
  {
    name: "Love Boat for Two",
    description: "Romantic set for 2: 20 pcs sushi + 8 pcs sashimi",
    fullDescription: "Perfect for date night! 20 pieces of assorted sushi and 8 pieces of premium sashimi. Served on a special boat.",
    price: 145,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.9,
    reviewCount: 156,
    isHit: true
  },
  {
    name: "Party Tray (50 pcs)",
    description: "Large party tray: 50 assorted rolls and nigiri",
    fullDescription: "Perfect for parties and gatherings! 50 pieces of assorted rolls and nigiri. Includes soy sauce, wasabi, and ginger.",
    price: 220,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.8,
    reviewCount: 89,
    isHit: false
  },
  {
    name: "Kids Sushi Set",
    description: "4 pcs California roll + chicken katsu + french fries",
    fullDescription: "Kid-friendly set with mini California rolls, crispy chicken katsu, and french fries.",
    price: 35,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.7,
    reviewCount: 67,
    isHit: false
  },
  {
    name: "Spicy Lover's Set",
    description: "Spicy tuna, spicy salmon, volcano roll",
    fullDescription: "For spice lovers! Includes Spicy Tuna Roll, Spicy Salmon Roll, and Volcano Roll. 18 pieces total.",
    price: 78,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.9,
    reviewCount: 112,
    isHit: true
  },
  {
    name: "Veggie Delight Set",
    description: "Assorted vegetable rolls (24 pcs)",
    fullDescription: "24 pieces of assorted vegetarian rolls: avocado, cucumber, carrot, and pickled radish.",
    price: 48,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.6,
    reviewCount: 45,
    isHit: false
  },
  {
    name: "Salmon Lover's Set",
    description: "5 salmon rolls + 5 salmon sashimi + salmon avocado roll",
    fullDescription: "Salmon overload! 5 salmon rolls, 5 salmon sashimi, and salmon avocado roll.",
    price: 85,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.9,
    reviewCount: 98,
    isHit: true
  },
  {
    name: "Tuna Lover's Set",
    description: "5 tuna rolls + 5 tuna sashimi + spicy tuna roll",
    fullDescription: "Tuna overload! 5 tuna rolls, 5 tuna sashimi, and spicy tuna roll.",
    price: 88,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.8,
    reviewCount: 76,
    isHit: false
  },
  {
    name: "Premium Nigiri Set (10 pcs)",
    description: "10 pieces of chef's premium nigiri",
    fullDescription: "10 pieces of chef's selection premium nigiri: salmon, tuna, shrimp, eel, and more.",
    price: 95,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.9,
    reviewCount: 134,
    isHit: true
  },
  {
    name: "Maki Mix Set",
    description: "3 types of maki: salmon, tuna, cucumber (36 pcs)",
    fullDescription: "36 pieces of classic maki: salmon maki, tuna maki, and cucumber maki.",
    price: 62,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.7,
    reviewCount: 89,
    isHit: false
  },
  {
    name: "Luxury Bento Box",
    description: "Sushi, sashimi, tempura, and more in a premium box",
    fullDescription: "Complete meal: 6 pcs sushi, 5 pcs sashimi, 4 pcs tempura, and rice. Served in a premium bento box.",
    price: 75,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "sets",
    rating: 4.8,
    reviewCount: 145,
    isHit: false
  },

  // ==================== ЗАКУСКИ / САЙДЫ (8 шт) ====================
  {
    name: "Gyoza (6pcs)",
    description: "Japanese pan-fried pork dumplings",
    fullDescription: "Crispy on the outside, juicy on the inside. Served with our signature dipping sauce.",
    price: 18,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sides",
    rating: 4.8,
    reviewCount: 156,
    isHit: true
  },
  {
    name: "Edamame",
    description: "Steamed young soybeans with sea salt",
    fullDescription: "Perfect appetizer! Steamed edamame beans sprinkled with premium sea salt.",
    price: 10,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sides",
    rating: 4.7,
    reviewCount: 98,
    isHit: false
  },
  {
    name: "Seaweed Salad",
    description: "Fresh wakame seaweed with sesame dressing",
    fullDescription: "Nutritious seaweed salad mixed with cucumber, sesame seeds, and a tangy rice vinegar dressing.",
    price: 12,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "sides",
    rating: 4.6,
    reviewCount: 67,
    isHit: false
  },
  {
    name: "Tempura Ice Cream",
    description: "Fried ice cream with red bean paste",
    fullDescription: "Vanilla ice cream wrapped in tempura batter and flash-fried. Served with sweet red bean paste.",
    price: 15,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "sides",
    rating: 4.9,
    reviewCount: 45,
    isHit: true
  },
  {
    name: "Mochi Ice Cream",
    description: "3 pcs - Strawberry, Matcha, Vanilla",
    fullDescription: "Japanese rice cake filled with ice cream. Three delicious flavors: strawberry, matcha, and vanilla.",
    price: 12,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sides",
    rating: 4.8,
    reviewCount: 56,
    isHit: false
  },
  {
    name: "Chicken Karaage",
    description: "Japanese fried chicken with lemon",
    fullDescription: "Crispy and juicy Japanese-style fried chicken, served with fresh lemon wedge and mayo.",
    price: 16,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop"],
    category: "sides",
    rating: 4.8,
    reviewCount: 134,
    isHit: false
  },
  {
    name: "Vegetable Tempura",
    description: "5 pcs assorted vegetable tempura",
    fullDescription: "Lightly battered and deep-fried vegetables: sweet potato, broccoli, zucchini, mushroom, and carrot.",
    price: 14,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&h=600&fit=crop"],
    category: "sides",
    rating: 4.7,
    reviewCount: 78,
    isHit: false
  },
  {
    name: "Shrimp Tempura",
    description: "4 pcs crispy shrimp tempura",
    fullDescription: "Large shrimp lightly battered and deep-fried to perfection. Served with tentsuyu dipping sauce.",
    price: 18,
    image: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=800&h=600&fit=crop"],
    category: "sides",
    rating: 4.9,
    reviewCount: 145,
    isHit: true
  },

  // ==================== НАПИТКИ (7 шт) ====================
  {
    name: "Japanese Sake",
    description: "Premium hot or cold sake",
    fullDescription: "Authentic Japanese sake, served hot or cold. Perfect pairing with sushi.",
    price: 25,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&h=600&fit=crop"],
    category: "drinks",
    rating: 4.7,
    reviewCount: 89,
    isHit: false
  },
  {
    name: "Ramune Soda",
    description: "Japanese marble soda - original flavor",
    fullDescription: "Classic Japanese carbonated soft drink with a unique marble seal. Original flavor.",
    price: 8,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&h=600&fit=crop"],
    category: "drinks",
    rating: 4.5,
    reviewCount: 45,
    isHit: false
  },
  {
    name: "Matcha Latte",
    description: "Premium Japanese green tea latte",
    fullDescription: "Creamy matcha latte made with ceremonial grade matcha powder and fresh milk. Hot or iced.",
    price: 15,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&h=600&fit=crop"],
    category: "drinks",
    rating: 4.8,
    reviewCount: 67,
    isHit: true
  },
  {
    name: "Calamansi Juice",
    description: "Fresh Philippine lime juice",
    fullDescription: "Refreshing calamansi juice, naturally sweet and tangy. Rich in Vitamin C.",
    price: 12,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&h=600&fit=crop"],
    category: "drinks",
    rating: 4.6,
    reviewCount: 34,
    isHit: false
  },
  {
    name: "Coca-Cola",
    description: "Classic Coca-Cola (can)",
    fullDescription: "Chilled Coca-Cola can. 330ml.",
    price: 5,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&h=600&fit=crop"],
    category: "drinks",
    rating: 4.5,
    reviewCount: 123,
    isHit: false
  },
  {
    name: "Sprite",
    description: "Classic Sprite (can)",
    fullDescription: "Chilled Sprite can. 330ml.",
    price: 5,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&h=600&fit=crop"],
    category: "drinks",
    rating: 4.5,
    reviewCount: 98,
    isHit: false
  },
  {
    name: "Bottled Water",
    description: "Pure spring water 500ml",
    fullDescription: "Refreshing natural spring water. 500ml bottle.",
    price: 3,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=300&fit=crop",
    images: ["https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800&h=600&fit=crop"],
    category: "drinks",
    rating: 4.5,
    reviewCount: 156,
    isHit: false
  }
];

async function importProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Очищаем старые товары
    await Product.deleteMany();
    console.log('🗑️ Old products cleared');
    
    // Добавляем новые
    await Product.insertMany(products);
    console.log(`✅ Imported ${products.length} products!`);
    console.log('📊 Categories:');
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
      const count = products.filter(p => p.category === cat).length;
      console.log(`   - ${cat}: ${count} items`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Import error:', error);
    process.exit(1);
  }
}

importProducts();