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
        const {
          name,
          email,
          password,
          dob,
          age,
          sex,
          bloodType,
          medicalHistory,
        } = req.body;

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
          let dob = "";
          let sex = "";
          let bloodType = "";
          let doctor = "";
          let emergencyContact = "";

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

          const medicalHistoryArray = Array.isArray(medicalHistory)
            ? medicalHistory
            : [medicalHistory];

          // Create a new user object with hashed password
          const newUser = {
            userId: uuidv4(),
            name: name,
            email: email,
            password: hashedPassword,
            dob: dob,
            // age: age,
            sex: sex,
            bloodType: bloodType,
            doctor: doctor,
            emergencyContact: emergencyContact,
            medicalHistory: medicalHistoryArray,
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

    app.put(
      "/api/users/:userId",
      upload.single("profilePicture"),
      async (req, res) => {
        const userId = req.params.userId;
        const updatedProfile = req.body;
        try {
          let profilePictureId = "";
          let profilePicture = "";
          let profilePictureType = "";

          // If a profile picture is uploaded, update the profile picture fields
          if (req.file) {
            profilePictureId = req.file.id;
            profilePicture = req.file.filename;
            profilePictureType = req.file.contentType;
          }

          // Filter out empty fields from updatedProfile
          const filteredUpdatedProfile = Object.fromEntries(
            Object.entries(updatedProfile).filter(
              ([key, value]) =>
                value !== undefined && value !== null && value !== ""
            )
          );

          // Merge existing profile with filtered updated data
          const updatedData = {
            ...filteredUpdatedProfile,
            profilePictureId:
              profilePictureId || filteredUpdatedProfile.profilePictureId,
            profilePicture:
              profilePicture || filteredUpdatedProfile.profilePicture,
            profilePictureType:
              profilePictureType || filteredUpdatedProfile.profilePictureType,
          };

          const result = await usersCollection.updateOne(
            { userId: userId },
            { $set: updatedData }
          );

          res.json({ message: "User profile updated successfully" });
        } catch (error) {
          console.error("Error updating user profile:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    );

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

    // Route to add a new medication with reminders
    app.post("/api/medications/:userId", async (req, res) => {
      const userId = req.params.userId;
      const { name, dosage, frequency, date, time, reminders, icon } = req.body; // Extract medication details and reminders from request body

      // Generate unique ID for medication
      const medicationId = uuidv4();
      const medicationTaken = false;

      // Create medication object with basic details
      let newMedication = {
        userId: userId,
        medicationId: medicationId,
        name: name,
        dosage: dosage,
        // frequency: frequency,
        date: date,
        time: time,
        // reminders: [], // Initialize reminders array
        icon: icon,
        medicationTaken: medicationTaken,
      };

      try {
        // Insert medication into medications collection
        const result = await medicationsCollection.insertOne(newMedication);
        res.status(201).json(result);
      } catch (error) {
        console.error("Error adding new medication:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Route to edit a medication
    app.put("/api/medications/:userId/:medicationId", async (req, res) => {
      const userId = req.params.userId;
      const medicationId = req.params.medicationId;
      const { name, dosage, date, time, icon, medicationTaken } = req.body; // Extract medication details and reminders from request body

      try {
        // Find the medication by userId and medicationId
        const medication = await medicationsCollection.findOne({
          userId: userId,
          medicationId: medicationId,
        });

        if (!medication) {
          return res.status(404).json({ error: "Medication not found" });
        }

        // Update medication object with new details
        let updatedMedication = {
          ...medication,
          name: name || medication.name,
          dosage: dosage || medication.dosage,
          date: date || medication.date,
          time: time || medication.time,
          icon: icon || medication.icon,
          medicationTaken: medicationTaken || medication.medicationTaken,
        };

        // Update medication in medications collection
        const result = await medicationsCollection.updateOne(
          { userId: userId, medicationId: medicationId },
          { $set: updatedMedication }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Medication not updated" });
        }

        res.status(200).json({ message: "Medication updated successfully" });
      } catch (error) {
        console.error("Error updating medication:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // ALLOW USER TO PICK FROM ICONS TO REPRESENT TYPE OF EXERCISE (LEG ICON, BICEP ICON, ...)

    // Route to retrieve exercises
    app.get("/api/exercises", async (req, res) => {
      try {
        const exercises = await exercisesCollection.find({}).toArray();
        res.json(exercises);
      } catch (error) {
        console.error("Error retrieving exercises:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Route to retrieve exercises for a specific user
    app.get("/api/exercises/:userId", async (req, res) => {
      const userId = req.params.userId;
      try {
        const userExercises = await exercisesCollection
          .find({ userId: userId })
          .toArray();
        res.json(userExercises);
      } catch (error) {
        console.error("Error retrieving user exercises:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Route to add a new exercises with reminders
    app.post("/api/exercises/:userId", async (req, res) => {
      const userId = req.params.userId;
      const { name, reps, sets, description, icon } = req.body;

      // Generate unique ID for exercise
      const exercisesId = uuidv4();

      // Create exercise object with basic details
      let newExercise = {
        userId: userId,
        medicationId: exercisesId,
        name: name,
        sets: sets,
        reps: reps,
        description: description,
        icon: icon,
      };

      try {
        // Insert exercises into exercises collection
        const result = await exercisesCollection.insertOne(newExercise);
        res.status(201).json(result);
      } catch (error) {
        console.error("Error adding new exercises:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

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
