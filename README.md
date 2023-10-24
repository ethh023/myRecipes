# myRecipes Web App (MERN STACK)

## Built using the MERN Stack, (React, MongoDB + Mongoose, ExpressJS, NodeJS) + JWT for user token auth, Bcrypt for pw hashing, Cloudinary for profile pictures and imagery and Chakra UI for css styling

## What this web app is about:
### This is a web app that allows chefs, or any cook enthusiast to create, manage and share their recipes with others, people can communicate/message and follow  each other and their favorite chefs to keep up to date with their latest posts and recipes, user's can save other user's recipes, and create and manage shopping lists for what they may need for their next recipe they want to cook.

## How to run:
### Install Node.JS and Nodemon, and install all of the dependencies and packages in the backend and the frontend

### Create .env file in backend and add variables PORT=5000, MONGO_URI=*add in your own mongo db uri*, SECRET KEY (for secret key run 'node' in terminal => then run 
### ' require('crypto').randomBytes(48, function(err, buffer) { var token = buffer.toString('hex'); console.log(token); }); ') and copy the key and paste it in the .env SECRET KEY variable, 
### OPTIONAL => (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET), 

### Run 'nodemon start' in backend

### Run 'npm run dev' in frontend

## Otherwise go to this link -> *(Haven't deployed it yet)*, to see it work. 
