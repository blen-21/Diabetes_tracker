// jshint esversion:6
require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const apikey = process.env.API_KEY;
const ejs = require("ejs");
const { User, SugarLog, ExerciseLog, MedicationLog } = require('./mongodb');
const session = require("express-session");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const saltRounds = 10;
const axios = require('axios');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

app.use(session({
    secret: 'aS3cUrE@!k3Y$!forSession1234$%#&',    //to generate a cryptographic hash (HMAC) for the session ID
    resave: false,     //the session is only saved if it has been modified.
    saveUninitialized: true,           //new but unmodified sessions will still be saved in the session store.
    cookie: { 
        maxAge: 4 * 60 * 60 * 1000  // Set session expiration time to 4 hours (in milliseconds)
    }
}));

// Route to render the home page
app.get("/", (req, res) => {
    res.render("home");
});
app.get("/home", (req, res) => {
    res.render("home");
});

// Route to render the signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Route to render the login page
app.get("/login", (req, res) => {
    res.render("login");
});

// Route to render the diabetes page
app.get("/diabetes", (req, res) => {
    res.render("diabetes");
});

// Route to render the contact page
app.get("/contact", (req, res) => {
    res.render("contact");
});
app.get("/about", (req,res) =>{
    res.render("about");
});
// Route to render the form page
app.get("/form", (req, res) => {
    const username = req.session.user.name;
    res.render("form", { username: username });
});
// Route to render the medication page
app.get("/medication", (req,res) =>{
    res.render("medication");
});
//Route to render the sugar log page
app.get("/log", (req,res) =>{
    res.render("log");
});
//Route to render the nutrition page
app.get('/nutrition', (req,res) =>{
    res.render('nutrition');
});
//Route to render the exercise log page
app.get('/exercise', (req,res) =>{
    res.render('exercise');
});
//Route to render the faq page
app.get("/faq", (req, res) => {
    const faqData = [
        {
            question: "What is diabetes?",
            answer: "Diabetes is a chronic condition that affects how your body turns food into energy."
        },
        {
            question: "What are the different types of diabetes?",
            answer: "The main types of diabetes are Type 1, Type 2, and gestational diabetes."
        },
        {
            question: "What are the symptoms of diabetes?",
            answer: "Common symptoms include frequent urination, increased thirst, extreme fatigue, and blurred vision."
        },
        {
            question: "How is diabetes managed?",
            answer: "Diabetes can be managed through medication, insulin therapy, a healthy diet, and regular physical activity."
        },
        {
            question: "What are the complications of untreated diabetes?",
            answer: "Untreated diabetes can lead to complications like heart disease, kidney failure, and nerve damage."
        },
        {
            question: "What causes Type 1 diabetes?",
            answer: "Type 1 diabetes is caused by an autoimmune reaction that destroys insulin-producing cells in the pancreas."
        },
        {
            question: "What causes Type 2 diabetes?",
            answer: "Type 2 diabetes is primarily caused by insulin resistance and is often associated with obesity and a sedentary lifestyle."
        },
        {
            question: "What is gestational diabetes?",
            answer: "Gestational diabetes is a type of diabetes that occurs during pregnancy and usually disappears after childbirth, but increases the risk of developing Type 2 diabetes later."
        },
        {
            question: "How can I prevent Type 2 diabetes?",
            answer: "Preventing Type 2 diabetes involves maintaining a healthy weight, eating a balanced diet, staying physically active, and avoiding smoking."
        },
        {
            question: "Can diabetes be cured?",
            answer: "Currently, there is no cure for diabetes, but it can be effectively managed with lifestyle changes, medication, and regular monitoring."
        },
        {
            question: "What is a normal blood sugar level?",
            answer: "A normal blood sugar level varies depending on when you last ate, but typically ranges from 70-130 mg/dL before meals and less than 180 mg/dL after meals."
        },
        {
            question: "What should I do if my blood sugar is too high?",
            answer: "If your blood sugar is too high, you should follow your healthcare provider's advice, which may include adjusting medication, increasing physical activity, and modifying your diet."
        },
        {
            question: "Can I drink alcohol if I have diabetes?",
            answer: "Alcohol can affect blood sugar levels, so it’s important to drink in moderation and monitor your blood sugar levels closely."
        },
        {
            question: "How often should I check my blood sugar levels?",
            answer: "The frequency of blood sugar monitoring depends on your treatment plan and individual needs, but it’s generally recommended to check regularly, especially if you’re on insulin or other medications."
        },
        {
            question: "What is an HbA1c test?",
            answer: "An HbA1c test measures your average blood sugar level over the past 2-3 months and is used to assess how well your diabetes is being managed."
        },
        {
            question: "What is diabetic ketoacidosis (DKA)?",
            answer: "Diabetic ketoacidosis (DKA) is a serious complication of diabetes that occurs when the body starts breaking down fat at an excessive rate, leading to a buildup of ketones in the blood."
        },
        {
            question: "What are the long-term effects of diabetes?",
            answer: "Long-term effects of diabetes can include cardiovascular disease, nerve damage, kidney damage, eye damage, and increased risk of infections."
        },
        {
            question: "How does exercise affect blood sugar levels?",
            answer: "Exercise can help lower blood sugar levels by increasing insulin sensitivity and allowing cells to use glucose for energy more effectively."
        },
        {
            question: "What should I eat if I have diabetes?",
            answer: "A balanced diet with plenty of vegetables, whole grains, lean protein, and healthy fats is important. Focus on controlling carbohydrate intake and avoiding sugary foods."
        },
        {
            question: "Can stress affect my blood sugar levels?",
            answer: "Yes, stress can raise blood sugar levels by causing the body to release hormones like cortisol, which can interfere with insulin."
        },
        {
            question: "What is insulin resistance?",
            answer: "Insulin resistance occurs when the body's cells do not respond properly to insulin, making it harder for glucose to enter the cells, which can lead to elevated blood sugar levels."
        },
        {
            question: "What is hypoglycemia?",
            answer: "Hypoglycemia, or low blood sugar, occurs when your blood glucose drops below 70 mg/dL. It can cause symptoms like shakiness, sweating, confusion, and dizziness."
        },
        {
            question: "How do I treat hypoglycemia?",
            answer: "To treat hypoglycemia, consume fast-acting carbohydrates, such as glucose tablets, fruit juice, or regular soda, then check your blood sugar again after 15 minutes."
        },
        {
            question: "Can children develop diabetes?",
            answer: "Yes, children can develop both Type 1 and Type 2 diabetes. Type 1 diabetes is more common in children, but Type 2 diabetes has been increasing in children due to rising obesity rates."
        },
        {
            question: "Can I have diabetes without knowing it?",
            answer: "Yes, many people with Type 2 diabetes may not have obvious symptoms, which is why regular screenings, especially if you're at risk, are important."
        },
        {
            question: "How is gestational diabetes diagnosed?",
            answer: "Gestational diabetes is diagnosed through a glucose tolerance test during pregnancy, which measures how well your body processes sugar."
        },
        {
            question: "Can people with diabetes eat fruit?",
            answer: "Yes, people with diabetes can eat fruit, but they should be mindful of portion sizes and the carbohydrate content in fruits, which can affect blood sugar."
        },
        {
            question: "How do oral diabetes medications work?",
            answer: "Oral diabetes medications help manage blood sugar levels in different ways, such as increasing insulin sensitivity, boosting insulin production, or slowing the absorption of carbohydrates."
        },
        {
            question: "What is the difference between Type 1 and Type 2 diabetes?",
            answer: "In Type 1 diabetes, the body does not produce insulin, whereas in Type 2 diabetes, the body either doesn’t produce enough insulin or can’t use it effectively."
        },
        {
            question: "Is it safe for someone with diabetes to fast?",
            answer: "If you have diabetes and plan to fast, it’s important to consult with your healthcare provider, as fasting can cause blood sugar fluctuations that may require adjustments to your medication."
        },
        {
            question: "What is prediabetes?",
            answer: "Prediabetes is a condition where blood sugar levels are higher than normal but not high enough to be classified as Type 2 diabetes. It increases the risk of developing Type 2 diabetes."
        },
        {
            question: "How does weight loss affect diabetes?",
            answer: "Losing weight can help improve insulin sensitivity, lower blood sugar levels, and reduce the risk of developing Type 2 diabetes."
        },
        {
            question: "What should I do if I have a sick day with diabetes?",
            answer: "If you're sick and have diabetes, monitor your blood sugar more frequently, stay hydrated, and follow your healthcare provider's instructions for managing blood sugar during illness."
        },
        {
            question: "Can diabetes affect mental health?",
            answer: "Yes, diabetes can affect mental health, causing stress, anxiety, or depression. Managing a chronic condition can be challenging, and it’s important to seek support if needed."
        },
        {
            question: "What is the best way to monitor my diabetes?",
            answer: "The best way to monitor your diabetes includes regular blood sugar checks, HbA1c tests, and tracking your diet, exercise, and any symptoms. Working closely with your healthcare provider is key."
        }
    ]; 
    res.render("faq", { faqData: faqData });
});
app.get('/chat', (req,res) =>{
    res.render('chat');
});
//Route to render the profile page
app.get('/profile', async (req, res) => {
    try {
        const user = await User.findOne({ name: req.query.username });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        const userId = user._id;
        const aggregatedData = await aggregateDailyData(userId);

        // Get the latest blood sugar (sugarLevel) reading for the user
        const readings = user.readings || [];
        
        // Check if there are any readings
        let recentSugarLevel = null;
        let readingDate = null;

        if (readings.length > 0) {
            // Sort readings in descending order by date
            readings.sort((a, b) => new Date(b.date) - new Date(a.date));
            recentSugarLevel = readings[0].sugarLevel;  // Get the latest sugar level
            readingDate = readings[0].date;  // Get the latest reading date
        }

        // Log aggregated and blood sugar data to confirm they have values
        console.log("Aggregated Data:", aggregatedData);
        console.log("Recent Sugar Level:", recentSugarLevel);

        res.render('profile', {
            username: user.name,
            fname: user.fname,
            lname: user.lname,
            age: user.age,
            gender: user.gender,
            diseases: user.diseases || [],
            aggregatedData: aggregatedData,
            recentSugarLevel: recentSugarLevel,
            readingDate: readingDate,
            userId: userId.toString()
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred.');
    }
});




app.get('/submit-form', (req, res) => {
    res.redirect(`/form?username=${req.session.user.name}`);
});

app.get("/logout", (req, res) => {
    //  destroying the session
    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/profile");
        }
        // Clear the cookie
        res.clearCookie("connect.sid");
        
        // Redirect to the home page after logging out
        res.redirect("/home");
    });
});
app.post("/signup", async (req, res) => {
    try {
        const { name, password, confirmPassword } = req.body;

        // Checking if the user already exists
        const existingUser = await User.findOne({ name: name });
        if (existingUser) {
            return res.render("signup", { error: "Username already taken, please choose another one." });
        }

        // Checking if passwords match
        if (password !== confirmPassword) {
            return res.render("signup", { error: "Passwords do not match. Please try again." });
        }

        // Password validation: At least 8 characters, containing both letters and numbers
        // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        // if (!passwordRegex.test(password)) {
        //     return res.render("signup", { error: "Password must be at least 8 characters long and contain both letters and numbers." });
        // }

        // Hashing the password
        const saltRounds = 10; // Define saltRounds
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Creating a new user document
        const newUser = new User({

            name: name,
            password: hashedPassword
        });

        // Saving the new user to the database
        await newUser.save();

        // Storing user data in the session (automatic login)
        req.session.user = {
            userId: newUser._id,
            name: newUser.name,
        };

    if(newUser){
        req.session.userId = newUser._id,
        console.log('User logged in with ID:', req.session.userId);
    }
  


         
      if(newUser){
        req.session.userId = newUser._id,
        console.log('User logged in with ID:', req.session.userId);
    }


        // Redirecting to the form page after signup
        res.redirect(`/form`);

    } catch (error) {
        console.log(error);
        res.render("signup", { error: "An error occurred during signup. Please try again." });
    }
});

