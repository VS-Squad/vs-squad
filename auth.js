import { auth } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  increment 
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const db = getFirestore();

// Helper function to generate random strings
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Sign Up with Email & Password
document.getElementById("signup-btn")?.addEventListener("click", async () => {
  const fullname = document.getElementById("signup-fullname").value;
  const email = document.getElementById("signup-email").value;
  const phone = document.getElementById("signup-phone").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm-password").value;
  const referralCode = document.getElementById("signup-referral")?.value || null;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Create User in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate unique referral code
    const userReferralCode = `EDU-${generateRandomString(4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Initial gamification data
    const userData = {
      fullname: fullname,
      email: email,
      phone: phone,
      uid: user.uid,
      xp: 100, // Starting bonus
      eduPoints: 100,
      level: 1,
      badges: ["welcome_badge"],
      completedQuests: [],
      activeQuests: {
        "apply_3_scholarships": {
          progress: 0,
          totalRequired: 3
        },
        "complete_first_course": {
          progress: 0,
          totalRequired: 1
        }
      },
      referralCode: userReferralCode,
      referredUsers: [],
      lastDailyCheckin: null,
      createdAt: serverTimestamp()
    };

    // If referral code was provided, validate it
    if (referralCode) {
      const referrerQuery = await db.collection("users")
        .where("referralCode", "==", referralCode)
        .limit(1)
        .get();

      if (!referrerQuery.empty) {
        const referrer = referrerQuery.docs[0];
        const referrerId = referrer.id;
        
        // Update referrer's data
        await setDoc(doc(db, "users", referrerId), {
          referredUsers: [...referrer.data().referredUsers, user.uid],
          eduPoints: increment(200) // Bonus for referring
        }, { merge: true });

        // Give bonus to new user
        userData.eduPoints += 100;
        userData.xp += 100;
      }
    }

    // Store User Data in Firestore
    await setDoc(doc(db, "users", user.uid), userData);

    alert("Signup successful! You've earned 100 bonus EduPoints!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    alert("Signup Failed: " + error.message);
  }
});

// Login with Email & Password
document.getElementById("login-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    alert("Login Failed: " + error.message);
  }
});

// Google Sign-In
document.getElementById("google-login-btn")?.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Generate unique referral code for new Google user
      const userReferralCode = `EDU-${generateRandomString(4)}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Initial gamification data for Google signup
      const userData = {
        fullname: user.displayName || "Google User",
        email: user.email,
        phone: user.phoneNumber || "Not provided",
        uid: user.uid,
        xp: 100, // Starting bonus
        eduPoints: 100,
        level: 1,
        badges: ["welcome_badge", "google_user"],
        completedQuests: [],
        activeQuests: {
          "apply_3_scholarships": {
            progress: 0,
            totalRequired: 3
          },
          "complete_first_course": {
            progress: 0,
            totalRequired: 1
          }
        },
        referralCode: userReferralCode,
        referredUsers: [],
        lastDailyCheckin: null,
        createdAt: serverTimestamp()
      };

      await setDoc(userRef, userData);
    }

    alert("Google Login Successful!");
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } catch (error) {
    alert("Google Login Failed: " + error.message);
  }
});

// Logout Function



// Monitor Auth State
export const monitorAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Logout Function


// ... (keep all your existing imports and other functions)

// Logout Function (only keep this one)
export const logout = async () => {
  try {
    await signOut(auth);
    window.location.href = "main.html"; // Redirect to home page after logout
  } catch (error) {
    console.error("Logout error:", error);
    alert("Logout Failed: " + error.message);
  }
};

// Remove these duplicate logout functions:
// 1. The one with document.getElementById("logout-btn")?.addEventListener
// 2. The one with document.getElementById('logoutBtn').addEventListener