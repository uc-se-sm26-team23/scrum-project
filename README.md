# Team 23 Scrum Project Report

Project Requirement: https://github.com/phung-se/uc-se/blob/main/scrum-project/description-requirements.md

> _**Note:** This is a starter template for your team to begin Sprint 0._
> _It is the **minimum** required structure for your final report and is expected to grow across sprints._
> _Your team may add sections; please discuss any **removal** of a section with the instructor (open a pull request)._

**University of Cincinnati**

**EECE/CS-3093C — Software Engineering, Summer 2026**

**Instructor:** Dr. Phu Phung

---

# Scrum Project — Mini-Messenger

## Team Members

_Teams are 3–5 students (per syllabus). Solo teams are not permitted._

1. Marcus Nguyen — nguye8tu@mail.uc.edu — Product Owner
2. Luke Falanga — falanglv@mail.uc.edu — Scrum Master
3. Connor Slutsky — slutskcp@mail.uc.edu — Member
4. Akul Jha — jhaal@mail.uc.edu — Member
5. Ong Jai Sheng — ongjs@mail.uc.edu — Member

---

# Project Management Information

| Item | URL |
|---|---|
| Team homepage / landing page | [https://github.com/uc-se-sm26-team23/uc-se-sm26-team23.github.io/tree/main](https://github.com/uc-se-sm26-team23/uc-se-sm26-team23.github.io/tree/main) |
| Live prototype (Azure App Services) | https://team23-uc-se-messenger.azurewebsites.net/ |
| GitHub Projects board (private) | [https://github.com/orgs/uc-se-sm26-team23/projects/1](https://github.com/orgs/uc-se-sm26-team23/projects/1) |
| Source code repository (private) | [https://github.com/uc-se-sm26-team23/scrum-project](https://github.com/uc-se-sm26-team23/scrum-project) |
| MongoDB Atlas cluster (configuration only — no credentials) | • Cluster Name: MessengerDB<br>• Regions:<br>&nbsp;&nbsp;&nbsp;&nbsp;• ac-z35urdl-shard-00-02.qbjrnkt.mongodb.net:27017 (Primary)<br>&nbsp;&nbsp;&nbsp;&nbsp;• ac-z35urdl-shard-00-01.qbjrnkt.mongodb.net:27017 (Secondary) <br>&nbsp;&nbsp;&nbsp;&nbsp;• ac-z35urdl-shard-00-00.qbjrnkt.mongodb.net:27017 (Secondary) |


## Revision History

| Date       | Version | Description                          | Author |
|------------|---------|--------------------------------------|--------|
| 05/28/2026 | 0.1     | Initial draft (Sprint 0)             | ALL   |
| 06/04/2026 | 0.2     | Added use cases and architecture     | ALL   |
| 07/09/2026 | 0.3     | implemented CI/CD/join chat/onlineuser/modify message and other basic core features | ALL   |


---

# Overview

_Start in Sprint 0; refine across all sprints._

_Describe the project in 2–4 paragraphs: the problem it addresses, the target users, and a high-level summary of the proposed solution. Include a **high-level architecture diagram**_ 

The project is a messaging app with secure privacy features, private and group chat functionality. It will allow securechats for real time communications with seamless channel navigation whilsts showing online available users. It is intended for users of all age and audience that are able to access internet, though user stories largely target a student-professor dynamic.

*High level architecture diagram currently provided in Systems Design Section
---

# System Analysis

_Start in Sprint 0; keep updating._

## User Requirements

List the high-level functional and non-functional requirements. These will be refined into user stories and use cases. _(Main focus of Sprint 0.)_

- **F1.1:** Login and chat UIs are visually and functionally separated
- **F1.2:** Users can log in with a username (no password required yet)
- **F1.3:** Only logged-in users can access the chat interface
- **F1.4:** Logged-in users can send and receive public messages in real time
- **F1.5:** Logged-in users can send and receive private (direct) messages to/from a specific online user
- **F1.6:** An online user list is displayed and updated in real time
- **F1.7:** Public chat and private chat are visually distinct (separate views or panels)
- **F1.8:** Real-time typing status indicator for public and private chat
- **F1.9:** Logged-in users can modify (edit and delete) previously sent messages in public chat (private chat implementation later)
- **NFR-1 (Performance):** Minimal load time to see chat app, with high chat character limit and high group member limit
- **NFR-2 (Usability):** Chat login and viewing of unread messages is readily available with seamless UI
- **NFR-3 (Security — see §Security):** As a User, I want to be able to login securely and maintain secure access to my chats

## User Stories & Product Backlog

Team 23 Project Board Link: [https://github.com/orgs/uc-se-sm26-team23/projects/1](https://github.com/orgs/uc-se-sm26-team23/projects/1)

Link to your **GitHub Projects board** (above) and include a representative screenshot of the **Todo / In Progress / Done** columns at the end of each sprint. _(Sprint 0 onward.)_

### Sprint 0
<img width="893" height="766" alt="image" src="https://github.com/user-attachments/assets/bf381c2b-5e6a-4d07-ae08-3686ff8843d8" />
<img width="897" height="787" alt="image" src="https://github.com/user-attachments/assets/73d3d3f1-18f4-4a7a-af56-4a09edd1e7e7" />


### Sprint 1
<img width="1918" height="903" alt="image" src="https://github.com/user-attachments/assets/54a7667b-1937-4b53-af37-eed06de04691" />
<img width="1907" height="947" alt="image" src="https://github.com/user-attachments/assets/7fbebb09-b032-4e9e-85b1-7462ca9087b3" />


### Sprint 2
<img width="1917" height="960" alt="image" src="https://github.com/user-attachments/assets/45e4fd2b-b643-414e-b56f-a51ac05e92d2" />
<img width="1912" height="955" alt="image" src="https://github.com/user-attachments/assets/2c134051-b15c-4251-9548-7365bab8e1e1" />
<img width="615" height="907" alt="image" src="https://github.com/user-attachments/assets/6cd120d8-3172-4bcb-aa29-2e62aa9f7428" />




### Sprint 3
- *to be updated w/ screenshots*
## Use Cases

Include the **use-case diagram** and a **brief description** (1–3 sentences) for each use case. _(Main focus of Sprint 0.)_

### Brief Description for each Use Cases

| UC ID | Use Case            | Primary Actor | Brief Description |
|-------|---------------------|---------------|-------------------|
| UC-01 | Send Message | Connected User | Actor types a message and clicks Send; system receives the message and delivers it in real time to all connected users. |
| UC-02 | Receive Message | Connected User | Users receive messages from the channels that they are in |
| UC-03 | Modify Message | Connected User | Users can edit or delete messages that only they have already set to fix mistakes |
| UC-04 | Create Channel | Connected User | User create 1-on-1 or group channels so that they can send messages to individuals or groups  |
| UC-05 | Navigate Channels | Connected User | Users navigate to different channels  |
| UC-06 | Show Online Users | Connected User | Users can see current logged-in users |
| UC-07 | Login/Logout User | Connected User | Users can log in with a username to access chats |
---

### Use Case Diagram
![Use-Case-Diagram](https://www.plantuml.com/plantuml/png/PT7FQWCX40Rmkqynx3sKpP_qLW9xRLheaWUGzOihc15qDYMKldjTyI3fOUHpveUWdfBeAClDAu-ha0IApiv2naLCuW8hFKc8r0s1ENTWw98GEzA9oaIjJhFreEwCbC0MaSP74jmw-b54IyAaKnwFO4EhqHRbWClGj_ClJ71tF95jIyx1kElZIUnQCKHe0GspPeQlOj-A3trtzhyvj6QSmpTzidUCSjzKqR55xy4wVibhMAIeYbxLRtsrpUQjx7FLt3TvctDVywxfxrMkcWzD_wZK2MpMp_e3)


# System Design

_Start in Sprint 1; keep updating._

## Architecture

Describe the architectural style (e.g., layered, client-server, microservices) and the major components. Embed an architecture diagram if it differs from the high-level one in §Overview.

The current sprint architecture follows a client-server model split into three distinct layers:

- **Client Layer**: Consists of the user's web browser rendering the front-end user interface (built with HTML, CSS, and client-side JavaScript).

- **Application Server Layer**: Has the Node.js application, which manages real-time, full-duplex communication using Socket.io connections.

- **Database Layer**: Utilizes MongoDB Atlas for cloud-based data persistence and storage.

<img width="796" height="321" alt="image" src="https://github.com/user-attachments/assets/bb8c5001-6ac3-4d49-b306-bcd73b17326f" />

## Use-Case Realization

For each use case in §Use Cases, describe how it is realized in code: which modules, endpoints, and database collections participate. **Sequence diagrams** are encouraged for non-trivial flows (e.g., authentication, message send/receive). _(Sprint 1 onward.)_

# Acceptance Criteria
  
- AC-01.1: Given that I am in chat window, When I tap the 'send' button, Then the app shows my message as sent in the chat window.
- AC-01.2: Given that I sent a non-empty message to the chat window, When connected user(s) are in the chat window, Then the app should display the message to them instantly without needing to refresh page.
- AC-01.3: Given that I am in chat window, When I send a message with the 'Send' button, Then the text input box should auto clear.
- AC-01.4: Given that I am in chat window, When a message appears, Then the system must display the sender's username alongside the message text.
- AC-01.5: Given that I have sent a message to the chat window, When other active user(s) open and view that chat window, Then my message should show which users have read it.
- AC-01.6: Given that I am viewing my own sent message, When the display showing which users has seen the sent message, Then the system should exclude the sent user from the display.
- AC-01.7: Given that a connected user is currently typing to the chat window, When they press any key, Then the typing indicator must appear at the bottom of the chat window.
- AC-01.8: Given that a typing user's typing indicator is visible on other users' screen, When the typing user stops typing for more than a certain seconds or delete all texts, Then the typing indicator must disappear from other users' screen.
  
- AC-02.01: Given that I am actively viewing a chat window, When a connected user sends a message, Then the app must immediately display the message in the chat area without needing to manual refresh page.
- AC-02.02: Given that a user joins or leaves the group chat, When that event happens, Then the system must display a status message in chat area (ex. " joined the chat")
- AC-02.03: Given that I am in the chat window, When a new message arrives from a connected user(s), Then the chat screen must auto scroll down to show the latest message visible.
- AC-02.04: Given that I receive a message from a connected user(s) in a different time zone, When the timestamp displays, Then the system must convert and display the time using my phone's current location time zone setting.
- AC-02.05: Given that the messenger app is running in the background, When a new message arrives, Then the system must trigger a visual push notification displaying the sender's name and a message preview.
  
- AC-03.1: each message sent by the connected user, and only messages from that connected user, displays a triple dots button with available modification options (edit and delete).
- AC-03.2: when the connected user selects the edit option, the current message text becomes editable.
- AC-03.3: when the connected user submits a non-empty edited message, the updated message appears in the chat window of all connected users immediately, otherwise if the edited message is empty the message does not send.
- AC-03.4: when a message is edited, the displayed message shows an edited indicator.
- AC-03.5: when the connected user selects the delete option, the message is removed from that channel for all users in the channel
- AC-03.6: when the connected user deletes a message, a system status message will be sent to that channel informing the channel members that the connected user deleted a message
  
- AC-04.1: Given that I am in the main channel, when I tap the "Create Channel" button, then a new channel should be created
- AC-04.2: Given that I press the "Create Channel" button, then I should be prompted with connected users I wish to add to the channel
- AC-04.3: Given that I am in a channels view, when I press the "Leave Channel" button, I should exit the channel with access no longer allowed
- AC-04.4: Given that I create a channel, I should see the channel title, all active group members, and all chats in the channel.
- AC-04.5: Given that I am in a channel view, I should be able to send and receive messages to all other members in the channel
  
- AC-05.01: Given that I am logged into the messenger app, When a connected user recieves a message from a specific channel, Then the app must immediately show a visually distinct and informative notification in the channel organization list/pannel.
- AC-05.02: Given that I am actively viewing a chat window, When a connected user switches to another channel, Then the app must immediately display the messages in that channel into the chat area without needing to manually refresh page.
- AC-05.03: Given that I am logged into the messenger app, When a connected user wants to swap channel through a button, Then the app must immediately open a navigation panel that allows user to change channels.
  
- AC-06.1: Given that I looked at the online user list, When the list renders, Then the system must display only connected user(s) that are active and exclude all offline user(s).
- AC-06.2: Given that I am viewing the online list, When I check the roster, Then the system must display my own username and beside the username marked "(You)".
- AC-06.3: Given that I log into the webpage, When the homepage loads, Then the online users list must display as an expanded sidebar panel on the far right side of the screen.
- AC-06.4: Given that the online users list panel is open, When I click the 'x' button on the panel, Then the sidebar must hide, and allow the main chat area use the remaining screen space.
- AC-06.5: Given that the online users list is hidden, when I clicked the '+' button, Then the right sidebar must reappear, and the main chat area must shrink back to its original screen space.
- AC-06.6: Given that I am viewing the online list panel, When connected user(s) logs into the webpage, Then their username must auto appear in online list immediately without needing to manual refresh page.
- AC-06.7: Given that I am actively viewing the online list, When connected user(s) went offline, Then their username must immediately be gone from the online list without needing to manual refresh page.
  
- AC-07.1: When the connected user opens the webpage, they will be prompted to log in
- AC-07.2: After the connected user fills out the username and clicks Log-In, the client ensures that all required login fields are filled before continuing validation.
- AC-07.3: The client validates the inputted username (alpha-numeric characters only, not already in use) before forwarding it to the server
- AC-07.4: The server creates a new account in the database upon receiving the valid username
- AC-07.5: Upon a valid log-in, the user will be automatically redirected to the rest of the messaging system
- AC-07.6: The connected user can click a logout option while authenticated.
- AC-07.7: The system ends the connected user session and returns the connected user to the login page after logout.

##Sequence Diagrams:
#Modify Messages:
![](https://www.plantuml.com/plantuml/png/XLJDSjCm4BxxANPwQcTgfgN0WGDJnd3Wq5F82JWeqgOMo9BHhXlozcWJMOuRGpKJUoRp_Npx8zyJgyX3vs1DM3SgFMvkwuTWx7PVFo2HUiIgKff3XEEvQ8Btg1cDKE85A89rrISLgsslF2U4i-Zv0l8HH3D7h30-OPmXLbMrXle3DF0UjBFw5t2qlKCmWGc21yB4x8wHuDl7fhwvUtNx8uLpqzyRTC4_4d00vGEt664WZ2TmSMj6dzOQX131M58RXz19tLOhjialzFAY2XtXae4UOfH8OZ3A9jrrqgKsxE2piPnI6FY43Xb7lTFemfBu0XqjAiYdT8CINsTG9hy-5hBWYWabjPJ4MulEJBm5-M7J9UMXDuhH51xZ7pucp2b5-XHW2R3hULymizP6_8bwL8KQJ00VM8POmjnDOQJ72_e--FeV7glaaSKpuJA_lvXhyBZxcl9VpQtAMOqAf9wmL2uLoy368CIAXpAlDsSIkT9D3CfeHMSjl9HYCPOqrrduwhkN_NGEzE6YK4bv3OjUquYDfTwf_TcmTfRRCRRrHbOun8NaAL1LbORdnNnfyJ8igxqjQjCW8luUa1WuW9bfmZQ63dIhl4Tthb06yPncFMFqohdzOI3R4ALVXwj6OFqBYZby8jAU6BjnaZxmTBsvLGowVCj4EgSmpxyoxsObpoVn7uSvMrell-e-FOVELNy1)

#Login/Logout User:
![](https://www.plantuml.com/plantuml/png/bLHVRzCm47_FfpZr2QG6mK1CwWDQbuud9D2Yye9uy9nhQosnm_coic_FEN6yrLI8-I5owz-VtrbtllAiY8UkXQt7ibBoUNjPhWS-e6MZ5MCf1rGKIhCZcDQYSjQYPcm2YnQWF6oBNf4mJAyi2w8r8h20UGcYEaNKI0z89uYwQ1IhEmankcpYZyKJOdDT55ieFq6rWgyzMZZYNQ_sM5JXp-qAlf7hUeRMxOsLq2t35xS7sGU1cNbZ6Ga6YMvLX_1ZNKdHRzujOTfS_1pHLKH_LwsHNFX4U8M_ZMU_1DNs1rNQeKCoUWdMiLW5tEjPz68MVJ-9XaItk1SwAJRE2dxdg8jx3m_1R4Ic2FKAQhGDq7CQuQy1FOjDKe-h3fpDzGgg0-fxC3jGMhl1idWJgkOHflGpzKEY2WlAoV0MUI2Rc9uL3pxXGX7hUDGuzA7mIJL2yYJYomWMZqanpvq7a0xR6UeINeyIJQulu2gbFRaWFsYDtfyt2XSxzKjzSCVS13eXIbETPtnsT5JK0Bk8CtOF_j4pTec0hKTOdxts_wy0YHoz97_cz5SPQ9iYfVjN4ngRjU69stYMHunZ4rr6Xp1uRk2JoQjQe-_3TCh1pFielBpN8oBhyii9MKVaZG1rUed2T8ANaYLOJiYkEQfdBHB1gTW8pXpOJOyBX6Vd6JMKNLp9T-ZQuWy0)

#Show Online Users:
![](https://www.plantuml.com/plantuml/png/dP91ZzCm48Nl-HMZNXO4HR10At50Yt95ub3rW50FRZ99h7KyOJnkj_nw9Yb9b9G0meVKSjyRls_63q4CIwmTx0EkKwEVrvlr5--inxKUSLX_ja6In6H23DUrIibxp0HpQ2KhC07sIQE5R6ORuqKLpgAN5VHB5UbKiKC-8KyKkoJPm_eZfF0179LWlH3K60Bw4XdEU6nCYKdQQdQgOVmUCGXKL6Fx3nYV0tNP8RRPmRNPTwDUsE89GM6i_cG3nbMjrWjy-vHg2rwzERI-BandZEnlItSNPf5PMRjZiBuWherOyaEbbt3Tt1-I9EtvSXiQPoxJci7cU3GCQcPRLj8Tz7NU7aPtRVXnSh4tDSBPIWMhPryfFb_rhllEfRQzsa95vrkAsw3zHgzCZ9DPeo1p533yfjEWQvXWvcps27TFTt2C8cC_tXqwtS1IjOmZhl8lAV6fQHjU6-iXguo0OJGpyG0xT3WskMcZwvwYm2XFq0MSip5IW_vVuLxCuTvF8WyXPdmBOiOWn0YaQkkD6o7L-GFdjZdfycJLWJw_pj9uaWfvpkse361zLtby-AgrnMLGM0zuGZ_KtSm0J9wFhr5eET3cRyDQTlPpM-0e2GDGKRJsFyDGb2dDzcOSDPrm12gOwkLWs_z6slwQpeD-O-r-0W00)




## User Interface

Embed UI mockups or screenshots and describe the interaction model. Wireframes are acceptable for Sprint 1; final screenshots for Sprint 3. _(Sprint 1 onward.)_

### UC-07 Login/Logout User  

<img width="216" height="288" alt="image" src="https://github.com/user-attachments/assets/81e66b9f-047c-42ff-8016-aa216f49a7e5" />  

### UC-01 Send Message  

<img width="216" height="288" alt="image" src="https://github.com/user-attachments/assets/5059280d-96be-4a81-b9e8-abe9c8570540" />  


## Database

Describe your **MongoDB Atlas** schema: collections, fields, indexes, and relationships. Include a sample document for each collection. _(Sprint 2 onward; refine in Sprint 3.)_

```json
// collection: users
{
  "fullName": "Admin",
  "username": "user",
  "email": "user@mail.uc.edu",
  "phone": "5131234567",
  "password": "$2b..."
}

// collection: privchat
{

}

// collection: chat
{

}
```

---

# Security (SSDLC)

_Start in Sprint 0; **mandatory** updates at the Sprint 1–2 SSDLC checkpoint and again in Sprint 3._

This section documents how your team applies the **Secure Software Development Lifecycle** across every phase. Do **not** treat security as an afterthought — it is graded across all sprints.

Our team applies the Secure Software Development Lifecycle by treating security as a cross-cutting concern throughout the messenger application’s design, implementation, testing, and deployment. Since the app supports real-time public and private messaging, we focus on protecting user-generated content, preventing XSS, and enforcing secure server headers such as Content-Security-Policy. Security requirements are documented alongside functional requirements, and each sprint will include review of potential threats, code-level mitigations, and testing to make sure security is built into the application rather than added at the end.

## Security Requirements

List security requirements alongside functional requirements. _(Sprint 0.)_
* **SR-1:** All user-generated messages must be strictly output-encoded before render in the client interface to prevent execution of XSS.
  * Task: Implement a function that escape HTML to prevent XSS when rendering user content.
- **SR-2:** The system must strictly reject any incoming chat message that exceeds a certain characters (1k) at both client interface and the server API level.
  * Task: Include *.length* check in JavaScript code before process message
- **SR-3:** The web server must implement a strict Content-Security-Policy (CSP) HTTP header that restrict execution of scripts to the application's self origin, preventing execution of unauthorized scripts.
  * Task: Configure server's response headers.
## Threat Model

Identify assets, trust boundaries, and threats. STRIDE or attack-tree format is acceptable. _(Sprint 0–1.)_

>STRIDE Categories
>* Spoofing (pretending to be someone else)
>* Tampering (modifying data or code)
>* Repudiation (a user denying they performed an action)
>* Information Disclosure (exposing private data)
>* Denial of Service (crashing or flooding the system to block real users)
>* Elevation of Privilege (a normal user tricking the system into giving them admin access)

| Asset | Threat (Specific Attack) | STRIDE Category | Mitigation |
|-------|--------|-------|-----|
| User credentials | Credential stuffing | Spoofing | Rate limiting + bcrypt hashing |
| Web artifacts  | Cross-Site Scripting (XSS) | Tampering | CSP, input validation and output encoding     |
| Whole Application | DoS Tracffic Flooding | Denial of Service | Rate limiting (on our eventual server) to an appropriate amount of traffic (e.g. 50) for the Messenger application | 

## Security Review Notes

Summarize findings from your Sprint 2 security review and any remediation taken. _(Sprint 2 onward.)_

---

# Implementation

_Start in Sprint 1; keep updating._

Specify your development approach, languages, frameworks, and runtime. Default stack for this course:


### Sprint 1

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| Runtime          | Node.js (Azure Cloud Shell for development)     |
| Server framework | Express                         |
| Database         | None                                  |
| Client           | HTML / CSS / JavaScript / Bootstrap / jQuery  |
| Version control  | git + GitHub (branches + pull requests + code review) |
| Project mgmt     | GitHub Projects                                 |
| Hosting          | Azure App Services                              |
| CI/CD            | GitHub Actions                                  |



### End Result:

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| Runtime          | Node.js (Azure Cloud Shell for development)     |
| Server framework | Express                         |
| Database         | MongoDB Atlas                                   |
| Client           | HTML / CSS / JavaScript _(framework optional)_  |
| Version control  | git + GitHub (branches + pull requests + code review) |
| Project mgmt     | GitHub Projects                                 |
| Hosting          | Azure App Services                              |
| CI/CD            | GitHub Actions                                  |
| ...              | ...          |

For each sprint, add a subsection that summarizes new implementation work. Include code snippets only when they illustrate a non-trivial design decision (not as a substitute for the source code itself).

## Getting Started Locally

```bash
# Clone
git clone git@github.com:uc-se-sm26-team23/scrum-project.git
cd scrum-project

# Configure pull strategy (Rebase is recommended for a clean history)
git config pull.rebase true

# Install dependencies
npm install

# Configure environment (copy and edit; never commit .env)
cp .env.example .env

# Run
npm start
```

## CI/CD Pipeline

Describe the GitHub Actions workflow(s) under `.github/workflows/`. _(Sprint 1 onward.)_

- **Build & test:** triggered on every push and pull request.
- **Deploy:** triggered on merge to `main`; deploys to Azure App Services.

### Sprint 1

Describe: `.github/workflows/` includes a set of isntructions that tells what to do when an event triggers. Once triggered, Github Actions look inside `.github/workflows/` folder to find out what to do when a specific event triggers. 

- **Build & test:** triggered on every push and pull request.
  * Whenever a team memebr pushes code to 'sprint1' branch or any branches, to merge their code/work. Github's server recognize the action happend, then look into `.github/workflows/` folder to see if any left instructions for what to do to react to the action. After Github finds the  `.yml` file, opens it and starts reading it line by line from top to bottom. After finding the specific section to handle the action, it type  `npm` commands like  `npm install` and npm `npm run test` .
  * If this phase fails, Github Actions will report back with the any problem exist in the push code.

- **Deploy:** triggered on merge to `main`; deploys to Azure App Services.
  * In the `.yml` file, defined by `deploy` as a separate job that has its own set of roles, when **Deply** action is triggered.
  * A specific instruction is configed into  `.github/workflows/` to trigger when code is pushed or merged specifically into `main` branch, so this job configured to use Publish Profile that is set up in Azure Deployment Center which allows the Github Action log into Azure securely without needing to type a password every time. So when the trigger is met, the worrkflow perform:
      * It downloads `"node-app"` artifact that the `build` job created. during "Build & testing" phase.
      * It then executes command to upload code directly to the Azure APp Service.
  *  This result in our live website is instantly updated with new and merged code.

## Deployment

Describe how to deploy and the URL of the live application. Include a note on environment variables (set in Azure App Services Configuration, never in source). _(Sprint 1 onward.)_

### Process
The application itlitizes an automated CD pipeline managed by Gihub Actions, The deploymnet workflow is triggered whenever new code is merged or pushed to branches. During this process, the Github Actions runner completes by authenticating securely with Azure using the set Publish Profile secret, download the pre-built and tested code artifact generated during CI phase, then deploys the packaged application directly to Azure App Services.

### Live Application URL:
https://team23-uc-se-messenger.azurewebsites.net/

> Note: Environment variables are set securely within the **Azure App Services Configuration** panel. To maintain a secure software development practies, since storing sensitive environment variables into source code repository is illegal and should be publicly executed.

---

# Testing & Quality Assurance

Our testing and quality assurance was based on individual task completion. Before any commits were pushed to the sprint1 branch, each team member would test the functionality of the messenger locally to ensure that nothing had been broken by the new code. Then, upon push, we would alert all other members in the Discord to what had been added/changed, as well as other things that they may have noticed regarding another member's code. This would allow us to review eachothers changes and be aware of what exactly they do, as well as find bugs or code that may cause problems down the line. (_**major** focus in Sprint 3._)

In Sprint 1 we would test our changes as we were making them, then test the core functionality of the rest of the app before pushing changes.  

## Test Plan

Summarize your testing strategy across unit, integration, and system testing. _(Sprint 2 onward.)_

## Test Coverage

Report current test coverage and how to run the suite locally and in CI.

```bash
npm test
```

## QA Plan

Manual test cases for user-facing flows, with expected vs. actual results. _(Sprint 3.)_

---

# GenAI Usage & Reflection

_Start in Sprint 2; **required** in Sprint 3._

Per the course academic integrity policy, the team must document all AI-assisted work on the team project. **Sprint 3 recommends the team to use a GenAI tool** for the final prototype and to document each substantive prompt.

---

# Software Process Management

_Start in Sprint 0; keep updating._

_Describe how your team applies **Scrum**: roles, ceremonies (sprint planning, daily stand-ups, review, retrospective), and tools (GitHub Projects board, GitHub Issues, pull requests)._

_Include:_
_- A screenshot of the **GitHub Projects board** (Todo / In Progress / Done) at the end of each sprint._
_- A **Roadmap view** screenshot from GitHub Projects, or a timeline produced from issue milestones. (Note: GitHub Projects has a Roadmap view rather than a true Gantt chart; a Roadmap screenshot satisfies this requirement.)_

### Scrum Application
Our team applies scrum extensively through the development of this application, but with a handful of modifications to account for the some of the challenges we face as students. For example, we don't strictly implement scrum roles, which means everyone in the team shares product owner, scrum master, and normal development responsibilities. This gives everyone the ability to gain a little bit of experience with each responsibility, and also allows flexibility for people to focus on what they feel is most important at a given point of time. If there's a point that one of us feels needs discussed, it will be shared via a Discord server that we're all members of, then everyone will contribute their thoughts on the point and a decision will be reached. As for ceremonies, we decided to modify how we participate in the ceremonies to take everyone's different schedules into account. Most ceremonies happen asynchronously on our Discord server, including sprint planning, daily stand-ups, review, and retrospective. Sprint planning will occur before each sprint starts where we use the course requirements and the use cases of our application designed in Sprint 0 to decide what the goals for the upcoming sprint are. Instead of strict daily stand-ups, our team members will send a message in the Discord server whenever they're about to work on something, and a quick summarizing message at the end when they've finished, including any issues they may have run into. Although not everyone participates in these every day (again, due to the varying schedules), this serves the same purpose as daily stand-ups due in an ordinary application of scrum. Sprint reviews are conducted as required, and usually in tandem with retrospectives where in total we accumulate all of our contributions to the repositories and project boards, and reflect on what went well, what could've been better, and what we want to improve for next sprint. These also occur asynchronously, where we require each member of the team to submit their information and reflections before recording final thoughts. Regardless of asynchronous meetings, we all meet regularly at lab time on Thursdays and often use the time to discuss trajectory, obstacles, and other important points that would be usually discusses in one of these ceremonies. 

### Tools used
Our team uses a variety of tools to manage the project and organize our code changes. Git and GitHub are used or version control. We use a GitHub Projects Board to organize our project management. We started with several tickets modeling our Personas and Scenarios, and used those to develop Use Cases which we turn into PBIs. Within each Use Case, we develop Acceptance Criteria and Sequence Diagrams, and we assign one Use Case per developer / team member to be completed (usually in whole, sometimes in part) in a sprint (with the option of assisting others). And GitHub pull requests are also utilized at the end of each sprint for merging changes and performing code reviews. 

### Roadmap view
<img width="1646" height="383" alt="image" src="https://github.com/user-attachments/assets/f897cb3e-e411-414c-b4a2-2a503522e0bb" />

## Scrum Process

> Copy the block below for each sprint (Sprint 0, 1, 2, 3).

### Sprint 0

**Duration:** 2026-05-27 to 2026-06-16

#### Sprint Goal
Get comfortable with environment and tools, learn agile and scrum process and documentation procedures, create UC, Sequence diagrams, user stories etc to guide rest of messenger app project

#### Completed PBIs / Tasks (all below are done)
1. ALL - Add your name to the project homepage	https://github.com/uc-se-sm26-team23/scrum-project/issues/5
2. MArcus - Create a Github Project board for Scrum Team Planning	https://github.com/uc-se-sm26-team23/scrum-project/issues/1
3. Jai/Connor - Create public repository	https://github.com/uc-se-sm26-team23/uc-se-sm26-team23.github.io/issues/1
4. Luke - Create Private Repository	https://github.com/uc-se-sm26-team23/scrum-project/issues/2
5. Akul - Copy README.md template from course repository	https://github.com/uc-se-sm26-team23/scrum-project/issues/6
6. Jai - Copy index.html template from course repository	https://github.com/uc-se-sm26-team23/uc-se-sm26-team23.github.io/issues/2
7. ALL - Change Fields in Project Board	https://github.com/uc-se-sm26-team23/scrum-project/issues/4
8. ALL - Edit README.md with your information	https://github.com/uc-se-sm26-team23/scrum-project/issues/7
9. ALL - [M3 S0 2/4] Prioritize Use Cases for Sprint 1	https://github.com/uc-se-sm26-team23/scrum-project/issues/34
10. Connor/Luke/Marcus - [M3 3/5] Design and Implement UI for two use cases	https://github.com/uc-se-sm26-team23/scrum-project/issues/29
11. All - [M3 S0 1/4] All teamwork tasks are done, verify homepage is good	https://github.com/uc-se-sm26-team23/uc-se-sm26-team23.github.io/issues/4
12. Connor/Marcus - [M3 S0 4/4] Create sprint1 branch	https://github.com/uc-se-sm26-team23/scrum-project/issues/36
13. Jai - [M3 5/5] Update # Security in README	https://github.com/uc-se-sm26-team23/scrum-project/issues/33
14. Marcus/Akul - [M3 2/5] Sequence diagrams for two use cases	https://github.com/uc-se-sm26-team23/scrum-project/issues/30
15. ALL -[M3 1/5] AC list for all use cases	https://github.com/uc-se-sm26-team23/scrum-project/issues/31
16. ALL - M3 Pre-Task Discussion: Review Use Cases	https://github.com/uc-se-sm26-team23/scrum-project/issues/37
17. ALL - Plan and develop UI/UC/task distribution etc (not listed)

#### Contributions

| Member | Hours | Contribution Summary |
|--------|-------|----------------------|
| Marcus Nguyen | 10 | Across module 1–3, my key contributions focused on project setup, requirements development, use-case design, documentation, and implementation support. In module 1, I created the team organization, added teammates and the professor, set up the project board, added features, created PBIs for tasks, and updated the README and index.html with team member names, roles, and emails. In module 2, I created use cases for Modify Message, React Message, and Type Indicator, developed personas for the Student and Instructor roles, and updated the README with use cases and functional requirements. In module 3, I created PlantUML diagrams for the Modify Message and Login/Logout User use cases, wrote the in_out.html and in_out.js files for user authentication and username collection, and commented on PBIs to update their status and provide suggestions. |
| Luke Falanga | 10 | For the module 1 work, I added my name, role, and email information to README.md and index.html. For module 2 work I created Use-Case PBIs for Navigate Channels, Send Message, and Receive Message. I also created a scenario for notification priority. For module 3 I created a PBI for discussion that needed to take place before working on the project task, as we needed to decide how to divide work and refine our existing Use-Cases. I also created the acceptance criteria for the "Create Channel" Use-Case. I then updated the README with the proper functional requirements, as well as our team addition of Channels (public, private, and group chats). I then created the src directory and the SendMessage.js and send_message.html chatbox UI. I then reconfigured SendMessage.js to connect with the Authentication UI that Marcus created to show the username for each message. I then finally commented on PBI's regarding completing acceptance criteria and UI to indicate my individual task completion. |
| Connor Slutsky | 10 | In Module 1, I contributed to adding my name/contact info to the README.md. In Module 2, I created a couple Use Cases (Send Urgent Notification, See New/Unread Messages, both of which got fused with other UCs or dropped in M3), polished the Sick Student scenario, and updated the project description on the homepage. And in Module 3, I contributed towards filtering through our existing Use Cases (particularly Receive Message, Create Channel, and deleting Request Friend), polishing up the remaining Use Cases (Modify Message and Log In/Out User), and helping some of the others with little tasks, such as making contributions to the README (UI Design and STRIDE analysis) and creating the sprint1 branch. For M3 I also created tasks pertaining to the goals of M3 in the Project Board to help organize lab time. |
| Akul Jha | 10 | Across milestones 1 through 3, I focused on core requirements engineering, documentation, and architecture setup. In the initial phases, I initialized the repository's documentation by adding the project overview, foundational functional requirements, and non-functional requirements (security, usability, reliability), while establishing initial use cases for managing requests, creating group chats, and blocking users. In the final milestone, I refined the messaging and channel navigation use cases, integrated overlapping details into unified requirements, mapped out sequence and PlantUML architecture diagrams, and fully documented the team's sprint retrospectives.I also polished and added submission requirements into README|
| Ong Jai Sheng | 10 | For Module 1, for public repo I updated the team name, my personla information (name, role and etc.) update the repo link to able to redirect and keep footer oage up-to-date. For Private repo, I add personal info and included the right number of team members for our team. For Module 2, I updated the Use Case Model, included Scenarios 1 [Sick Student], 2 [Student Coordinate Team Meeting], 3[Instructor Send Announcement] and 4 [1 on 1 Chat]. For public repo, I updated project title and last revision date, updated Scrum Project Title and included Use Cases into Use Case Table. Lastly for Module 3, for the project board, I included Use-Case-06: Show Online User(s) w/ Brief description, User Stories, Acceptance Criteria, Use-Case-01: Send Message w/ Acceptance Criteria and Use-Case-02: Receive Message w/ Acceptance Criteria. For the homepage (index html) page, I updated the latest updated date footer. Then for the README file, I added the Security Section: Security Requirement Items. |

#### Sprint Retrospective

| Good | Could have been better | How to improve |
|------|------------------------|----------------|
|   Task completion   |       Communication               |        Using Discord, frequent meetings and updates      |
|   Team Dynamics   |        Organizing our goals and requirements                |     Spend time to discuss clear guidelines/expectations           |

Working through the sprints is a continuous-improvement process. The retrospective happens at the end of a sprint, before planning the next one. Cover three things briefly:

- **What went well** — celebrate and reinforce.
-  Good teamwork dynamics leading to timely and productive contributions to deadlines
- starting to have effective communication and open discussions for efficient tackling of tasks
- **What could have been better** — be specific (e.g., "we underestimated authentication" not "things were hard").
- Being organized and prepared for expectations for the final product. This applies to being categorical of our UC in the first meeting, thinking of project demands and minimum requirements before leaping in to suggest a final product, and effectively distributing task evenly.
- **How we will improve next sprint** — concrete, owned actions.
- We will meet twice weekly and update our goals/todo and expectations via discord frequently

Keep it under an hour. The output is bullet points in the table above and any new PBIs created on the board.

## Sprint 1

**Duration:** 2026-06-17 to 2026-07-08

### Requirements Engineering

#### Persona 1: Bob (Student User)
- Role: Graduate Student | Major: Computer Science
- Uses Slack and Discord daily for managing multiple project teams
- Goal: organize and manage multiple project teams without switching between tools
- Frustration: hard to track who responded to what; conversations get buried in long threads
- Tech Level: Advanced — comfortable with APIs, reads documentation, uses keyboard shortcuts
- Suggested features: private messages, real-time chat responses, notifications

**Scenario:**
Bob is working on his team project and needs to ask a quick question to a team member, as he may need to interact with their code. However, he does not want this message to be broadcast to the whole class. So Bob needs to move the conversation to a private chat room to avoid leaking privacy. Bob needs to send private message to his team member to discuss the project

**User Stories:**
- As a connected user, I want to be able to easily access private 1-on-1 messages with another user.
- As a connected user, I want to be able to send and receive messages in private chats the same way as in public chat 
- As a connected user, I want 1-on-1 chats to be visually separated from the public chat. 
- As a connected user, I want my private chats with another user to persist, even if I switch to private chat with another user before coming back. 
- As a connected user, I want to be able to private chat with myself in case I want to keep notes in the messenger. 


#### Persona 2: Prof. Davis (Instructor)
- Role: Faculty | Department: Engineering
- Uses email and Canvas daily for class communication
- Goal: broadcast announcements to an entire class and receive student questions in one place
- Frustration: students message on five different platforms; no single channel for official communication
- Tech Level: Beginner — prefers simple UI, avoids anything that requires setup or account configuration
- Suggested features: public chat rooms, notification preferences, real-time typing status
  
**Scenario: Instructor Sends Announcement**
Instructor is chilling at home during weekend, but then he receive an email on misleading information on an assignment guidelines. To avoid getting thousands of student's complains on email. He needs to open an app and send a message on the urgent correction on the assignment to public group chat for students taking his course.

**User Stories:**
- As a user, I want to send a text message to the public chat room so that I can communicate with the entire class in real time.
- As a user, I want my name to be attached to my message so all other users know who sent it.
- As a user, I want to see real-time typing status so that I know someone is responding.

#### Persona 3: Team Leader Michael
 - Role: Team Leader at a professional establishment
 - Uses email daily and exclusively (we will pretend MS Teams doesn't exist)
 - Goal: Have one destination to organize announcements, agendas, plans, etc.
 - Frustration: Due to excessive messaging for business purposes, people tend to miss emails
 - Tech Level: Intermediate - but different people at the company have different levels of technical experience
 - Suggested features: public messaging, private messaging, ability to edit/delete existing messages, notifications

**Scenario:**
Michael is sending an announcement about an important meeting that he wants the entire team to go to. He enters the meeting details and sends it in the public chat that everyone in his team has access to. Right as he presses Enter, he notices that he mistyped the date! But it's too late, and everyone has received the notification of a new message. He quickly navigates to the message options, selects the option to edit the message, and retypes the meeting information to the correct date before clicking submit. The edited message is broadcast to the other team members, and as they are logging on to read the new message, they see the correct date, not the originally mistyped-date.

**User Stories:**
- As a connected user, I want to change the content of a message I already sent so that I can correct mistakes or update my message. 
- As a connected user, I want to delete a message I already sent so that I can remove it from a channel.
- As a connected user, I want modification options to appear only on my own messages so that I cannot edit, or delete another user's message. 

#### Sprint Goal
Complete the functional requirements and use-case acceptance criteria to implement a working prototype of the web-based messenger application.

#### Completed PBIs / Tasks
1. UC-01: Send Message
2. UC-02: Receive Message
3. UC-03: Modify Message
4. UC-04: Communicate Privately
5. UC-06: Show Online Users
6. UC-07: Login/Logout User

#### Contributions

| Member | Hours | Contribution Summary |
|--------|-------|----------------------|
| Marcus Nguyen | 14 | I implemented the login page (without the credentials) and connected it to the message UI. Add security layers and constraints to the username input. Created "Joint chat" and "Authorize User" UCs for sprint 2. Fix duplicate and disable type indicator for my-self private chat. I also updated the Security (SSDL) under README. |
| Luke Falanga | 14 | I implemented sockets and typing indicators to complete the Send Message Use-Case. I also implemented private chat, which will persist if you switch to a different private chat, that way you can remember all private conversations. Added accessibility to this feature via clicking a name in the user list. I also reviewed other members' code and gave suggestions for implementation. I updated the Private Chat use-case and Send Message use-caase for completion as well.  |
| Connor Slutsky | 14 | I completed all the development for UC-03 Modify Message, added paragraphs for scrum applications, tools used, and post a picture of the GitHub roadmap. Added images of the Project Board for Sprint 1, a quick blurb of how testing in Sprint 1 worked, and an update for our Implementation in our README as well.  |
| Akul Jha | 14 | I reorganized and structured files so that server points to correct directory; made all files within same folder so they can access each other as designed; removed files that are duplicates to maintain spa and 1 css file. ALso did some UI for side collapsable panel that shows the curent online users and appends (You) in front of currentuser (UC show online users). I made 3 color palletes to try different chat UI looks and themes. |
| Ong Jai Sheng | 14 | I keep our homepage up-to-date w/ requirements, set up Azure App deployment, implement notification feature and making sure User-Case 02: Receive Message is fully implemented, include Bootstrap’s CSS and JS and allow CSP to laod Bootstrap and jQuery, fix error on different user but same username display (You), modify Typing Indicator w/ reference introduced in lecture video, disconnect testing branch Azure deployment and testing branch from github to avoid confusion., included Missing STRIDE category for each threat model on report where we got deducted points, add temporary session restore when reload page when log in.  |

#### Sprint Retrospective

| Good | Could have been better | How to improve |
|------|------------------------|----------------|
| Communication | Merge Conflict Resolution  | Test code after every small change |
| Task Completion | Messy Code  | Analyze Functions/Variables for Reusability |
| Debugging  | Visual Expectations of UI | Discuss Visual Expectations more Clearly |

**What went well**
  - Communication of task work, everybody was on the same page
  - When a task was being worked on, the team member completing the task would notify others of what they were working on, the final product of what they had worked on, and any other issues they may have noticed when working on their task
  - All tasks were completed as designated on the PBI board
  - All members contributed as expected
  - Bugs were noticed and fixed before any other major implementation

**What could have been better**
  - There were a few times that merge conflicts that arose when pushing changes were not resolved correctly and then not tested, which broke some aspect of the code
  - Code is somewhat messy as each member worked on different implementations, so some values (such as username) are assigned to different local variables instead of every function using the same global variable
  - UI visuals were not discussed very well since we prioritized understanding functionality, so there were moments where team members were unclear of what to expect from different visual implementation. This led to members having the desire to modify UI that was already implemented to be more up to what they had in mind, when the original member working on the UI could have easily implemented an agreed upon visual expectation while they were working on it.

**How we will improve next sprint**
  - Test changes on the web preview after every single change before pushing to make sure no code breaks any functionality already implemented
  - When working on code, we will analyze other functions and existing variables to see if we could use them in the implementation we are currently working on (this will help clean up the code and condense everything to be far more readable)
  - When working on similar aspects of code, (i.e., the private and public chat) we will use the same functions for both, using a switch statement based on private/public chat
  - We will discuss the visual expectations of UI before implementing them, that way everybody is clear of what to expect visually

Keep it under an hour. The output is bullet points in the table above and any new PBIs created on the board.


### Sprint 2

**Duration:** 2026-07-10 to 2026-07-30

#### Sprint Goal
Users need to log in with a username/password stored in a database. An invalid username/password cannot log in. Connected users can register for a new account with more fields (retype password, email, full name, etc.) in addition to username/password. (only logged in users can send/recieve messages, logout, change/edit profule, view chat history)

Feature of our team's choice: Forgot password using OTP/Email, enable notifications.

#### Completed PBIs / Tasks
1. Use-Case-8: Authenticated Join Chat
2. Use-Case-9: Authorize User
3. Use-Case-3: Modify Message
4. Use-Case-12: Retrieve Messages
5. Use-Case-13: Edit Profile Info
6. Use-Case-14: Forgot Password


#### Contributions

| Member | Hours | Contribution Summary |
|--------|-------|----------------------|
| Marcus Ngyuyen| X | TODO |
| Luke Falanga | X | TODO |
| Connor Slutsky | X | TODO |
| Akul Jha | X | TODO |
| Jai Ong Sheng | X | TODO |

#### Sprint Retrospective

| Good | Could have been better | How to improve |
|------|------------------------|----------------|
|      |                        |                |
|      |                        |                |


Working through the sprints is a continuous-improvement process. The retrospective happens at the end of a sprint, before planning the next one. Cover three things briefly:

- **What went well** — celebrate and reinforce.
- **What could have been better** — be specific (e.g., "we underestimated authentication" not "things were hard").
- **How we will improve next sprint** — concrete, owned actions.

Keep it under an hour. The output is bullet points in the table above and any new PBIs created on the board.


---

# User Guide / Demo

_Start in Sprint 1; finalize in Sprint 3._

Write this section as both a **demo** (with screenshots of the running application) and a **how-to** for a first-time user. Cover sign-up, login, and the main user flows.

Enter a unique username and click Join to access the public chat. Enter messages into the textbox and click Send to send a message to every logged-in user. Click the User List button to view a list of currently logged-in users, and click any of their names to start a private chat with them. Press the allow notifications popup to allow notifications to appear for new messages when the Messenger application is minimized. Hover over your messages in the public chat and press the message options button (three dots) to open a menu to edit or delete past messages. 

Refer to demo video on [homepage](https://uc-se-sm26-team23.github.io/)

---

# License & Code of Conduct

This project is developed for academic purposes as part of EECE/CS-3093C at the University of Cincinnati. The team follows the **ACM/IEEE Software Engineering Code of Ethics** (https://www.acm.org/code-of-ethics).

If your team chooses to publish the repository after the course, add an explicit license (e.g., MIT) here and a `LICENSE` file at the repo root.

---

_End of template. Last template revision: 2026-07-09._
