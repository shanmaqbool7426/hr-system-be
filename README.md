# Installation Guide

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have a machine running a supported operating system (Windows, macOS, Linux).
- You have installed [Node.js](https://nodejs.org/) (which includes npm) on your machine.
- You have installed [Git](https://git-scm.com/).

## Installation Steps

### 1. Clone the Repository

Open your terminal and run the following command to clone the repository:

```sh
git clone https://[username]:[access_token]@git.zaffretech.co/hrm/be.git
```

Replace `username` and `access_token` with your provide credentials.

### 2. Navigate to the Project Directory

Change to the project directory by running:

```sh
cd be
```
```sh
git checkout development
```

### 3. Install Dependencies

Install the required dependencies using npm:

```sh
npm install
```

### 4. Create a `.env` File (if applicable)

If your project requires environment variables, create a `.env` file in the root of your project and add the necessary variables. Refer to the `.env.local` file if available.

### 5. Run the Project

Start the development server:

```sh
npm dev
```

This command will run the server and you can view your project in the browser at `http://localhost:3000` or the specified port.

## Contributing

## License

This project is licensed under the [MIT License](LICENSE).