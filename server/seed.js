/**
 * Run with:  node server/seed.js
 * Seeds the restaurants collection with initial mock data.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env") });

import Restaurant from "./models/Restaurant.js";

const seed = [
    {
        name: "Spice Garden", cuisine: "North Indian", address: "12, MG Road, Bengaluru", city: "Bengaluru",
        image: "🍛", priceForTwo: 600, tag: "Trending", tagColor: "#E8360A",
        worthItScore: 87, googleRating: 4.4, socialBuzz: 82, communityReviews: 91, rating: 4.5,
        topDishes: [
            { name: "Butter Chicken", price: 280, score: 92, emoji: "🍗" },
            { name: "Dal Makhani", price: 180, score: 88, emoji: "🍲" },
            { name: "Garlic Naan", price: 60, score: 85, emoji: "🫓" },
            { name: "Paneer Tikka", price: 260, score: 83, emoji: "🧆" },
        ],
    },
    {
        name: "Mumbai Tiffin House", cuisine: "Street Food", address: "5, FC Road, Pune", city: "Pune",
        image: "🥙", priceForTwo: 300, tag: "Best Value", tagColor: "#2EC4B6",
        worthItScore: 93, googleRating: 4.6, socialBuzz: 95, communityReviews: 89, rating: 4.7,
        topDishes: [
            { name: "Vada Pav", price: 30, score: 97, emoji: "🥪" },
            { name: "Pav Bhaji", price: 80, score: 94, emoji: "🍞" },
            { name: "Misal Pav", price: 90, score: 91, emoji: "🥘" },
            { name: "Bhel Puri", price: 50, score: 88, emoji: "🥗" },
        ],
    },
    {
        name: "The Biryani Co.", cuisine: "Hyderabadi", address: "88, Banjara Hills, Hyderabad", city: "Hyderabad",
        image: "🍚", priceForTwo: 800, tag: "Popular", tagColor: "#FF9F1C",
        worthItScore: 79, googleRating: 4.2, socialBuzz: 76, communityReviews: 81, rating: 4.3,
        topDishes: [
            { name: "Chicken Biryani", price: 350, score: 85, emoji: "🍚" },
            { name: "Mutton Biryani", price: 450, score: 82, emoji: "🥩" },
            { name: "Raita", price: 50, score: 70, emoji: "🥣" },
            { name: "Haleem", price: 200, score: 78, emoji: "🍜" },
        ],
    },
    {
        name: "South Spice Kitchen", cuisine: "South Indian", address: "3, Anna Nagar, Chennai", city: "Chennai",
        image: "🥞", priceForTwo: 400, tag: "Editor's Pick", tagColor: "#a855f7",
        worthItScore: 90, googleRating: 4.5, socialBuzz: 88, communityReviews: 93, rating: 4.6,
        topDishes: [
            { name: "Masala Dosa", price: 80, score: 95, emoji: "🥞" },
            { name: "Idli Sambar", price: 60, score: 92, emoji: "🍥" },
            { name: "Filter Coffee", price: 30, score: 96, emoji: "☕" },
            { name: "Medu Vada", price: 50, score: 89, emoji: "🍩" },
        ],
    },
    {
        name: "Chaat Corner", cuisine: "Chaat & Snacks", address: "7, Connaught Place, Delhi", city: "Delhi",
        image: "🥗", priceForTwo: 200, tag: "🔥 Hot", tagColor: "#E8360A",
        worthItScore: 95, googleRating: 4.7, socialBuzz: 96, communityReviews: 94, rating: 4.8,
        topDishes: [
            { name: "Golgappa", price: 40, score: 98, emoji: "🫙" },
            { name: "Dahi Bhalla", price: 60, score: 95, emoji: "🍦" },
            { name: "Aloo Tikki", price: 50, score: 93, emoji: "🥔" },
            { name: "Raj Kachori", price: 70, score: 91, emoji: "🥗" },
        ],
    },
    {
        name: "Dragon Wok", cuisine: "Chinese", address: "22, Park Street, Kolkata", city: "Kolkata",
        image: "🍜", priceForTwo: 700, tag: "New", tagColor: "#2EC4B6",
        worthItScore: 82, googleRating: 4.1, socialBuzz: 80, communityReviews: 74, rating: 4.2,
        topDishes: [
            { name: "Dim Sum", price: 180, score: 88, emoji: "🥟" },
            { name: "Fried Rice", price: 220, score: 84, emoji: "🍚" },
            { name: "Manchurian", price: 200, score: 86, emoji: "🍢" },
            { name: "Hot & Sour Soup", price: 140, score: 80, emoji: "🍲" },
        ],
    },
    {
        name: "The Continental Table", cuisine: "Continental", address: "15, Lavelle Road, Bengaluru", city: "Bengaluru",
        image: "🥩", priceForTwo: 1400, tag: "Fine Dine", tagColor: "#a855f7",
        worthItScore: 76, googleRating: 4.3, socialBuzz: 70, communityReviews: 65, rating: 4.3,
        topDishes: [
            { name: "Grilled Chicken", price: 480, score: 82, emoji: "🍗" },
            { name: "Pasta Arrabiata", price: 360, score: 79, emoji: "🍝" },
            { name: "Tiramisu", price: 220, score: 88, emoji: "🍮" },
            { name: "Caesar Salad", price: 280, score: 74, emoji: "🥗" },
        ],
    },
    {
        name: "Rolls & Wraps", cuisine: "Street Food", address: "9, Brigade Road, Bengaluru", city: "Bengaluru",
        image: "🌯", priceForTwo: 250, tag: "Quick Bite", tagColor: "#FF9F1C",
        worthItScore: 88, googleRating: 4.4, socialBuzz: 90, communityReviews: 86, rating: 4.5,
        topDishes: [
            { name: "Egg Roll", price: 60, score: 94, emoji: "🌯" },
            { name: "Paneer Roll", price: 80, score: 91, emoji: "🌯" },
            { name: "Chicken Shawarma", price: 100, score: 89, emoji: "🥙" },
            { name: "Fries", price: 50, score: 85, emoji: "🍟" },
        ],
    },
];

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Restaurant.deleteMany({});
    const inserted = await Restaurant.insertMany(seed);
    console.log(`✅  Seeded ${inserted.length} restaurants`);

    await mongoose.disconnect();
    console.log("Done.");
}

run().catch((err) => { console.error(err); process.exit(1); });