// Handling login form submission
app.post("/login", async (req, res) => {
    try {
        // Finding the user by name
        const user = await User.findOne({ name: req.body.name });
        
        if (user) {
            // Comparing the entered password with the hashed password in the database
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            
            if (isMatch) {
                //storing the data in to the session
                
                    req.session.userId = user._id,
                    req.session.name = user.name,
                    req.session.email = user.email,
                    req.session.fname = user.email,
                    req.session.lname = user.lname
                    console.log('User logged in with ID:', req.session.userId);

                
                // If Passwords match, redirecting to the profile page
                res.redirect(`/profile?username=${user.name}`);
            } else {
                // If Passwords do not match
                res.render("login", { error: "Incorrect password. Please try again." });
            }
        } else {
            // If User not found
            res.render("login", { error: "User not found. Please check your username." });
        }
    } catch (error) {
        console.log(error);
        res.render("login", { error: "An error occurred during login. Please try again." });
    }
});
app.post("/submit-form", async (req, res) => {
    try {
        const { fname, lname, diseases, age, gender,type,weight } = req.body;
        const username = req.session.user.name; 

        // Finding the user by their username
        const user = await User.findOne({ name: username });

        if (!user) {
            return res.render("form", { error: "User not found. Please sign up first." });
        }

        // Updating the user's document with the additional information
        user.fname = fname;
        user.lname = lname;
        user.diseases = diseases || []; // Default to an empty array if no diseases are selected
        user.age = age;
        user.gender = gender;
        user.type = type;
        user.weight = weight;
        // Saving the updated document
        await user.save();

                // Storing the additional data in the session
                req.session.user.fname = fname;
                req.session.user.lname = lname;
                req.session.user.diseases = diseases;
                req.session.user.age = age;
                req.session.user.gender = gender;
            
        // Redirecting to the profile page
        res.redirect(`/profile?username=${user.name}`);
    } catch (error) {
        console.log(error);
        res.render("form", { error: "An error occurred while submitting the form. Please try again." });
    }
});

