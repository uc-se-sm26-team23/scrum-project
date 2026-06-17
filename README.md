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

> Replace **"TODO: Your Project Name"** with the title of your team's secure web application.

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
| Team homepage / landing page | uc-se-sm26-team23.github.io |
| Live prototype (Azure App Services) | https://TODO.azurewebsites.net |
| GitHub Projects board (private) | https://github.com/orgs/uc-se-sm26-team23/projects/1 |
| Source code repository (private) | https://github.com/uc-se-sm26-team23/scrum-project |
| MongoDB Atlas cluster (configuration only — no credentials) | _e.g., cluster name, region_ |

## Revision History

| Date       | Version | Description                          | Author |
|------------|---------|--------------------------------------|--------|
| 05/28/2026 | 0.1     | Initial draft (Sprint 0)             | ALL   |
| 06/04/2026 | 0.2     | Added use cases and architecture     | ALL   |

---

# Overview

_Start in Sprint 0; refine across all sprints._

Describe the project in 2–4 paragraphs: the problem it addresses, the target users, and a high-level summary of the proposed solution. Include a **high-level architecture diagram** 

The project is a messaging app with secure privacy features, private and group chat functionality. It will allow securechats for real time communications with seamless channel navigation whilsts showing online available users. It is intended for users of all age and audience that are able to access internet, though user stories largely target a student-professor dynamic.

*High level architecture diagram currently provided in SYstems Design Section
---

# System Analysis

_Start in Sprint 0; keep updating._

## User Requirements

List the high-level functional and non-functional requirements. These will be refined into user stories and use cases. _(Main focus of Sprint 0.)_

- **FR-1:** Users can login with only their username (Password implementation to be added later)
- **FR-2:** A logged-in user can send and receive public chat messages in real-time in the public channel
- **FR-3:** A logged-in user can view the list of all logged-in users
- **FR-4:** A logged-in user can send and receive private 1:1 messages to/from another logged-in user in a private channel
- **FR-5:** A logged-in user can create and join private group channels with multiple other logged-in users.
- **NFR-1 (Performance):** Minimal load time to see chat app, with high chat character limit and high group member limit
- **NFR-2 (Usability):** Chat login and viewing of unread messages is readily available with seamless UI
- **NFR-3 (Security — see §Security):** As a User, I want to be able to login securely and maintain secure access to my chats

## User Stories & Product Backlog

Team 23 Project Board Link: https://github.com/orgs/uc-se-sm26-team23/projects/1

Link to your **GitHub Projects board** (above) and include a representative screenshot of the **Todo / In Progress / Done** columns at the end of each sprint. _(Sprint 0 onward.)_

### Sprint 0
- *to be updated w/ screenshots*
<img width="1000" height="717" alt="image" src="https://github.com/user-attachments/assets/c633ef63-b754-4937-ad9e-6fce7b9871b9" />
<img width="210" height="632" alt="image" src="https://github.com/user-attachments/assets/91ff42b4-6770-45db-bd2c-2e7a5a669411" />

### Sprint 1
- *to be updated w/ screenshots*

### Sprint 2
- *to be updated w/ screenshots*

### Sprint 3
- *to be updated w/ screenshots*
## Use Cases

Include the **use-case diagram** and a **brief description** (1–3 sentences) for each use case. _(Main focus of Sprint 0.)_

### Brief Description for each Use Cases

| UC ID | Use Case            | Primary Actor | Brief Description |
|-------|---------------------|---------------|-------------------|
| UC-01 | Send Messege | Connected User | Actor types a message and clicks Send; system receives the message and delivers it in real time to all connected users. |
| UC-02 | Receive Messege | Connected User | Users receive messages from the channels that they are in |
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

