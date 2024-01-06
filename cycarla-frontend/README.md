`cycarla-frontend` is a Next.js project which provides a game-like user interface for CYCARLA.

The three components of Cycarla are:
1. [CARLA](https://github.com/carla-simulator/carla) - An open-source simulator for autonomous driving research.
2. [cycarla_backend](https://github.com/tensorturtle/cycarla/tree/main/cycarla-backend) - This Python Flask server which links the frontend to CARLA.
3. [cycarla_frontend](https://github.com/tensorturtle/cycarla/tree/main/cycarla-frontend) - This Next.js project.

# Installation

[Download and install Node.js](https://nodejs.org/)

Alternatively on Ubuntu, we can use `nvm` instead to specify the version of `npm` to install:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
```
nvm install 20
nvm use 20
```


Once `npm` is installed, install the Next.js framework:
```
npm install next
```

# Run App

Run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