//delete-account

app.post('/delete', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Unauthorized, please login again'); // Redirect to login if not authenticated
    }

    try {
        const userId = req.session.userId;

        // Delete all sugar logs related to the user
        await SugarLog.deleteMany({ user: userId });

        // Delete all exercise logs related to the user
        await ExerciseLog.deleteMany({ user: userId });

        // Delete the user's account
        await User.findByIdAndDelete(userId);

        // Clear session and redirect
        req.session.destroy(() => {
            res.render('messages', {messages: {success: 'Account successfully deleted'} }); // Redirect to confirmation page
        });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.render('messages', { messages: { error: 'Failed to delete account'} })
    }
});



//edit profile
app.post('/edit-profile', async (req, res) => {
    // Check if the user is logged in (i.e., user ID exists in session)
    if (!req.session.userId) {
        res.render('messages', { messages: { error: 'Unauthorized, please login'} })
    }

    const { fname, lname, age, gender } = req.body;
    console.log("Profile data:", req.body);
    console.log("Session user ID:", req.session.userId); // Log user ID

    const updateFields = {};
    if (fname) updateFields.fname = fname;
    if (lname) updateFields.lname = lname;
    if (age) updateFields.age = age;
    if (gender) updateFields.gender = gender;

    try {
        const userId = req.session.userId;
        const result = await User.findByIdAndUpdate(userId, updateFields, { new: true });
        
        if (result) {
            res.render('messages', { messages: { success: 'Profile updated successfully'} })
        } else {
            console.log("User not found with ID:", userId); // Log if user not found
            res.render('messages', { messages: { error: 'User not found'} })
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        res.render('messages', { messages: { error: 'An error occurred while updating the profile'} })
    }
});

// POST route to log sugar levels
app.post('/log-sugar', async (req, res) => {
    console.log("req.session",req.session)
    console.log("req.bodu",req.body)
    try {
        // Check if the user is logged in (i.e., user ID exists in session)
        if (!req.session.userId) {
            res.render('messages', { messages: { error: 'Unauthorized, please login'} })
        }

        const userId = req.session.userId;  // Get user ID from session

        // Capture data from req.body
        const { sugarLevel, timeOfDay, notes } = req.body;

        // Create a new SugarLog entry
        const sugarLog = new SugarLog({
            sugarLevel,
            timeOfDay,
            notes,
            user: userId  // Linking the sugar log to the user
        });

        await sugarLog.save();

        // Updating the user with the new sugar log
        const user = await User.findById(userId);
        user.sugarLogs.push(sugarLog._id);
        await user.save();

        res.redirect(`/profile?username=${user.name}`); // Redirect to user's profile page
    } catch (err) {
        console.error('Error saving sugar log:', err);
        res.render('messages', { messages: { error: 'Server Error'} })
    }
});

//post route to log daily exercise 
app.post('/exercise-log', async (req, res) => {
    try {
        // Check if the user is logged in (i.e., user ID exists in session)
        if (!req.session.userId) {
            res.render('messages', { messages: { error: 'Unauthorized, please login'} })
        }

        const userId = req.session.userId;  // Get user ID from session

        // Capture data from req.body
        const { typeOfExercise, duration, caloriesBurned } = req.body;

        // Create a new Exercise Log entry
        const exerciseLog = new ExerciseLog({
            typeOfExercise,
            duration,
            caloriesBurned,
            dateCollected: new Date(),
            user: userId  // Linking the exercise log to the user
        });

        await exerciseLog.save();

        // Updating the user with the new Exercise log
        const user = await User.findById(userId);
        user.exerciseLogs.push(exerciseLog._id);
        await user.save();

        res.redirect(`/profile?username=${user.name}`); // Redirect to user's profile page
    } catch (err) {
        console.error('Error saving exercise log:', err);
        res.render('messages', { messages: { error: 'Server Error'} })
    }
});

//post route to log daily medication 
app.post('/medication-log', async (req, res) => {
    try {
        // Check if the user is logged in (i.e., user ID exists in session)
        if (!req.session.userId) {
            res.render('messages', { messages: { error: 'Unauthorized, please login'} })
        }

        const userId = req.session.userId;  // Get user ID from session

        // Capture data from req.body
        const { medName, frequency, time } = req.body;

        // Create a new Medication Log entry
        const medicationLog = new MedicationLog({
            medName,
            time,
            frequency,
            user: userId  // Linking the medication log to the user
        });

        await medicationLog.save();

        // Updating the user with the new log
        const user = await User.findById(userId);
        user.medicationLogs.push(medicationLog._id);
        await user.save();

        res.redirect(`/profile?username=${user.name}`); // Redirect to user's profile page
    } catch (err) {
        console.error('Error saving the new medication:', err);
        res.render('messages', { messages: { error: 'Server Error'} })
    }
});

const aggregateDailyData = async (userId) => {
    try {
        console.log("Starting aggregation for userId:", userId)
        // Aggregating sugar log data
        const data = await SugarLog.aggregate([
            {
                $match: { user: userId } // Match by `user` field in SugarLog
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Group by date
                    averageSugarLevel: { $avg: "$sugarLevel" }
                }
            }
        ]);
        console.log("Sugar log aggregation result:", data);

        // Aggregating exercise log data
        const exerciseData = await ExerciseLog.aggregate([
            {
                $match: { user: userId } // Match by `user` field in ExerciseLog
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateCollected" } }, // Group by date
                    totalCaloriesBurned: { $sum: "$caloriesBurned" }
                }
            }
        ]);
        console.log("Exercise log aggregation result:", exerciseData);

        // Handle cases where either data set is empty
        if (data.length === 0 && exerciseData.length === 0) {
            console.log("No data available for the given userId.");
            return []; // Return an empty array if both are empty
        }

        // Combine results
        const combinedData = data.map((sugarLog) => {
            const exerciseLog = exerciseData.find(log => log._id === sugarLog._id) || { totalCaloriesBurned: 0 };
            return {
                date: sugarLog._id,
                averageSugarLevel: sugarLog.averageSugarLevel,
                totalCaloriesBurned: exerciseLog.totalCaloriesBurned
            };
        });

        // Handle cases where only exercise data is present
        if (exerciseData.length > 0 && combinedData.length === 0) {
            // If no sugar log data exists, create combined entries based on exercise data
            return exerciseData.map(exerciseLog => ({
                date: exerciseLog._id,
                averageSugarLevel: null, // No sugar log data
                totalCaloriesBurned: exerciseLog.totalCaloriesBurned
            }));
        }

        console.log("Combined aggregation result:", combinedData);
        return combinedData;
    } catch (error) {
        console.error("Aggregation error:", error);
        throw error;
    }
};


