const responses = [
     {
        intent: "greetings",
        pattern: [
            "hello", "hi", "hey", "greetings", 
            "good morning", "good afternoon", "good evening", 
            "howdy", "what's up"
        ],
        reply: "Hi there! What can I help you with today?",
        filipino_reply: "Mabuhay! Paano kita matutulungan ngayon?",
    },
    {
        intent: "bot_status",
        pattern: ["how are you", "how's it going", "how are you doing", "are you doing great"],
        reply: "Doing great! I'm excited to help you find the information you require!",
        filipino_reply: "Ayos lang! Excited akong tulungan ka na mahanap ang impormasyong kailangan mo!"
    },
    {
        intent: "bot_identity",
        pattern: [
            "what are you", "how are you made", "who made you", "who created you"
        ],
        reply: "I am a node.js / ejs interactive chatbot developed for SDEV265 as a School of IT information resource and a capstone project for the course."
    },
    {
        intent: "bot_name",
        pattern: [
            "what's your name", "what can i call you", "who are you",
            "your name", "do you have a name"
        ],
        reply: "My full name is IvyBot, but you can call me Ivy",
        filipino_reply: "Ang buong pangalan ko ay IvyBot, pero maaari mo akong tawaging Ivy"
    },
    {
        intent: "campus_info_general",
        pattern: "what campuses are there",
        reply: "Here's some information about our campuses",
        url: "https://www.ivytech.edu/locations/",
        link: "Campus Locations"
    },
    {
        intent: "dean_info",
        pattern: [
            "who is the dean of the school of it in bloomington", "dean of it in bloomington", 
            "who is the dean of the school of it in bloomington","who is the dean of IT at the bloomington campus",
            "who is the dean for the school of IT in bloomington "
        ],
        reply: "The Dean of the School of IT in Bloomington is Chris Carroll",
        url: "https://whitepages.ivytech.edu/profile/rcarroll/",
        link: "White Pages Entry"
    },
    {
        intent: "dean_info_lafayette",
        pattern: [
            "who is the dean of the school of it in lafayette", "dean of it in lafayette", 
            "who is the dean of the school of it in lafayette","who is the dean of IT at the lafayette campus",
            "who is the dean for the school of IT in lafayette "
        ],
        reply: "The Dean of the School of IT in Lafayette is Andrew Gibbs",
        url: "https://whitepages.ivytech.edu/profile/agibbs33/",
        link: "White Pages Entry"
    },
    {
        intent: "dean_info_lake_county",
        pattern: [
            "who is the dean of the school of it in lake county", "dean of it in lake county", 
            "who is the dean of the school of it in lake county","who is the dean of IT at the lake county campus",
            "who is the dean for the school of IT in lake county "
        ],
        reply: "The Dean of the School of IT in Lake County is Feihong Liu",
        url: "https://whitepages.ivytech.edu/profile/fliu9/",
        link: "White Pages Entry"
    },
    {
        intent: "dean_info_terre_haute",
        pattern: [
            "who is the dean of the school of it in terre haute", "dean of it in terre haute", 
            "who is the dean of the school of it in terre haute","who is the dean of IT at the terre haute campus",
            "who is the dean for the school of IT in terre haute "
        ],
        reply: "The Dean of the School of IT in Terre Haute is Logan Pearison",
        url: "https://whitepages.ivytech.edu/profile/lpearison1/",
        link: "White Pages Entry"
    },
    {
        intent: "dean_info_columbus",
        pattern: [
            "who is the dean of the school of it in columbus", "dean of it in columbus", 
            "who is the dean of the school of it in columbus","who is the dean of IT at the columbus campus",
            "who is the dean for the school of IT in columbus "
        ],
        reply: "The Dean of the School of IT in Columbus is Pam Schmelz",
        url: "https://whitepages.ivytech.edu/profile/pschmelz/",
        link: "White Pages Entry"
            "who is the dean"
        ]
    },
    {
        intent: "admissions_info_general",
        pattern: ["can you give me information about admissions", "admissions"],
        reply: "Here's some information about admissions!",
        url: "https://www.ivytech.edu/admissions/",
        link: "Admissions"
    },
    {
        intent: "enrollment_info_general",
        pattern: ["can you give me information about enrollment", "enrollment"],
        reply: "Here's some information about enrollment!",
        url: "https://www.ivytech.edu/admissions/",
        link: "Enrollment"
    },
    {
        intent: "instructor_info_sdev265",
        pattern: [
            "who is instructor for SDEV265",
            "who teaches SDEV265",
            "SDEV265 instructor",
            "who is the professor for SDEV265",
            "who is my SDEV265 teacher",
            "who is teaching SDEV265 this semester",
            "SDEV265 faculty",
        ],
        reply: "SDEV265 is taught by several instructors depending on campus and semester. Please check the official College Scheduler for the most current instructor information",
        url: "https://ivytech.search.collegescheduler.com/",
        link: "College Scheduler"
    },
    {
        intent: "instructor_info_general",
        pattern: [
            "who is the instructor for", "who teaches", "instructor",
            "who is the professor for", "who is my teacher", "who is teaching this semester",
            "faculty", "course schedule", "class schedule",
        ],
        reply: "The instructor for this course is subject to change each semester. Please check the official College Scheduler for the most current instructor information.",
        url: "https://ivytech.search.collegescheduler.com/",
        link: "College Scheduler"
    },
    {
        intent: "course_info_general",
        pattern: [
            "course description", "course descriptions","prerequisites for", "course details", "course info", "course information", "course syllabus", 
            "course outline", "course overview", "course topics", "course content", "course objectives", "course goals",
            "what will I learn in", "what do I learn in", "what are the learning outcomes for", "what are the learning objectives for"
        ],
        reply: "For detailed information about courses, including descriptions and prerequisites, please visit the course description page",
        url: "https://catalog.ivytech.edu/content.php?catoid=11&navoid=1255",
        link: "Course Descriptions"
    },
    {
        intent: "phone_number_info",
        pattern: [ 
                   "phone number", "what is the phone number", "contact by phone",
                   "how can i call", "how can i reach", "contact number"
        ]
    },
    {
        intent : "address_info",
        pattern: [
            "campus address", "campus location", "what is the address for",
            "where is ivytech located", "ivytech address",
            "directions to campus", "how do i get to campus"
        ]
    },
    {
        intent: "program_info",
        pattern: [
            "what programs", "what programs ivy tech", "what kind of programs do you offer",
            "what programs ivytech", "what programs does ivytech offer", "programs offered ivytech",
            "programs offered ivy tech", "programs ivytech", "programs ivy tech", "programs"
        ],
        reply: "Here are the programs you can find at IvyTech!",
        url: "https://www.ivytech.edu/programs/",
        link: "Programs"
    },
    {
        intent: "certification_info",
        pattern: [
            "certifications", "does ivytech offer certifications", "certifications ivytech", "certifications ivy tech",
         ],
        reply: "Certainly!  Here is more information about Degrees and Certifications",
        url: "https://www.ivytech.edu/programs/degrees-certificates/",
        link: "Degrees and Certifications"
    },
    {
        intent: "application_process",
        pattern: [
            "how can i apply to the school of it", "application process", "it application process",
            "how do i apply to the school of it", "how do i apply to ivy tech", "how can i apply to ivy tech",
            "how do i apply to ivytech", "how can i apply to ivytech", "application process ivy tech",
            "application process ivytech", "application process for school of it", "application process for ivy tech",
            "application process for ivytech"
        ],
        reply: "Here's some information about the application process!",
        url: "https://www.ivytech.edu/admissions/apply-now/",
        link: "Application Process"
    },
    {
        intent: "credit_hour_info",
        pattern: [
            "what are the minimum credit hours i can take", "minimum credit hours", "credit hours",
            "how many credit hours can i take", "how many credit hours do i need", "credit hours needed",
            "minimum credit hours ivy tech", "minimum credit hours ivytech", "credit hours ivy tech",
            "credit hours ivytech", "how many credit hours ivy tech", "how many credit hours ivytech",
            "how many credit hours do i need ivy tech", "how many credit hours do i need ivytech",
            "credit hours needed ivy tech", "credit hours needed ivytech"
        ],
        reply: "Here's some information about credit hours!",
        url: "https://ivytech.edusupportcenter.com/shp/ivytech/article?articleId=1510102&pk=192307&articleTag=gh_faapp",
        link: "Credit Hours"
    },
    {
        intent: "transfer_programs_info",
        pattern: [
            "what programs can transfer to a 4 year institution", "transfer programs", "transfer programs ivy tech",
            "tsap", "tsap transfer", "tsap transfer programs", "transfer programs ivytech",
            "what programs can transfer to a 4 year institution ivy tech", "what programs can transfer to a 4 year institution ivytech",
            "transfer programs for ivy tech", "transfer programs for ivytech", "transfer programs to 4 year institution",
            "transfer programs to 4 year institution ivy tech", "transfer programs to 4 year institution ivytech",
            "tsap ivy tech", "tsap ivytech", "tsap transfer ivy tech", "tsap transfer ivytech",
            "tsap transfer programs ivy tech", "tsap transfer programs ivytech"
        ],
        reply: "Here is some information regarding program transfers!",
        url: "https://www.ivytech.edu/programs/special-programs-for-students/transfer-options/#accordion-c09fe912eeb048249ddc340cc1a51ee5-0",
        link: "Participating Schools by Program"
    },
    {
        intent: "available_programs",
        pattern: [
            "what programs and courses are available", "what programs are available", "available programs",
            "available programs ivy tech", "available programs ivytech", "what programs are available ivy tech",
            "what programs are available ivytech",
        ],
        reply: "Ivy Tech offers more than 70 programs including Nursing, Cloud Technologies, Cybersecurity, Precision Agriculture, and Business Administration.",
        url: "https://www.ivytech.edu/programs/all-academic-programs/",
        link: "All Academic Programs"
    },
    {
        intent: "tuition_fees",
        pattern: [
            "what are the tuition and fees", "tuition and fees", "tuition fees",
            "tuition and fees ivy tech", "tuition and fees ivytech", "tuition fees ivy tech",
            "tuition fees ivytech", "what are the tuition and fees ivy tech", "what are the tuition and fees ivytech",
            "costs", "costs ivy tech", "costs ivytech", "what are the costs", "what are the costs ivy tech",
            "what are the costs ivytech", "payment"
        ],
        reply: "Tuition and fees vary by program and residency status. Detailed information is available on Ivy Tech's tuition page.",
        url: "https://www.ivytech.edu/tuition-aid/tuition-fees/",
        link: "Tuition and Fees"
    },
    {
        intent: "financial_aid_options",
        pattern: [
            "what financial aid options are available", "financial aid options", "financial aid",
            "financial aid ivy tech", "financial aid ivytech", "what are the financial aid options ivy tech",
            "what are the financial aid options ivytech", "financial aid options ivy tech", "financial aid options ivytech",
            "financial aid", "grants", "scholarships", "loans", "financial deadlines"
        ],
        reply: "Ivy Tech offers various financial aid options including grants, scholarships, and loans. Important deadlines can be found on the financial aid page",
        url: "https://www.ivytech.edu/financial-aid/",
        link: "Financial Aid"
    },
    {
        intent: "student_portal_access",
        pattern: [
            "how do I access my student portal (MyIvy)", "student portal", "access student portal",
            "myivy", "myivy portal", "access myivy", "how do I access myivy",
            "student portal ivy tech", "student portal ivytech", "access student portal ivy tech",
            "access student portal ivytech", "myivy ivy tech", "myivy ivytech", "access myivy ivy tech",
            "access myivy ivytech", "how do I access myivy ivy tech", "how do I access myivy ivytech"
        ],
        reply: "You can access your student portal by logging into MyIvy on the Ivy Tech website.",
        url: "https://www.ivytech.edu/myivy/",
        link: "Student Portal"
    },
    {
        intent: "class_registration",
        pattern: [
            "what is the process for registering for classes", "class registration", "register for classes",
            "how do I register for classes", "register for classes ivy tech", "register for classes ivytech",
            "class registration ivy tech", "class registration ivytech", "how do I register for classes ivy tech",
            "how do I register for classes ivytech"
        ],
        reply: "You can register for classes through the Ivy Tech class search and schedule builder.",
        url: "https://www.ivytech.edu/classes/how-to-register-for-classes/",
        link: "Registration 101"
    },
    {
        intent: "transcript_request",
        pattern: [
            "how do I get my transcripts", "transcript request", "request transcripts",
            "how do I request my transcripts", "transcripts ivy tech", "transcripts ivytech"
        ],
        reply: "Transcripts can be requested through the Registrar's office.",
        url: "https://ivytech.edusupportcenter.com/shp/ivytech/viewarticles?articleId=1510845",
        link: "Registrar/Transcripts"
    },
    {
        intent: "student_services",
        pattern: [
            "what student services are available", "student services", "services for students",
            "student services ivy tech", "student services ivytech", "what student services are available ivy tech",
            "what student services are available ivytech"
        ],
        reply: "Ivy Tech offers various student services including career coaching, academic advising, and library resources.",
        url: "https://www.ivytech.edu/student-services/",
        link: "Student Services"
    },
    {
        intent: "find_advisor",
        pattern: [
            "how do I find my advisor", "find my advisor", "academic advisor",
            "how do I find my advisor ivy tech", "how do I find my advisor ivytech", "find my advisor ivy tech",
            "find my advisor ivytech", "academic advisor ivy tech", "academic advisor ivytech"
        ],
        reply: "You can find your advisor by visiting the advising page on the Ivy Tech website.",
        url: "https://www.ivytech.edu/advising/",
        link: "Advising"
    },
    {
        intent: "bookstore_info",
        pattern: [
            "what is the bookstore's location and hours", "bookstore location and hours", "bookstore hours",
            "bookstore location", "bookstore ivy tech", "bookstore ivytech", "what is the bookstore's location and hours ivy tech",
            "what is the bookstore's location and hours ivytech", "bookstore location ivy tech", "bookstore location ivytech",
            "bookstore hours ivy tech", "bookstore hours ivytech"
        ],
        reply: "The bookstore's location and hours can be found on the Ivy Tech campus stores page.",
        url: "https://www.ivytech.edu/student-services/campus-stores/",
        link: "Campus Stores"
    },
    {
        intent: "scholarship_application",
        pattern: [
            "how do I apply for scholarships", "apply for scholarships", "scholarships",
            "scholarships ivy tech", "scholarships ivytech", "how do I apply for scholarships ivy tech",
            "how do I apply for scholarships ivytech", "apply for scholarships ivy tech", "apply for scholarships ivytech",
            "scholarships application ivy tech", "scholarships application ivytech"
        ],
        reply: "You can apply for scholarships through the Ivy Tech scholarships page.",
        url: "https://www.ivytech.edu/scholarships/",
        link: "Scholarships"
    },
    {
        pattern: "how do I check my academic standing",
        reply: "You can check your academic standing through the academic progress page.",
        url: "https://www.ivytech.edu/tuition-aid/financial-aid/satisfactory-academic-progress-sap/",
        link: "Academic Success"
    },
    {
        pattern: "what are the library resources and services",
        reply: "Ivy Tech's library resources and services can be accessed through the libraries page.",
        url: "https://www.ivytech.edu/student-services/libraries/",
        link: "Libraries"
    },
    {
        pattern: "how do I get involved in clubs and organizations",
        reply: "You can get involved in clubs and organizations through the student life page.",
        url: "https://www.ivytech.edu/student-life/",
        link: "Student Life"
    },
    {
        pattern: "what is the process for dual credit enrollment",
        reply: "Information on dual credit enrollment can be found on the dual credit enrollment page.",
        url: "https://www.ivytech.edu/programs/special-programs-for-students/high-school-programs/dual-credit/",
        link: "Dual Credit Enrollment"
    },
    {
        intent: "ivyonline_info",
        pattern: ["how do I access online courses (IvyOnline)", "IvyOnline courses", "access IvyOnline"],
        reply: "You can access online courses through the IvyOnline page.",
        url: "https://www.ivytech.edu/ivyonline/",
        link: "IvyOnline"
    },
    {
        intent: "campus_parking",
        pattern: ["what are the parking options on campus", "campus parking options", "parking on campus"],
        reply: "Parking options on campus are detailed on the campus stores page.",
        url: "https://www.ivytech.edu/locations/indianapolis/maps-and-tour/",
        link: "Campus Stores"
    },
    {
        intent: "campus_events",
        pattern: ["how do I get information about campus events", "campus events", "events on campus"],
        reply: "You can find information about campus events on the events page.",
        url: "https://ivylife.ivytech.edu/events",
        link: "Events"
    },
    {
        intent: "online_student_support",
        pattern: ["what support is available for online students", "online student support", "support for online students"],
        reply: "Support for online students is available through the online support page.",
        url: "https://www.ivytech.edu/online-support/",
        link: "Online Support"
    },
    {
        intent: "student_population",
        pattern: [
            "how many students are there", "student population", "number of students",
            "how many students ivy tech", "how many students ivytech", "student population ivy tech",
            "student population ivytech", "number of students ivy tech", "number of students ivytech"
        ],
        reply: "During the 2023-2024 academic year, we served over 198,000 students!",
        url: "https://www.ivytech.edu/about-ivy-tech/college-operations/diversity-equity-belonging/",
        link: "Students"
    },
    {
        intent: "military_veteran_services",
        pattern: [
            "military and veteran services", "services for military and veterans", "military services",
            "veteran services", "military and veteran services ivy tech", "military and veteran services ivytech",
            "services for military and veterans ivy tech", "services for military and veterans ivytech",
            "military services ivy tech", "military services ivytech", "veteran services ivy tech",
            "veteran services ivytech", "military veterans", "military active", "active duty", "gi bill",
            "does ivy tech offers benefits for military veterans",
        ],
        reply: "Ivy Tech offers various services for active military and veteran students, including counseling, academic advising, and career services.",
        url: "https://www.ivytech.edu/student-services/support-services/va-education-benefits/",
        link: "VA Education Benefits"
    },
    {
        intent: "testing_services",
        pattern: [
            "testing services", "services for testing", "test preparation",
            "exam services", "testing services ivy tech", "testing services ivytech",
            "services for testing ivy tech", "services for testing ivytech",
            "test preparation ivy tech", "test preparation ivytech", "exam services ivy tech",
        ],
        reply: "Ivy Tech offers various testing services, for more detials click the link below",
        url: "https://www.ivytech.edu/student-services/support-services/testing-services/",
        link: "Testing Services"
    },
    {
        intent: "class_formats",
        pattern: [
            "learnanywhere class", "online class", "hybrid class", "traditional class", "blended class",
            "what class formats are available", "types of classes", "class delivery methods", "how are classes offered",
            "in-person class", "virtual class", "remote class", "what is a hybrid class", "what is a blended class",
            "what is a learnanywhere class", "what is an online class", "what is a traditional class", "class formats",
            "course delivery", "is this online or in person", "learning format",
            "learnanywhere", "learn anywhere course", "is this a learn anywhere course?", 
            "learnanywhere course", "is this a learnanywhere course",
        ],
        reply: "Ivy Tech offers a variety of class formats, including online, hybrid, traditional, and more. For details about each format, please visit the link below.",
        url: "https://www.ivytech.edu/classes/class-formats/",
        link: "Class Formats"
    }


];

