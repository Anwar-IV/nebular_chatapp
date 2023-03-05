You need to follow these 3 steps to get this server up and running.

1- Replace the environment variables in the .env.example file with the required values, for example for the MONGO_URI env variable you need a valid MongoDB URI and the same goes for the OPEN_AI env variable. You can get them by creating an account with MongoDB atlas and OpenAI. You can put whatever you like for the refresh and access token secret however the more secure they are the better. Lastly just get rid of the '.example' bit in the file name so the file is just called '.env'.

2- You need to type in and run 'npm install' in the terminal to install all the dependancies. You need to make sure you are in the 'server' directory and you can see the package.json file.

3- You need to type in and run 'tsc' in the terminal to compile the typescript. You should then see a 'dist' folder appear in the directory. That's good because it means your all set. 

4- Now type in and run 'npm run dev' in the terminal you should see a bunch of messages and at the bottom of those messages it should say 'server started on port 5500' and 'Connected to MongoDB'. That's it now the server is up and running. 