app.get('/user/:userId/aggregate', async (req, res) => {
    const userId = req.params.userId; 
    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log("Received request to /user/:userId/aggregate for userId:", userId);
    try {
        const data = await SugarLog.aggregate([
            {
                $match: { user:userObjectId } // Match by `user` field in SugarLog
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Group by date
                    averageSugarLevel: { $avg: "$sugarLevel" }
                }
            }
        ]);
        console.log("Sugar log aggregation result:", data);
        const exerciseData = await ExerciseLog.aggregate([
            {
                $match: { user: userObjectId } // Match by `user` field in ExerciseLog
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateCollected" } }, // Group by date
                    totalCaloriesBurned: { $sum: "$caloriesBurned" }
                }
            }
        ]);
        console.log("Exercise log aggregation result:", exerciseData);
        // Handle cases where either data set is empty
        if (data.length === 0 && exerciseData.length === 0) {
            console.log("No data available for the given userId.");
            return []; // Return an empty array if both are empty
        }
        // Combine results
        const combinedData = data.map((sugarLog) => {
            const exerciseLog = exerciseData.find(log => log._id === sugarLog._id) || { totalCaloriesBurned: 0 };
            return {
                date: sugarLog._id,
                averageSugarLevel: sugarLog.averageSugarLevel,
                totalCaloriesBurned: exerciseLog.totalCaloriesBurned
            };
        });
        // Handle cases where only exercise data is present
        if (exerciseData.length > 0 && combinedData.length === 0) {
            // If no sugar log data exists, create combined entries based on exercise data
            return exerciseData.map(exerciseLog => ({
                date: exerciseLog._id,
                averageSugarLevel: null, // No sugar log data
                totalCaloriesBurned: exerciseLog.totalCaloriesBurned
            }));
        }
        console.log("Combined aggregation result:...............", combinedData);
        res.json(combinedData); // Return the aggregated data as JSON
    } catch (err) {
        console.error("Error in aggregation route:", err);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});
//chat gpt api

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
