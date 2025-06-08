# EduAI Next.js Project ✨

Welcome! This is a project built with [Next.js](https://nextjs.org), a powerful framework for creating modern web applications.

This README is designed to guide a complete beginner through setting up and running this project from scratch. No prior experience with Next.js or Node.js is required!

## Table of Contents

*   [Prerequisites: What You Need Before You Start](#prerequisites-what-you-need-before-you-start-️)
*   [Getting Started: Step-by-Step Setup](#getting-started-step-by-step-setup-)
*   [Making Your First Edit](#making-your-first-edit-)
*   [Understanding the Project Structure](#understanding-the-project-structure-)
*   [Learn More About Next.js](#learn-more-about-nextjs-)
*   [Deploy Your Project](#deploy-your-project-)

## Prerequisites: What You Need Before You Start 🛠️

Before you can work with this project, you need a couple of essential tools installed on your computer.

### 1. Node.js and npm

*   **What it is:** Node.js is an environment that allows you to run JavaScript code outside of a web browser. It's the foundation of modern web development. `npm` (Node Package Manager) is a tool that comes with Node.js and helps you install and manage project-specific libraries (called "packages").
*   **How to get it:**
    1.  Go to the official [Node.js website](https://nodejs.org/).
    2.  Download the **LTS** (Long-Term Support) version. This is the most stable version and is recommended for most users.
    3.  Run the installer and follow the on-screen instructions.
*   **How to check if it's installed:** Open your terminal (or Command Prompt/PowerShell on Windows) and type these two commands, pressing Enter after each one:
    ```bash
    node -v
    npm -v
    ```
    If you see version numbers (e.g., `v20.11.0`), you're all set!

### 2. A Code Editor

*   **What it is:** A simple text editor like Notepad won't be enough. You need a specialized code editor that helps you write code with features like syntax highlighting and autocompletion.
*   **What we recommend:** [**Visual Studio Code (VS Code)**](https://code.visualstudio.com/) is a fantastic, free, and popular choice for web development. Download and install it from its website.

## Getting Started: Step-by-Step Setup 🚀

Now that you have the prerequisites, follow these steps to get the project running on your computer.

### Step 1: Get the Project Code

You need to download the project files. The best way to do this is by "cloning" the repository using Git. If you don't have Git, you can also download the code as a ZIP file from the project's GitHub page.

### Step 2: Navigate to the Project Folder

Your terminal is likely still in your home directory. You need to move into the newly created project folder.

# Replace 'project-name' with the actual name of the project folder
cd project-name

### Step 3: Install Project Dependencies

This project relies on several external libraries (like Next.js itself). The package.json file in this folder lists all of them. The following command reads that file and downloads everything needed.

npm install

This might take a minute or two. You'll see a new folder called node_modules appear—this is where all the downloaded code lives. You should never edit this folder directly.

### Step 4: Run the Development Server

Now, you can start the local web server. This will launch the application on your computer in a "development mode" that automatically reloads when you change a file.

npm run dev

You should see output in your terminal that looks something like this:

✓ Ready in 5.2s
○ Compiling / ...
✓ Compiled / in 221ms
- Local:    http://localhost:3000

### Step 5: See Your Project!

Congratulations! The project is now running. Open your web browser (like Chrome, Firefox, or Safari) and go to the following address:

http://localhost:3000

You should see the homepage of the application.