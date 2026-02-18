# IvyBot: Ivy Tech Student Chatbot

This project is forked from the SDEV 265 FA24 Blue Team's original repository and enhances the IvyBot chatbot to serve as a reliable, go-to resource for Ivy Tech students and staff. Our improvements focus on accessibility, usability, and expanded functionality, making it easier for users to access campus information while providing valuable tools for developers and contributors.

## Key Features
- **Multilingual Support**: Added Filipino language for broader accessibility.
- **Conversation Logging**: Automatically logs user conversations and unanswered inquiries for analysis and future improvements.
- **Improved UI/UX**: Enhanced user interface with a more intuitive design, suggested prompts, and responsive layout.
- **Expanded Database**: Updated knowledge base to include more comprehensive information on campus resources, classes, financial aid, tutoring, and website navigation.

## Installation
*Credits to the Blue Team for the foundational setup.*

These instructions guide you through a local installation for testing and demonstration. For a web-hosted deployment, additional configuration (e.g., server setup) is required—consult with your team or instructor.

### Prerequisites
- **Node.js**: Download and install from [nodejs.org](https://nodejs.org). Node.js is required for NPM (Node Package Manager) to handle dependencies.

### Steps
1. **Clone the Repository**:  
   Open your terminal, navigate to your desired directory, and run:  
   ```
   git clone https://github.com/rohydro93/SoIT_ChatBot_BrownTeam.git your-repository-name
   ```  
   Replace `your-repository-name` with the name of your local folder (e.g., `IvyBot`).

2. **Navigate to the Project Directory**:  
   ```
   cd your-repository-name
   ```  
   Replace `your-repository-name` with the folder name from Step 1.

3. **Install Dependencies**:  
   Install the required Node.js packages from `package.json`:  
   ```
   npm install
   ```

4. **Start the Server**:  
   Launch the application:  
   ```
   npm start
   ```

5. **Access the Chatbot**:  
   Open a web browser and visit [http://localhost:3030](http://localhost:3030) to interact with IvyBot.

If you encounter issues, check your Node.js installation or reach out for assistance. Common troubleshooting: Ensure ports are free and dependencies are up-to-date.

## User Guide
*Credits to the Blue Team for the core interaction guidelines.*

IvyBot is designed for simple, natural-language conversations. Here's how to get started:

1. **Open a Web Browser**:  
   Use any modern browser like Chrome, Firefox, or Safari.

2. **Navigate to the Chatbot**:  
   Go to [http://localhost:3030](http://localhost:3030) (or the hosted URL if deployed).

3. **Start Chatting**:  
   - Type your question in the input field at the bottom (e.g., "How do I apply for financial aid?").  
   - Press Enter to send.  
   - The chatbot will respond with helpful information, drawing from its expanded database.

4. **Tips for Better Interactions**:  
   - Use suggested prompts for quick access to common topics.  
   - If the response isn't clear, rephrase your question.  
   - Conversations are logged for quality improvement—feel free to explore!

Enjoy seamless access to Ivy Tech resources. For advanced queries, the chatbot may suggest contacting staff.

## Technologies Used
- **Node.js**: Core runtime for the server-side application.
- **Bootstrap**: For responsive layouts, grid systems, and icons.
- **Google Fonts**: Custom fonts to enhance readability and design.
- **Visual Studio Code (VS Code)**: Primary IDE for development.
- **Google Chrome**: Testing and debugging the web interface.
- **Git**: Version control system.
- **GitHub**: Remote repository hosting.
- **VS Code Extensions**:  
  - Live Server: For previewing HTML/CSS changes.  
  - Project Manager (or similar): For visualizing folder structures.

## Credits
- Original Creators: [SDEV 265 FA24 Blue Team](https://github.com/LiongsonEnzo/SoIT_ChatBot)
- Additional Enhancements: [SDEV 265 FA25 BrownTeam](https://github.com/rohydro93/SoIT_ChatBot_BrownTeam)
- Additional Enhamcements (this repository): [SDEV 265 SP26 Green Team](https://github.com/KippWade/SoIT_ChatBot_GreenTeamSp26)

## Contributing
We welcome contributions! Fork the repository, make your changes, and submit a pull request. Focus on bug fixes, feature enhancements, or database expansions. Please follow standard GitHub workflows.

## License
This project is licensed under the MIT License—see the [LICENSE](LICENSE) file for details (add one if not present).

## Contact
For questions or feedback, reach out via GitHub issues or contact the Brown Team leads.
