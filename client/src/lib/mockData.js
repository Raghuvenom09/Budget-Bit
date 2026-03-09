export const restaurants = [
    {
        id: 1, name: "Spice Garden", cuisine: "North Indian", distance: 0.8,
        rating: 4.5, worthItScore: 87, priceForTwo: 600, image: "🍛",
        tag: "Trending", tagColor: "#E8360A",
        address: "12, MG Road, Bengaluru",
        googleRating: 4.4, socialBuzz: 82, communityReviews: 91,
        topDishes: [
            { name: "Butter Chicken", price: 280, score: 92, emoji: "🍗" },
            { name: "Dal Makhani", price: 180, score: 88, emoji: "🍲" },
            { name: "Garlic Naan", price: 60, score: 85, emoji: "🫓" },
            { name: "Paneer Tikka", price: 260, score: 83, emoji: "🧆" },
        ],
    },
    {
        id: 2, name: "Mumbai Tiffin House", cuisine: "Street Food", distance: 1.2,
        rating: 4.7, worthItScore: 93, priceForTwo: 300, image: "🥙",
        tag: "Best Value", tagColor: "#2EC4B6",
        address: "5, FC Road, Pune",
        googleRating: 4.6, socialBuzz: 95, communityReviews: 89,
        topDishes: [
            { name: "Vada Pav", price: 30, score: 97, emoji: "🥪" },
            { name: "Pav Bhaji", price: 80, score: 94, emoji: "🍞" },
            { name: "Misal Pav", price: 90, score: 91, emoji: "🥘" },
            { name: "Bhel Puri", price: 50, score: 88, emoji: "🥗" },
        ],
    },
    {
        id: 3, name: "The Biryani Co.", cuisine: "Hyderabadi", distance: 2.1,
        rating: 4.3, worthItScore: 79, priceForTwo: 800, image: "🍚",
        tag: "Popular", tagColor: "#FF9F1C",
        address: "88, Banjara Hills, Hyderabad",
        googleRating: 4.2, socialBuzz: 76, communityReviews: 81,
        topDishes: [
            { name: "Chicken Biryani", price: 350, score: 85, emoji: "🍚" },
            { name: "Mutton Biryani", price: 450, score: 82, emoji: "🥩" },
            { name: "Raita", price: 50, score: 70, emoji: "🥣" },
            { name: "Haleem", price: 200, score: 78, emoji: "🍜" },
        ],
    },
    {
        id: 4, name: "South Spice Kitchen", cuisine: "South Indian", distance: 0.5,
        rating: 4.6, worthItScore: 90, priceForTwo: 400, image: "🥞",
        tag: "Editor's Pick", tagColor: "#a855f7",
        address: "3, Anna Nagar, Chennai",
        googleRating: 4.5, socialBuzz: 88, communityReviews: 93,
        topDishes: [
            { name: "Masala Dosa", price: 80, score: 95, emoji: "🥞" },
            { name: "Idli Sambar", price: 60, score: 92, emoji: "🍥" },
            { name: "Filter Coffee", price: 30, score: 96, emoji: "☕" },
            { name: "Medu Vada", price: 50, score: 89, emoji: "🍩" },
        ],
    },
    {
        id: 5, name: "Chaat Corner", cuisine: "Chaat & Snacks", distance: 0.3,
        rating: 4.8, worthItScore: 95, priceForTwo: 200, image: "🥗",
        tag: "🔥 Hot", tagColor: "#E8360A",
        address: "7, Connaught Place, Delhi",
        googleRating: 4.7, socialBuzz: 96, communityReviews: 94,
        topDishes: [
            { name: "Golgappa", price: 40, score: 98, emoji: "🫙" },
            { name: "Dahi Bhalla", price: 60, score: 95, emoji: "🍦" },
            { name: "Aloo Tikki", price: 50, score: 93, emoji: "🥔" },
            { name: "Raj Kachori", price: 70, score: 91, emoji: "🥗" },
        ],
    },
];

export const topDishFeed = [
    { dish: "Masala Dosa", restaurant: "South Spice Kitchen", price: 80, score: 95, emoji: "🥞", cuisine: "South Indian" },
    { dish: "Vada Pav", restaurant: "Mumbai Tiffin House", price: 30, score: 97, emoji: "🥪", cuisine: "Street Food" },
    { dish: "Butter Chicken", restaurant: "Spice Garden", price: 280, score: 92, emoji: "🍗", cuisine: "North Indian" },
    { dish: "Golgappa", restaurant: "Chaat Corner", price: 40, score: 98, emoji: "🫙", cuisine: "Chaat" },
    { dish: "Chicken Biryani", restaurant: "The Biryani Co.", price: 350, score: 85, emoji: "🍚", cuisine: "Hyderabadi" },
    { dish: "Filter Coffee", restaurant: "South Spice Kitchen", price: 30, score: 96, emoji: "☕", cuisine: "South Indian" },
];

export const pastBills = [
    { id: 1, restaurant: "Spice Garden", date: "24 Feb 2026", amount: 680, dishes: ["Butter Chicken", "Garlic Naan", "Dal Makhani"], avgRating: 4.2, saved: 120 },
    { id: 2, restaurant: "Mumbai Tiffin House", date: "19 Feb 2026", amount: 210, dishes: ["Vada Pav", "Pav Bhaji", "Bhel Puri"], avgRating: 4.8, saved: 0 },
    { id: 3, restaurant: "The Biryani Co.", date: "12 Feb 2026", amount: 900, dishes: ["Chicken Biryani", "Mutton Biryani", "Raita"], avgRating: 3.9, saved: 250 },
    { id: 4, restaurant: "South Spice Kitchen", date: "5 Feb 2026", amount: 350, dishes: ["Masala Dosa", "Filter Coffee", "Idli Sambar"], avgRating: 4.9, saved: 0 },
];

export const cuisines = ["All", "North Indian", "South Indian", "Street Food", "Hyderabadi", "Chaat & Snacks", "Chinese", "Continental"];
