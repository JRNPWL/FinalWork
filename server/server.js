// Import required modules
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const GridFSBucket = require("mongodb").GridFSBucket;

// Set up Express app
const app = express();
const port = 3000;

// MongoDB connection string
const mongoURI =
  "mongodb+srv://jp:jp@cluster0.i8qkgdg.mongodb.net/?retryWrites=true&w=majority";

const mongoURIGridFs =
  "mongodb+srv://jp:jp@cluster0.i8qkgdg.mongodb.net/finalwork?retryWrites=true&w=majority";

// Multer GridFS storage engine
const storage = new GridFsStorage({
  url: mongoURIGridFs,
  file: (req, file) => {
    //If it is an image, save to photos bucket
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "photos",
        filename: `${Date.now()}_${file.originalname}`,
      };
    } else {
      //Otherwise save to default bucket
      return `${Date.now()}_${file.originalname}`;
    }
  },
});

const upload = multer({ storage });

// Connect to MongoDB
MongoClient.connect(mongoURI)
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db("finalwork");
    const usersCollection = db.collection("users");
    const medicationsCollection = db.collection("medications");
    const exercisesCollection = db.collection("exercises");
    const journalCollection = db.collection("journal");

    // Middleware to parse JSON requests
    app.use(express.json());
    app.use(cors());
    // Route to add/create a user
    app.post(
      "/api/users",
      upload.single("profilePicture"),
      async (req, res) => {
        const { name, email, password } = req.body;

        try {
          // Check if email already exists in database
          const emailQuery = { email: email };
          const emailCheck = await usersCollection.findOne(emailQuery);

          if (emailCheck) {
            return res.status(401).send({
              status: "Error",
              message: "User already exists",
            });
          }

          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Initialize profile picture fields with empty values
          let profilePictureId = "";
          let profilePicture = "";
          let profilePictureType = "";

          // If a profile picture is uploaded, update the profile picture fields
          if (req.file) {
            profilePictureId = req.file.id;
            profilePicture = req.file.filename;
            profilePictureType = req.file.contentType;
          }

          // Create a new user object with hashed password
          const newUser = {
            userId: uuidv4(),
            name: name,
            email: email,
            password: hashedPassword,
            profilePictureId: profilePictureId,
            profilePicture: profilePicture,
            profilePictureType: profilePictureType,
          };

          // Insert the new user into the database
          const result = await usersCollection.insertOne(newUser);
          //   console.log(profilePicture);

          res.status(201).send({
            status: "Successful",
            message: "User Created Successfully",
            data: result,
          });
        } catch (error) {
          console.error("Error creating new user:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    // Route to retrieve all users
    app.get("/api/users", async (req, res) => {
      try {
        const response = await usersCollection.find({}).toArray();
        res.status(200).send(response);
      } catch (error) {
        console.error("Error retrieving user profile:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Route to retrieve user profile
    app.get("/api/users/:userId", async (req, res) => {
      // const user_id = parseInt(req.params.userId);
      const user_id = req.params.userId;
      const query = { userId: user_id };
      try {
        const user = await usersCollection.findOne(query);
        res.json(user);
        console.log(user);
      } catch (error) {
        console.error("Error retrieving user profile:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/api/users/:userId/profilePicture", async (req, res) => {
      try {
        const userId = req.params.userId;

        // Find the user document by userId
        const user = await usersCollection.findOne({ userId });

        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }

        // Check if user has a profile picture
        if (!user.profilePicture) {
          return res
            .status(404)
            .send({ error: "Profile picture not found for this user" });
        }

        // Use GridFSBucket to retrieve the profile picture data
        const imageBucket = new GridFSBucket(db, {
          bucketName: "photos",
        });

        let downloadStream = imageBucket.openDownloadStreamByName(
          user.profilePicture
        );

        downloadStream.on("data", function (data) {
          return res.status(200).write(data);
        });

        downloadStream.on("error", function (data) {
          return res.status(404).send({ error: "Image not found" });
        });

        downloadStream.on("end", () => {
          return res.end();
        });
      } catch (error) {
        console.error("Error retrieving user profile picture:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Route to update user profile
    app.put("/api/users/:userId", async (req, res) => {
      const userId = req.params.userId;
      const updatedProfile = req.body;
      try {
        const result = await usersCollection.updateOne(
          { userId: userId },
          { $set: updatedProfile }
        );
        res.json({ message: "User profile updated successfully" });
      } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Route to retrieve medications for a specific user
    app.get("/api/medications/:userId", async (req, res) => {
      const userId = req.params.userId;
      try {
        const userMedications = await medicationsCollection
          .find({ userId: userId })
          .toArray();
        res.json(userMedications);
      } catch (error) {
        console.error("Error retrieving user medications:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // ADDS REMINDER IN BOTH DATE OBJECT AND SEPERATE STRINGS
    // Route to add a new medication with reminders
    // app.post('/api/medications/:userId', async (req, res) => {
    //     const userId = req.params.userId;
    //     const { name, dosage, frequency, time, reminders } = req.body; // Extract medication details and reminders from request body

    //     // Generate unique ID for medication
    //     const medicationId = uuidv4();

    //     // Create medication object
    //     let newMedication = {
    //         userId: userId,
    //         medicationId: medicationId,
    //         name: name,
    //         dosage: dosage,
    //         frequency: frequency,
    //         time: time,
    //         reminders: reminders // Add reminders to the medication object
    //     }

    //     try {
    //         // Insert medication into medications collection
    //         const result = await medicationsCollection.insertOne(newMedication);
    //         res.status(201).json(result);

    //         // If reminders are provided, add reminders to the reminder collection
    //         if (reminders && reminders.length > 0) {
    //             for (const reminder of reminders) {
    //                 const reminderDateTime = new Date(reminder.date + 'T' + reminder.time); // Combine date and time strings to create a Date object
    //                 await medicationsCollection.updateOne(
    //                     { medicationId:  medicationId },
    //                     { $addToSet: { reminders: reminderDateTime } }
    //                 );
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error adding new medication:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // });

    // ADDS REMINDER ONLY AS DATE OBJECT
    // Route to add a new medication with reminders
    app.post("/api/medications/:userId", async (req, res) => {
      const userId = req.params.userId;
      const { name, dosage, frequency, time, reminders } = req.body; // Extract medication details and reminders from request body

      // Generate unique ID for medication
      const medicationId = uuidv4();

      // Create medication object with basic details
      let newMedication = {
        userId: userId,
        medicationId: medicationId,
        name: name,
        dosage: dosage,
        frequency: frequency,
        time: time,
        reminders: [], // Initialize reminders array
      };

      try {
        // If reminders are provided, convert date and time strings to Date objects and add them to the reminders array
        if (reminders && reminders.length > 0) {
          for (const reminder of reminders) {
            const reminderDateTime = new Date(
              reminder.date + "T" + reminder.time
            );
            newMedication.reminders.push(reminderDateTime);
          }
        }

        // Insert medication into medications collection
        const result = await medicationsCollection.insertOne(newMedication);
        res.status(201).json(result);
      } catch (error) {
        console.error("Error adding new medication:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // ALLOW USER TO PICK FROM ICONS TO REPRESENT TYPE OF EXERCISE (LEG ICON, BICEP ICON, ...)

    // Route to retrieve exercises
    // app.get('/api/exercises', async (req, res) => {
    //     try {
    //         const exercises = await exercisesCollection.find({}).toArray();
    //         res.json(exercises);
    //     } catch (error) {
    //         console.error('Error retrieving exercises:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // });

    // Route to retrieve all journals
    app.get("/api/journal", async (req, res) => {
      try {
        const response = await journalCollection.find({}).toArray();
        res.status(200).send(response);
      } catch (error) {
        console.error("Error retrieving journals:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Route to retrieve journal for a specific user
    app.get("/api/journal/:userId", async (req, res) => {
      const userId = req.params.userId;
      try {
        const userJournal = await journalCollection
          .find({ userId: userId })
          .toArray();
        res.json(userJournal);
      } catch (error) {
        console.error("Error retrieving user journal:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // ADD DATE

    // Route to add a journal entry for a specific user
    app.post("/api/journal/:userId", async (req, res) => {
      const currentDate = new Date();

      let newEntry = {
        userId: req.params.userId,
        journalId: uuidv4(),
        journalMessage: req.body.journalMessage, // Assuming the request body contains an 'id' and 'message' field for the journal entry
        journalDate: currentDate,
      };

      try {
        const result = await journalCollection.insertOne(newEntry);
        res.json({ message: "Journal entry added successfully" });
      } catch (error) {
        console.error("Error adding Journal entry:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Route to edit journal for a specific user
    app.put("/api/journal/:userId", async (req, res) => {
      const userId = req.params.userId;
      const updatedJournal = req.body;
      try {
        const result = await journalCollection.updateOne(
          { userId: userId },
          { $set: updatedJournal }
        );
        res.json({ message: "journal updated successfully" });
      } catch (error) {
        console.error("Error updating user journal:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post("/api/login", async (req, res) => {
      const { email, password } = req.body;

      try {
        // Check if user with the provided email exists in the database
        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Check if the provided password matches the user's password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({ error: "Incorrect password" });
        }

        // If email and password are correct, return user data (excluding password)
        const userData = {
          userId: user.userId,
          email: user.email,
        };

        return res.status(200).json(userData);
      } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
