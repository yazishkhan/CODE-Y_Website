# 💻 CODE-Y The Online Coding Platform 🧑‍💻

CODEY is a web-based online coding platform designed to provide a simple yet powerful environment for users to write, compile, and run code in multiple programming languages. The platform features a responsive and animated user interface, simulating a real-time coding experience.

-------------

### ✨ Features
- Online Code Editor: A sleek and modern in-browser editor built using the CodeMirror library, which provides advanced features like syntax highlighting for a better coding experience.

- Asynchronous Code Execution: Integrates with the Judge0 API using a polling mechanism. This non-blocking approach ensures that the server can handle multiple requests efficiently while waiting for code to compile and run in over 7 supported languages.

- Simulated Interactive Terminal: The terminal provides a guided, interactive feel for programs requiring user input. This is achieved using JavaScript to collect all inputs sequentially on the frontend before sending a single, combined string to the backend for execution.

- User Session Management: Tracks individual users by assigning a unique UUID stored in a session cookie. This is a secure method that allows for personalized data persistence without a full login system.

- Persistent Code History: Stores the last two compiled terminal outputs for each user in a MariaDB database, using the SQLAlchemy ORM for efficient data management.

- Responsive & Animated UI: Built with a mobile-first approach, the UI uses CSS media queries to adapt its layout to different screen sizes. Animations are triggered by the IntersectionObserver API to provide a dynamic and engaging feel as the user scrolls.

- Client-Side Contact Form: A simple, reliable contact form that uses the mailto: URI protocol to send emails directly from the user's browser, bypassing complex server-side email configurations.


------------

## 🚀 Tech Stack
**Backend**

- Python: The core programming language.

- Flask: The web framework used to build the application.

- SQLAlchemy: The Object-Relational Mapper (ORM) for database interactions.

- PyMySQL: The driver for connecting to the MariaDB database.

- Requests: The library for making HTTP requests to external APIs.

- Judge0 API: The external service for code execution.

**Frontend**

- HTML5, CSS3, JavaScript: The foundation of the user interface.

- CodeMirror: A powerful JavaScript library for the in-browser code editor.

- IntersectionObserver: A browser API used to create scroll-triggered animations.

**Database**
- Mysql for simple setup.


**Prerequisites**
- Python 3.8+

- MariaDB (or MySQL) server installed and running.

- A Judge0 API Key from RapidAPI.

- A Google Account where you use for email functionality it may logged in on that browser (as a fallback or for development).

----------
## 🛠️ Installation and Setup
##### Step 1 : Clone the repo and Setup DB  📥
- First Clone the repository 
    ````bash 
    git clone https://github.com/yazishkhan/CODE-Y_Website.git
    ````

- Install Mysql(mariadb) If it installed skip this step.
    - To install the mysql update the linux.
        ````bash
        sudo apt update
        ````
    - Installing Mysql server
        ````bash
        apt-get install mysql-server
        ````
    - Check if the MySQL service is running correctly.
        ````bash
        sudo systemctl status mysql
        ````
    - To ensure MySQL starts automatically every time your system boots, enable the service.
        ````bash
        sudo systemctl enable mysql
        ````
    - You can now access the MySQL command-line client using the root user and the password you set during installation.
        ````bash
        sudo mysql -u root -p
        ````
        - Then it ask for password just enter it and you will get an MySQL shell.
    - Then Just create a database using this command and no need to set up anything it all done by backend code.
        ````sql
        create database coding_web;
        ````
        - You may use different name of DB `coding_web` as per you. just remember we need to replace this in backend code.
    - Then just Exit from mysql shell.
        ````sql
        exit;
        ````
##### Step 2 : Configuring Backend code and API credential  🔐
- Now navigate to Project directory.
    ````bash
    cd CODE-Y_Website
    ````
- Open any browser and search for [rapidapi.com](https://rapidapi.com/)

    ![image](https://github.com/user-attachments/assets/97c5873d-8365-4758-9b5b-7aa3dc99dee0)

- Then just login or signup and after it you will see the `API hub` button just click it.

- Then in search bar just Type for `Judge0`
    ![image](https://github.com/user-attachments/assets/a3c101ef-b314-47dc-9eef-9b5693671753)

- Then click to `Subscribe to Test` 
    ![image](https://github.com/user-attachments/assets/60a44d6a-3cb2-470f-8387-26eaca5717d0)

- Then Copy the `X-RapidAPI-Key` 
- Then open the `config.py` file present in `CODE-Y_Website` project folder.
- Then pest the `X-RapidAPI-Key` 
    ![image](https://github.com/user-attachments/assets/ab487393-0ce8-44e4-95f2-8b63e31fdded)

- Then also ADD YOUR EMAIL for email sending functionality (optional).
    ![image](https://github.com/user-attachments/assets/f6a0e18a-d77b-4a02-8b50-647900312f36)

- Then open the `aap.py` file and first replace the DB credentials.
    ![image](https://github.com/user-attachments/assets/ae86aa2d-3109-4e29-9a03-21e0226a747b)

    - Replace the `password` which we had set for mysql.
    - Replace the DB name `coding_web` if you have set the diff name for db otherwise not.
    - Scroll down and put your Email ID were you want to receive feedback emails.
    ![image](https://github.com/user-attachments/assets/a1e01eef-6b02-405d-9ef1-97d39d45e233)

- Now the code is fully configured.

##### Step 3 : Installing requirements and Configuring Environments 📠

- The first of all you need the `Python3` installed on your computer.
- Then Create the `Virtual Environment` by running this command for this project.
    - Make sure you are under the project folder `CODE-Y_Website`.

    ````bash
    python3 -m venv venv
    ````
- Then Activate the Virtual Environment.
    ````bash
    source venv/bin/activate
    ````
    - Your shell should show (venv) at the beginning.
    
- Upgrade pip inside the venv.
    ````bash
    pip install --upgrade pip
    ````

- Now install your requirements.
    ````bash
    pip install -r requirements.txt
    ````

- Now just set an environment variable by running this command in venv.
    ````bash
    export JUDGE0_API_KEY='X-RapidAPI-Key'
    ````
    - Replace the `X-RapidAPI-Key` with your actual API key which we copied first.
- Now just Run the `aap.py` file it will start an Flask Server
    ````bash
    python3 aap.py
    ````
- Then just open the browser and pest this URL
    ````bash
    http://127.0.0.1:5000/
    ````
- Then BOOOOOM you will see the website running on.
------
## 🔴  CODE-Y The Ultimate Coding Platform by: [Yazish Khan](https://www.linkedin.com/in/yazish-khan-3634752b7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
