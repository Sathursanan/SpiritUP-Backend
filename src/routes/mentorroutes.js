// import { Router } from 'express';
// import mentorcontroller from '../controllers/mentorcontroller.js';
// import { authmiddleware, requireMentor } from '../middlewares/authmiddleware.js';

// const router = Router();

// router.use(authmiddleware, requireMentor);

// router.get('/profile', mentorcontroller.getProfile);
// router.put('/profile', mentorcontroller.updateProfile);
// router.post('/sessions', mentorcontroller.createSession);
// router.get('/sessions', mentorcontroller.mySessions);
// router.get('/bookings', mentorcontroller.myBookings);






// import { Router } from "express";
// import mentorcontroller from "../controllers/mentorcontroller.js";
// import { authmiddleware, requireMentor } from "../middlewares/authmiddleware.js";

// const router = Router();

// // 🔍 Debug: log every request that hits this router
// router.use((req, res, next) => {
//   console.log("➡️ Mentor router hit:", req.method, req.url);
//   next();
// });

// // All mentor routes require auth + mentor role
// router.use(authmiddleware, requireMentor);

// router.get("/profile", mentorcontroller.getProfile);
// router.put("/profile", mentorcontroller.updateProfile);

// router.post("/sessions", mentorcontroller.createSession);
// router.get("/sessions", mentorcontroller.mySessions);

// // ✅ DELETE route
// router.delete("/sessions/:id", mentorcontroller.deleteSession);

// router.get("/bookings", mentorcontroller.myBookings);

// export default router;



// src/routes/mentorroutes.js (or similar)
import { Router } from "express";
import mentorcontroller from "../controllers/mentorcontroller.js";
import { authmiddleware, requireMentor } from "../middlewares/authmiddleware.js";
import requireApprovedMentor from "../middlewares/requireApprovedMentor.js";

const router = Router();

// 🔍 Debug: log every request that hits this router
router.use((req, res, next) => {
  console.log("➡️ Mentor router hit:", req.method, req.url);
  next();
});

// All mentor routes require:
// 1) logged in (authmiddleware)
// 2) user.role === 'MENTOR' (requireMentor)
// 3) MentorProfile.status === APPROVED (requireApprovedMentor)
router.use(authmiddleware, requireMentor, requireApprovedMentor);

router.get("/profile", mentorcontroller.getProfile);
router.put("/profile", mentorcontroller.updateProfile);

router.post("/sessions", mentorcontroller.createSession);
router.get("/sessions", mentorcontroller.mySessions);

// ✅ DELETE route
router.delete("/sessions/:id", mentorcontroller.deleteSession);

router.get("/bookings", mentorcontroller.myBookings);

export default router;