const locations = [
    {
        position: { lat: 40.0529917, lng: -85.6695955 },
        title: "Anderson",
        type: "campus",
        subhead: "",
        address: "815 E 60th Street\nAnderson, IN 46013",
        phone: "1-765-643-7133",
        email: "askanderson@ivytech.edu",
        url: "/anderson/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=anderson&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.2892662, lng: -85.1971168 },
        title: "Batesville",
        type: "satellite",
        subhead: "Part of the Lawrenceburg Full-Service Campus",
        address: "1 Ivy Tech Drive\nBatesville, IN 47006",
        phone: "1-812-934-3954",
        email: "R11express@ivytech.edu",
        url: "/batesville/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=batesville&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 38.862617, lng: -86.483899 },
        title: "Bedford",
        type: "satellite",
        subhead: "Part of the Bloomington Full-Service Campus",
        address: "931 15th Street\nBedford, IN 47421",
        phone: "1-812-279-8126",
        email: "bl-info@ivytech.edu",
        url: "/bloomington/index.html",
        contactDirectoryUrl: "",
    },
    {
        position: { lat: 39.1665939, lng: -86.5969688 },
        title: "Bloomington",
        type: "campus",
        subhead: "",
        address: "200 Daniels Way\nBloomington, IN 47404",
        phone: "1-812-330-6013",
        email: "bl-info@ivytech.edu",
        url: "/bloomington/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=bloomington&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.2513699, lng: -85.9028085 },
        title: "Columbus",
        type: "campus",
        subhead: "",
        address: "4475 Central Avenue\nColumbus, IN 47203",
        phone: "1-812-372-9925",
        email: "askcolumbus@ivytech.edu",
        url: "/columbus/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=columbus&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.6576011, lng: -85.1394987 },
        title: "Connersville",
        type: "satellite",
        subhead: "Part of the Richmond Full-Service Campus",
        address: "717 W 21st Street\nConnersville, IN 47331",
        phone: "1-765-966-2656",
        email: "richmondenrollment@ivytech.edu",
        url: "/connersville/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=connersville&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 40.0710992, lng: -86.9034835 },
        title: "Crawfordsville",
        type: "satellite",
        subhead: "Part of the Lafayette Full-Service Campus",
        address: "2255 Phil Ward Boulevard\nCrawfordsville, IN 47933",
        phone: "1-765-359-0570",
        email: "asklafayette@ivytech.edu",
        url: "/crawfordsville/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=crawfordsville&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 41.4375947, lng: -87.334175 },
        title: "Crown Point",
        type: "campus",
        subhead: "Part of the Lake County Full-Service Campus",
        address: "9900 Connecticut Drive\nCrown Point, IN 46307",
        phone: "1-219-392-3600",
        email: "asklakecounty@ivytech.edu",
        url: "/lakecounty/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=lake+county&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 41.6401149, lng: -87.4667754 },
        title: "East Chicago",
        type: "campus",
        subhead: "Part of the Lake County Full-Service Campus",
        address: "410 E Columbus Drive\nEast Chicago, IN 46312",
        phone: "1-219-392-3600",
        email: "asklakecounty@ivytech.edu",
        url: "/lakecounty/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=east+chicago&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 41.6613936, lng: -85.8951058 },
        title: "Elkhart",
        type: "satellite",
        subhead: "Part of the South Bend Full-Service Campus",
        address: "22531 County Road 18\nGoshen, IN 46528",
        phone: "1-574-289-7001",
        email: "asksouthbendelkhart@ivytech.edu",
        url: "/southbendelkhart/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=south+bend_elkhart&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 38.0119772, lng: -87.573088 },
        title: "Evansville",
        type: "campus",
        subhead: "",
        address: "3501 N First Avenue\nEvansville, IN 47710",
        phone: "1-812-426-2865",
        email: "askevansville@ivytech.edu",
        url: "/evansville/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=evansville&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 41.1238148, lng: -85.0951904 },
        title: "Fort Wayne",
        type: "campus",
        subhead: "",
        address: "3701 Dean Drive\nFort Wayne, IN 46835",
        phone: "1-260-482-9171",
        email: "askfortwayne@ivytech.edu",
        url: "/fortwayne/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=fort+wayne&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 40.2805787, lng: -86.5099008 },
        title: "Frankfort",
        type: "satellite",
        subhead: "Part of the Lafayette Full-Service Campus",
        address: "251 E Clinton Street\nFrankfort, IN 46041",
        phone: "1-765-269-5820",
        email: "asklafayette@ivytech.edu",
        url: "/frankfort/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=frankfort&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.489068, lng: -86.0118688 },
        title: "Franklin",
        type: "satellite",
        subhead: "Part of the Columbus Full-Service Campus",
        address: "2205 McClain Drive\nFranklin, IN 46131",
        phone: "1-317-916-6301",
        email: "askcolumbus@ivytech.edu",
        url: "/franklin/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=franklin&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 41.5551734, lng: -87.336161 },
        title: "Gary",
        type: "campus",
        subhead: "Part of the Lake County Full-Service Campus",
        address: "3491 Broadway\nGary, IN 46409",
        phone: "1-219-392-3600",
        email: "asklakecounty@ivytech.edu",
        url: "/lakecounty/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=lake+county&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.6390505, lng: -86.8394951 },
        title: "Greencastle",
        type: "satellite",
        subhead: "Part of the Terre Haute Full-Service Campus",
        address: "915 S Zinc Mill Road\nGreencastle, IN 46135",
        phone: "1-765-653-7410",
        email: "cwhitesel7@ivytech.edu",
        url: "/greencastle/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=greencastle&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.3407354, lng: -85.4784511 },
        title: "Greensburg",
        type: "satellite",
        subhead: "Part of the Columbus Full-Service Campus",
        address: "422 E Central Avenue\nGreensburg, IN 27240",
        phone: "1-812-663-9493",
        email: "askcolumbus@ivytech.edu",
        url: "/greensburg/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=greensburg&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.8053968, lng: -86.1589352 },
        title: "Indianapolis",
        type: "campus",
        subhead: "",
        address: "50 W Fall Creek Parkway N\nIndianapolis, IN 46208",
        phone: "1-317-921-4699",
        email: "askindianapolis@ivytech.edu",
        url: "/indianapolis/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=indianapolis&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
        dean: {
            reply: "The Dean of the School of IT in Indianapolis is Patrick Benner. Email: pbenner@ivytech.edu, Phone: 317-921-4699",
            url: "https://whitepages.ivytech.edu/profile/pbenner/",
            link: "White Pages Entry"
        }
    },
    {
        position: { lat: 40.5049668, lng: -86.1064558 },
        title: "Kokomo",
        type: "campus",
        subhead: "",
        address: "1815 E Morgan Street\nKokomo, IN 46901",
        phone: "1-765-459-0561",
        email: "kokomo-enrollment@ivytech.edu",
        url: "/kokomo/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=kokomo&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 41.6275542, lng: -86.7054035 },
        title: "La Porte",
        type: "satellite",
        subhead: "Part of the Valparaiso Full-Service Campus",
        address: "1900 Whirlpool Drive\nLa Porte, IN 46350",
        phone: "1-219-879-9137",
        email: "askvalparaiso@ivytech.edu ",
        url: "/laporte/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=laporte&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 40.3838817, lng: -86.8401738 },
        title: "Lafayette",
        type: "campus",
        subhead: "",
        address: "3101 South Creasy Lane\nLafayette, IN 47905",
        phone: "1-765-269-5000",
        email: "asklafayette@ivytech.edu",
        url: "/lafayette/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=lafayette&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.8618239, lng: -86.005368 },
        title: "Lawrence",
        type: "satellite",
        subhead: "Part of the Indianapolis Full-Service Campus",
        address: "9301 East 59th Street\nIndianapolis, IN 46216",
        phone: "1-317-921-4790",
        email: "jlove@ivytech.edu",
        url: "/indianapolis/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=lawrence&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.0925877, lng: -84.8464251 },
        title: "Lawrenceburg",
        type: "campus",
        subhead: "",
        address: "50 Walnut Street\nLawrenceburg, IN 47025",
        phone: "1-812-537-4010",
        email: "R11express@ivytech.edu",
        url: "/lawrenceburg/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=lawrenceburg&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.0355748, lng: -87.1663605 },
        title: "Linton",
        type: "satellite",
        subhead: "Part of the Terre Haute Full-Service Campus",
        address: "140 North Main Street\nLinton, IN 47441",
        phone: "1-812-299-1121",
        email: "askterrehaute@ivytech.edu",
        url: "/linton/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=linton&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 40.7370836, lng: -86.3553066 },
        title: "Logansport",
        type: "satellite",
        subhead: "Part of the Kokomo Full-Service Campus",
        address: "1 Ivy Tech Way\nLogansport, IN 46947",
        phone: "1-765-459-0561",
        email: "kokomo-enrollment@ivytech.edu",
        url: "/logansport/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=logansport&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 38.7805601, lng: -85.376179 },
        title: "Madison",
        type: "campus",
        subhead: "",
        address: "590 Ivy Tech Drive\nMadison, IN 47250",
        phone: "1-812-265-2580",
        email: "askmadison@ivytech.edu",
        url: "/madison/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=madison&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 40.5487502, lng: -85.5531909 },
        title: "Marion",
        type: "campus",
        subhead: "",
        address: "261 Commerce Drive\nMarion, IN 46953",
        phone: "1-765-651-3100",
        email: "askmarion@ivytech.edu",
        url: "/marion/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=marion&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 41.6860089, lng: -86.8931662 },
        title: "Michigan City",
        type: "satellite",
        subhead: "Part of the Valparaiso Full-Service Campus",
        address: "3714 Franklin Street\nMichigan City, IN 46360",
        phone: "1-219-879-9137",
        email: "askvalparaiso@ivytech.edu ",
        url: "/michigan/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=michigan+city&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 40.7578269, lng: -86.7605172 },
        title: "Monticello",
        type: "satellite",
        subhead: "Part of the Lafayette Full-Service Campus",
        address: "1017 O Connor Boulevard\nMonticello, IN 47960",
        phone: "1-574-583-4891",
        email: "asklafayette@ivytech.edu",
        url: "/monticello/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=monticello&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.6020572, lng: -86.3719876 },
        title: "Mooresville",
        type: "satellite",
        subhead: "Part of the Bloomington Full-Service Campus",
        address: "204 Southbridge Street\nMooresville, IN 46158",
        phone: "1-812-330-6013",
        email: "bl-info@ivytech.edu",
        url: "/mooresville/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=mooresville&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 40.1932793, lng: -85.3880015 },
        title: "Muncie",
        type: "campus",
        subhead: "",
        address: "125 S High Street\nMuncie, IN 47305",
        phone: "1-765-289-2291",
        email: "askmuncie@ivytech.edu",
        url: "/muncie/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=muncie&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.8848005, lng: -85.3868921 },
        title: "New Castle",
        type: "satellite",
        subhead: "Part of the Muncie Full-Service Campus",
        address: "3325 IN-3\nNew Castle, IN 47362",
        phone: "1-765-289-2291",
        email: "askmuncie@ivytech.edu",
        url: "/newcastle/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=new+castle&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 40.0485174, lng: -86.0025229 },
        title: "Noblesville",
        type: "campus",
        subhead: "Known as the Hamilton County Full-Service Campus",
        address: "300 17th Street\nNoblesville, IN 46060",
        phone: "1-317-921-4300",
        email: "askhamiltoncounty@ivytech.edu",
        url: "/hamilton-county/index.html",
        contactDirectoryUrl: "",
    },
    {
        position: { lat: 39.0090723, lng: -85.6439215 },
        title: "North Vernon",
        type: "satellite",
        subhead: "Part of the Columbus Full-Service Campus",
        address: "1200 W O&M Avenue\nNorth Vernon, IN 47264",
        phone: "1-812-346-2468",
        email: "askcolumbus@ivytech.edu",
        url: "/northvernon/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=north+vernon&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 40.748031, lng: -86.0812551 },
        title: "Peru",
        type: "satellite",
        subhead: "Part of the Kokomo Full-Service Campus",
        address: "425 W Main Street\nPeru, IN 46970",
        phone: "1-765-459-0561",
        email: "kokomo-enrollment@ivytech.edu",
        url: "/peru/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=peru&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.6852867, lng: -86.3782541 },
        title: "Plainfield",
        type: "satellite",
        subhead: "Part of the Indianapolis Full-Service Campus",
        address: "610 Reeves Road\nPlainfield, IN 46168",
        phone: "1-317-968-1516",
        email: "ardavis@ivytech.edu",
        url: "/plainfield/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=plainfield&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 38.3204599, lng: -87.5684931 },
        title: "Princeton",
        type: "satellite",
        subhead: "Part of the Evansville Full-Service Campus",
        address: "2431 S Crabtree Drive\nPrinceton, IN 47670",
        phone: "1-812-385-8495",
        email: "askevansville@ivytech.edu",
        url: "/princeton/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=princeton&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.8710943, lng: -84.8807328 },
        title: "Richmond",
        type: "campus",
        subhead: "",
        address: "2357 Chester Boulevard\nRichmond, IN 47374",
        phone: "1-765-966-2656",
        email: "richmondenrollment@ivytech.edu",
        url: "/richmond/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=richmond&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.6101911, lng: -85.4446469 },
        title: "Rushville",
        type: "satellite",
        subhead: "Part of the Richmond Full-Service Campus",
        address: "330 N Main Street\nRushville, IN 46173",
        phone: "1-765-966-2656",
        email: "richmondenrollment@ivytech.edu",
        url: "/richmond/index.html",
        contactDirectoryUrl: "",
    },
    {
        position: { lat: 38.6814526, lng: -85.7927425 },
        title: "Scottsburg",
        type: "satellite",
        subhead: "Part of the Sellersburg Full-Service Campus",
        address: "821 South Lake Rd S\nScottsburg, IN 47170",
        phone: "1-812-246-3301",
        email: "asksellersburg@ivytech.edu",
        url: "/midamerica/index.html",
        contactDirectoryUrl: "",
    },
    {
        position: { lat: 38.3898307, lng: -85.7626284 },
        title: "Sellersburg",
        type: "campus",
        subhead: "",
        address: "8204 Highway 311 \nSellersburg, IN 47150",
        phone: "1-812-246-3301",
        email: "asksellersburg@ivytech.edu",
        url: "/sellersburg/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=sellersburg&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 38.9599308, lng: -85.8593638 },
        title: "Seymour",
        type: "satellite",
        subhead: "Part of the Columbus Full-Service Campus",
        address: "323 Dupont Drive\nSeymour, IN 47274",
        phone: "1-812-519-2923",
        email: "askcolumbus@ivytech.edu",
        url: "/seymour/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=seymour&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.5542436, lng: -85.7810113 },
        title: "Shelbyville",
        type: "satellite",
        subhead: "Part of the Columbus Full-Service Campus",
        address: "2177 Intelliplex Drive\nShelbyville, IN 46176",
        phone: "1-317-392-3243",
        email: "askcolumbus@ivytech.edu",
        url: "/shelbyville/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=shelbyville&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 41.6616237, lng: -86.2480261 },
        title: "South Bend",
        type: "campus",
        subhead: "",
        address: "220 Dean Johnson Boulevard\nSouth Bend, IN 46601",
        phone: "1-574-289-7001",
        email: "asksouthbendelkhart@ivytech.edu",
        url: "/southbendelkhart/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=south+bend&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 37.9566146, lng: -86.7387402 },
        title: "Tell City",
        type: "satellite",
        subhead: "Part of the Evansville Full-Service Campus",
        address: "1034 31st Street\nTell City, IN 47586",
        phone: "1-812-547-7915",
        email: "kking312@ivytech.edu",
        url: "/tellcity/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=tell+city&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 39.3711671, lng: -87.3923176 },
        title: "Terre Haute",
        type: "campus",
        subhead: "",
        address: "8000 South Education Drive\nTerre Haute, IN 47802",
        phone: "1-812-299-1121",
        email: "askterrehaute@ivytech.edu",
        url: "/terrehaute/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=terre+haute&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
        dean: {
            reply: "The Dean of the School of IT in Terre Haute is Logan Pearison. Email: lpearison1@ivytech.edu, Phone: 812-298-2344",
            url: "https://whitepages.ivytech.edu/profile/lpearison1/",
            link: "White Pages Entry"
        }
    },
    {
        position: { lat: 41.462292, lng: -87.0223423 },
        title: "Valparaiso",
        type: "campus",
        subhead: "",
        address: "3100 Ivy Tech Drive\nValparaiso, IN 46383",
        phone: "1-219-464-8514",
        email: "askvalparaiso@ivytech.edu ",
        url: "/valparaiso/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=valparaiso&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    },
    {
        position: { lat: 41.2735825, lng: -85.8718338 },
        title: "Warsaw",
        type: "satellite",
        subhead: "Part of the Fort Wayne Full-Service Campus",
        address: "2545 Silveus Crossing\nWarsaw, IN 46582",
        phone: "1-574-267-5428",
        email: "askwarsaw@ivytech.edu",
        url: "/warsaw/index.html",
        contactDirectoryUrl: "https://whitepages.ivytech.edu/?first_name=&last_name=&userid=&location=warsaw&role=faculty&role=staff&title=&bee_syrup_tun=&submit=+Search+",
    }
];

module.exports = { responses, locations };