[![](https://img.plantuml.biz/plantuml/svg/RP9DImCn48Rl-HL3Uz63OlLW4H5tktfR4RRYfI3JtN4tDisKoTHF_EzcFr0fJIx9coVll65o7HH5jsi7EOL0lYPvIgHih5AfMo5Z73qhA8FOkb6ehCG3ozwOiB9-Wu9hQ2NqjIFuCW0fIqLIw4VSLnWQgdx56JiM64-xqQfOhchXhQ_w4nNq8NgIL_Fzhu3dQl3UkJ2-cIRJqvFT0kdq_FGaYUejUnsqITBEGIli9y7aB1OnoZLfGzBv_xra177Cd8rHsjK8C0pRbDyx5lfOerJuBP0i_456OQMyEUpWR2-Iyz8wwebyBp77fIFjYNaaljkGFJHhKA4WUUt0Hrf2ijauMsBRa8Mt7kuYT_mIOE5X6wol8N2v8Zsst1iMncHmUNHq1GLSm3gs76iA9j-ZpVTeGuuC5PSOA9OvU8YfOviL8IWBLMtf62HdNtEMGg8Em_2QUsEAtlG-chPtZ37NvAlu_Nu0)](https://editor.plantuml.com/uml/RP9DImCn48Rl-HL3Uz63OlLW4H5tktfR4RRYfI3JtN4tDisKoTHF_EzcFr0fJIx9coVll65o7HH5jsi7EOL0lYPvIgHih5AfMo5Z73qhA8FOkb6ehCG3ozwOiB9-Wu9hQ2NqjIFuCW0fIqLIw4VSLnWQgdx56JiM64-xqQfOhchXhQ_w4nNq8NgIL_Fzhu3dQl3UkJ2-cIRJqvFT0kdq_FGaYUejUnsqITBEGIli9y7aB1OnoZLfGzBv_xra177Cd8rHsjK8C0pRbDyx5lfOerJuBP0i_456OQMyEUpWR2-Iyz8wwebyBp77fIFjYNaaljkGFJHhKA4WUUt0Hrf2ijauMsBRa8Mt7kuYT_mIOE5X6wol8N2v8Zsst1iMncHmUNHq1GLSm3gs76iA9j-ZpVTeGuuC5PSOA9OvU8YfOviL8IWBLMtf62HdNtEMGg8Em_2QUsEAtlG-chPtZ37NvAlu_Nu0)

## Use-Case Realization

For each use case in §Use Cases, describe how it is realized in code: which modules, endpoints, and database collections participate. **Sequence diagrams** are encouraged for non-trivial flows (e.g., authentication, message send/receive). _(Sprint 1 onward.)_

  #Acceptance Criterias
  
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




## User Interface

Embed UI mockups or screenshots and describe the interaction model. Wireframes are acceptable for Sprint 1; final screenshots for Sprint 3. _(Sprint 1 onward.)_

### UC-07 Login/Logout User  

<img width="216" height="288" alt="image" src="https://github.com/user-attachments/assets/81e66b9f-047c-42ff-8016-aa216f49a7e5" />  

### UC-01 Send Message  

<img width="216" height="288" alt="image" src="https://github.com/user-attachments/assets/5059280d-96be-4a81-b9e8-abe9c8570540" />  


## Database

Describe your **MongoDB Atlas** schema: collections, fields, indexes, and relationships. Include a sample document for each collection. _(Sprint 2 onward; refine in Sprint 3.)_

```json
// Example collection: users
{
  "_id": "ObjectId",
  "username": "string (unique, indexed)",
  "passwordHash": "string (bcrypt)",
  "createdAt": "ISODate"
}
```

---

# Security (SSDLC)

_Start in Sprint 0; **mandatory** updates at the Sprint 1–2 SSDLC checkpoint and again in Sprint 3._

This section documents how your team applies the **Secure Software Development Lifecycle** across every phase. Do **not** treat security as an afterthought — it is graded across all sprints.

## Security Requirements

List security requirements alongside functional requirements. _(Sprint 0.)_
* **SR-1:** All user-generated messages must be strictly outoyt-encoded before redener in the client interface to prevent execution of XSS.
  * Task: Implement a function that escape HTML to prevent XSS when rendering user content.
- **SR-2:** The system must strictly reject any incoming chat message that exceeds a certain characters (1k) at both client interface and the server API level.
  * Task: Include *.length* check in JavaScript code before process message
- **SR-3:** The web server must implement a strict Content-Security-Policy (CSP) HTTP header that restrict execution of scripts to the application's self origin, preventing execution of unauthorized scripts.
  * Task: Configure server's response headers.
## Threat Model

Identify assets, trust boundaries, and threats. STRIDE or attack-tree format is acceptable. _(Sprint 0–1.)_

| Asset | Threat | Mitigation |
|-------|--------|------------|
| User credentials | Credential stuffing | Rate limiting + bcrypt |
| Web artifacts  | XSS (Tampering)   | CSP, input validation       |
| Whole Application | DoS | Rate limiting (on our eventual server) to an appropriate amount of traffic (e.g. 50) for the Messenger application | 

## Security Review Notes

Summarize findings from your Sprint 2 security review and any remediation taken. _(Sprint 2 onward.)_

---

# Implementation

_Start in Sprint 1; keep updating._

Specify your development approach, languages, frameworks, and runtime. Default stack for this course:

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| Runtime          | Node.js (Azure Cloud Shell for development)     |
| Server framework | TODO _(e.g., Express)_                          |
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
git clone git@github.com:TODO/TODO.git
cd TODO

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

## Deployment

Describe how to deploy and the URL of the live application. Include a note on environment variables (set in Azure App Services Configuration, never in source). _(Sprint 1 onward.)_

---

# Testing & Quality Assurance

_Start in Sprint 1; **major** focus in Sprint 3._

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

Describe how your team applies **Scrum**: roles, ceremonies (sprint planning, daily stand-ups, review, retrospective), and tools (GitHub Projects board, GitHub Issues, pull requests).

Include:
- A screenshot of the **GitHub Projects board** (Todo / In Progress / Done) at the end of each sprint.
- A **Roadmap view** screenshot from GitHub Projects, or a timeline produced from issue milestones. _(Note: GitHub Projects has a Roadmap view rather than a true Gantt chart; a Roadmap screenshot satisfies this requirement.)_

## Scrum Process

> Copy the block below for each sprint (Sprint 0, 1, 2, 3).

### Sprint 0

**Duration:** YYYY-MM-DD to YYYY-MM-DD

#### Sprint Goal
TODO — one sentence.

#### Completed PBIs / Tasks
1. TODO
2. TODO
3. TODO

#### Contributions

| Member | Hours | Contribution Summary |
|--------|-------|----------------------|
| Marcus Nguyen | 9 | TODO |
| Member 2 | X | TODO |
| Member 3 | X | TODO |
| Member 4 | X | TODO |
| Member 5 | X | TODO |

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

---

# License & Code of Conduct

This project is developed for academic purposes as part of EECE/CS-3093C at the University of Cincinnati. The team follows the **ACM/IEEE Software Engineering Code of Ethics** (https://www.acm.org/code-of-ethics).

If your team chooses to publish the repository after the course, add an explicit license (e.g., MIT) here and a `LICENSE` file at the repo root.

---

_End of template. Last template revision: 2026-06-04._
