# Tomato Timer and Puppy Interaction App 🍅🐶

This web application provides a Pomodoro timer integrated with fun interactions with a virtual puppy. Users can also track their progress with a tomato reward system and view an activity log of their sessions.

## Features

- **Pomodoro Timer:** Helps users focus by breaking work into intervals, traditionally 25 minutes in length, separated by short breaks.
- **Puppy Interaction:** Enjoy playful interactions with a virtual voxel puppy while you work.
- **Activity Log:** Track your work sessions, breaks, and collected tomatoes.
- **Tomato Reward System:** Earn tomatoes after completing Pomodoro sessions and trade for room decoration.
- **Mysterious Item Collection:** Discover and collect intriguing items scattered throughout the world, each with its own unique backstory.
- **Item Index System:** Organize and view your collected treasures in a comprehensive index, showcasing your achievements and findings.
 
![image](https://github.com/zulliu/pomopup/assets/11202096/c9bfd5ba-91bc-4bb2-ba41-998a368cb041)

![pup](https://github.com/zulliu/pomopup/assets/11202096/64b4e164-7fdf-4031-937a-ebfd7c5dc53a)

## Getting Started

1. **Clone the Repository**
    ```bash
    git clone https://github.com/zulliu/pomopup.git
    cd pomopup
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```
3. **Initialize Database(example with postgres command)**
   
   Mysterious items and data are not included.
   ```
   cd server
   createdb pomopup && psql -U [your username] -d pomopup -a -f schema.sql

   ```
5. **Run the Application**
    ```bash
    npm start
    ```
    The app will be running at http://localhost:3155/

## DoTo
- Better database and assets preset to start with.
- More puppy behavior.
- More mysterious Item.
- More puppy models for selection.

## Dependencies
- Next
- React
- React-Three-Fiber
- Axios
- jwt

## Contributing

- zulliu

## License

[MIT](https://choosealicense.com/licenses/mit/)
