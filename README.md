# Jurassic Captialist
This project is a take on the game [Adventure Capitalist](http://en.gameslol.net/adventure-capitalist-1086.html) themed as a manager of a Jurassic Park island.

The game is implemented as full-stack application with a corresponding backend to allow players to play in a different browser at home or at the office.

In the game players first pick a username and then enter into the game scene, where they can buy dinosaurs or use the dinosaurs to make money by clicking on the dinosaur icon.

Initially, the player starts without any dinosaurs and has to buy some to start earning profits.

The game also features the ability to purchase 
- Managers which automatically click the dinosaur icons. 
- Upgrades which triple the profits from dinosaurs

The game can be accessed on Heroku: https://mighty-mesa-87200.herokuapp.com/. You can choose any username to log in.

[Screenshot](/jurassic_capitalist.png)

# Architecture
## Tech stack
The game is implemented in Typescript and uses Node.js, Express.js, Socket.io and Webpack as dependencies.

Node.js is used for the backend server and it serves static files using an Express.js http server. The backend is only used for persistance in order to allow the player to be able to play the game on different devices. The communication between the client and the server goes through websockets that are managed by Socket.io. 

I chose websockets for the communication protocol because the client sends "sync" updates for the backend to persist and these updates can be sent fairly frequently. Websockets allow the game to handle this traffic without the constant overhead of setting up and tearing down TCP connections.

Webpack is used to be able to break the codebase down into small modules and still have the benefit of a single .js bundle where the imports are automatically located and compiled.

I chose typescript to avoid the many type bugs that usually occur with javascript.

## Game architecture
The game-server is solely responsible for persisting the state of the user's island -- this means the status of earnings, managers, upgrades and cash. Updates are sent to the server anytime an action (even automatic action by managers) is taken in the game.

The game-client uses a kind of data-oriented architecture. The `index.ts` file is the entry point into the game where a connection is setup to the back-end and the login is processed.

Then the game-client starts a 30 FPS game loop which is implemented by the `GameClient` class in the `game.ts` file. The `GameClient` receives the persisted `GameState` from the server and before the game loop is started, the visual representations (views) of the businesses are created in the constructor of the game client based on the incoming game state. Furthermore, the client creates instances of all the systems from `systems.ts`.

The game loop itself consists of running the `GameState` through the systems to update the contents of the state based on any actions the player has taken. Then the game state is rendered onto the views that were created when the client was created.

As one final point, the server and client also synchronize their time. This is used so that we can store a timestamp whenever a dinosaur operation is started. This is needed so that we can compute the offline earnings on the server, using the server time, when the player logs in again. Doing it this way also prevents cheating such as setting the local clock to an old date.

# Discussion
I focused on a full-stack implementation of a Capitalist-type game. While it would have been easier to just persist all state in localStorage on the client, this would mean the players cannot change between browsers or devices so I opted to implement a backend to enable persistance.

I tried to make the UI as pretty as I could with my limited programmer art, but a lot more could be done in that respect. Due to time constraints, I also didn't implement many of the features that are available in Adventure Capitalist such as tutorials, buying multiple instances of a business at the same time.