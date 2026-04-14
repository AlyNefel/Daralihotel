import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/lib/db.ts";
import roomRoutes from "./src/routes/roomRoutes.ts";
import bookingRoutes from "./src/routes/bookingRoutes.ts";
import authRoutes from "./src/routes/authRoutes.ts";
import Room from "./src/models/Room.ts";

dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  // Seed Rooms if empty
  const roomCount = await Room.countDocuments();
  if (roomCount === 0) {
    const rooms = [
      {
        name: 'Royal Suite',
        type: 'suite',
        price: 750,
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000'],
        capacity: 2,
        amenities: ['Private Pool', 'Ocean View', 'Butler Service'],
        description: 'Experience the pinnacle of luxury in our Royal Suite. Featuring a private pool, panoramic ocean views, and dedicated butler service, this suite offers an unparalleled stay for those who demand the very best.',
        status: 'available'
      },
      {
        name: 'Deluxe Garden Room',
        type: 'deluxe',
        price: 450,
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000'],
        capacity: 2,
        amenities: ['Garden View', 'King Bed', 'Rain Shower'],
        description: 'Our Deluxe Garden Room provides a serene escape surrounded by lush greenery. Relax in a king-sized bed and enjoy the tranquility of your private garden view, complemented by a luxurious rain shower.',
        status: 'available'
      },
      {
        name: 'Executive Double',
        type: 'standard',
        price: 280,
        images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000'],
        capacity: 2,
        amenities: ['Work Desk', 'City View', 'Mini Bar'],
        description: 'Perfect for business or leisure, the Executive Double room combines functionality with elegance. Enjoy a well-appointed workspace, stunning city views, and a fully stocked mini-bar for your convenience.',
        status: 'available'
      }
    ];
    await Room.insertMany(rooms);
    console.log('Rooms seeded');
  }

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Dar Ali API is running" });
  });

  app.use("/api/rooms", roomRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/auth", authRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
