# Step 1: Use an official Node.js runtime as a parent image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Expose the port your app will run on
EXPOSE 5000

# Step 7: Define the environment variables (Optional)
ENV MONGO_URI=mongodb+srv://ayushjivani2201:CAjvgIxLmnlIMgdU@clusteraiquiz.m6ehh.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAIQuiz


# Step 8: Run the application
CMD ["npm", "start"]
