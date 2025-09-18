const responses = [
     {
        intent: "greetings",
        pattern: [
            "hello", "hi", "hey", "greetings", 
            "good morning", "good afternoon", "good evening", 
            "howdy", "what's up"
        ],
        reply: "Hi there! What can I help you with today?"
    },
    {
        intent: "bot_status",
        pattern: ["how are you", "how's it going", "how are you doing", "are you doing great"],
        reply: "Doing great! I'm excited to help you find the information you require!"
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
        reply: "My full name is IvyBot, but you can call me Ivy"
    },
    {
        intent: "campus_info_general",
        pattern: ["what campuses are there"],
        reply: "Here's some information about our campuses",
        url: "https://www.ivytech.edu/locations/",
        link: "Campus Locations"
    },
    {
        intent: "dean_info_indy",
        pattern: [
            "who is the dean of the school of it in indy", "dean of it in indy", "who is the dean of the school of it in indianapolis",
            "who is the dean of IT at the indy campus", "who is the dean for the school of IT in indy", "dean of it in indianapolis",
            "dean of it in indianapolis", "who is the dean for the school of IT in indianapolis"
        ],
        reply: "The Dean of the School of IT in Indianapolis is Patrick Benner",
        url: "https://whitepages.ivytech.edu/profile/pbenner/",
        link: "White Pages Entry"
    },
    {
        intent: "dean_info_hamilton",
        pattern: [
            "who is the dean of the school of it in hamilton county", "dean of it in hamilton","dean of it in hamilton county", 
            "who is the dean of the school of it in hamilton","who is the dean of IT at the hamilton county campus",
            "who is the dean for the school of IT in hamilton county"
        ],
        reply: "The Dean of the School of IT in Hamilton County is Nicol Bradberry",
        url: "https://whitepages.ivytech.edu/profile/nbradberry/",
        link: "White Pages Entry"
    },
    {
        intent: "dean_info_bloomington",
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
    },
    {
    intent: "dean_info_no_dean",
    pattern: [
        "who is the dean of the school of it in anderson", "dean of it in anderson", "who is the dean for IT at anderson campus",
        "who is the dean of the school of it in batesville", "dean of it in batesville", "who is the dean for IT at batesville campus",
        "who is the dean of the school of it in connersville", "dean of it in connersville", "who is the dean for IT at connersville campus",
        "who is the dean of the school of it in crawfordsville", "dean of it in crawfordsville", "who is the dean for IT at crawfordsville campus",
        "who is the dean of the school of it in crown point", "dean of it in crown point", "who is the dean for IT at crown point campus",
        "who is the dean of the school of it in east chicago", "dean of it in east chicago", "who is the dean for IT at east chicago campus",
        "who is the dean of the school of it in elkhart", "dean of it in elkhart", "who is the dean for IT at elkhart campus",
        "who is the dean of the school of it in evansville", "dean of it in evansville", "who is the dean for IT at evansville campus",
        "who is the dean of the school of it in fort wayne", "dean of it in fort wayne", "who is the dean for IT at fort wayne campus",
        "who is the dean of the school of it in frankfort", "dean of it in frankfort", "who is the dean for IT at frankfort campus",
        "who is the dean of the school of it in franklin", "dean of it in franklin", "who is the dean for IT at franklin campus",
        "who is the dean of the school of it in gary", "dean of it in gary", "who is the dean for IT at gary campus",
        "who is the dean of the school of it in greencastle", "dean of it in greencastle", "who is the dean for IT at greencastle campus",
        "who is the dean of the school of it in kokomo", "dean of it in kokomo", "who is the dean for IT at kokomo campus",
        "who is the dean of the school of it in warsaw", "dean of it in warsaw", "who is the dean for IT at warsaw campus",
        "who is the dean of the school of it in kosciousko county", "dean of it in kosciousko county", "who is the dean for IT at kosciousko county campus",
        "who is the dean of the school of it in la porte", "dean of it in la porte", "who is the dean for IT at la porte campus",
        "who is the dean of the school of it in lawrence", "dean of it in lawrence", "who is the dean for IT at lawrence campus",
        "who is the dean of the school of it in lawrenceburg", "dean of it in lawrenceburg", "who is the dean for IT at lawrenceburg campus",
        "who is the dean of the school of it in logansport", "dean of it in logansport", "who is the dean for IT at logansport campus",
        "who is the dean of the school of it in madison", "dean of it in madison", "who is the dean for IT at madison campus",
        "who is the dean of the school of it in michigan city", "dean of it in michigan city", "who is the dean for IT at michigan city campus",
        "who is the dean of the school of it in muncie", "dean of it in muncie", "who is the dean for IT at muncie campus",
        "who is the dean of the school of it in new castle", "dean of it in new castle", "who is the dean for IT at new castle campus",
        "who is the dean of the school of it in perkins technology center", "dean of it in perkins technology center", "who is the dean for IT at perkins technology center",
        "who is the dean of the school of it in richmond", "dean of it in richmond", "who is the dean for IT at richmond campus",
        "who is the dean of the school of it in peru", "dean of it in peru", "who is the dean for IT at peru campus",
        "who is the dean of the school of it in plainfield", "dean of it in plainfield", "who is the dean for IT at plainfield campus",
        "who is the dean of the school of it in rushville", "dean of it in richmond", "who is the dean for IT at richmond campus",
        "who is the dean of the school of it in scottsburg", "dean of it in scottsburg", "who is the dean for IT at scottsburg campus",
        "who is the dean of the school of it in shelbyville", "dean of it in shelbyville", "who is the dean for IT at shelbyville campus",
        "who is the dean of the school of it in sellersburg", "dean of it in sellersburg", "who is the dean for IT at sellersburg campus",
        "who is the dean of the school of it in south bend", "dean of it in south bend", "who is the dean for IT at south bend campus",
        "who is the dean of the school of it in tell city", "dean of it in tell city", "who is the dean for IT at tell city campus",
        "who is the dean of the school of it in valparaiso", "dean of it in valparaiso", "who is the dean for IT at valparaiso campus",
    ],
    reply: "Currently, there is no designated Dean for Information Technology at your campus. Please contact the campus administration for more information."
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
                   "ivytech phone number", "what is the phone number for ivytech", "contact ivytech by phone",
                   "how can i call ivytech", "how do i reach ivytech by phone", "ivytech contact number", "what is the phone number for"
        ],
        reply: "IvyTech is available 24 hours a day, 7 days a week at the following number: <br><br> <a href='tel:888-489-5463'>888-489-5463</a> (Toll-Free) <br> <a href='tel:888-IVY-LINE'>888-IVY-LINE</a> (Toll-Free) <br><br> You can find additional ways to contact us below:",
        url: "https://www.ivytech.edu/contact-us/",
        link: "Contact Us"
    },
    {
        intent: "address_info_indianapolis",
        pattern: [
            "indianapolis campus", "indy campus", "indianapolis location", "indy location",
            "what is the address for ivytech in indy", "location of ivytech in indy", "where is ivytech located in indy",
            "ivytech address in indy", "ivytech location in indy", "what is the address for ivytech in indianapolis",
            "location of ivytech in indianapolis", "where is ivytech located in indianapolis",
            "ivytech address in indianapolis", "ivytech location in indianapolis", "indy campus address",
            "indianapolis campus address", "indy campus location", "indianapolis campus location",
            "how do i get to indy campus", "how do i get to indianapolis campus", 
            "directions to indy campus", "directions to indianapolis campus"
        ],
        reply: "<strong>Main Campus:</strong> <br>50 W Fall Creek Pkwy N Dr, Indianapolis, IN 46208",
        url: "https://www.google.com/maps/place/North+Meridian+Campus,+50+W+Fall+Creek+Pkwy+N+Dr,+Indianapolis,+IN+46208",
        link: "Google Maps"
    },
    {
        intent: "address_info_anderson",
        pattern: [
                 "anderson campus", "anderson location",
                 "what is the address for ivytech in anderson", "location of ivytech in anderson", "where is ivytech located in anderson",
                 "ivytech address in anderson", "ivytech location in anderson", "what is the address for ivytech in anderson", 
                 "location of ivytech in anderson", "where is ivytech located in anderson",
                 "ivytech address in anderson", "ivytech location in anderson", "anderson campus address",
                 "anderson campus location", "how do i get to anderson campus", "directions to anderson campus"
        ],
        reply: "<strong>Anderson Campus:</strong> <br> 815 E 60th Street, Anderson, IN 46013",
        url: "https://www.google.com/maps/place/815+E+60th+Street,+Anderson,+IN+46013",
        link: "Google Maps"
    },
    {
        intent: "address_info_batesville",
        pattern: [
                 "batesville campus", "batesville location",
                 "what is the address for ivytech in batesville", "location of ivytech in batesville", "where is ivytech located in batesville",
                 "ivytech address in batesville", "ivytech location in batesville", "what is the address for ivytech in batesville", 
                 "location of ivytech in batesville", "where is ivytech located in batesville",
                 "ivytech address in batesville", "ivytech location in batesville", "batesville campus address",
                 "batesville campus location", "how do i get to batesville campus", "directions to batesville campus"
        ],
        reply: "<strong>Batesville Campus:</strong> <br> 1 Ivy Tech Drive, Batesville, IN 47006",
        url: "https://www.google.com/maps/place/1+Ivy+Tech+Drive,+Batesville,+IN+47006",
        link: "Google Maps"
    },
    {
        intent: "address_info_bloomington",
        pattern: [
                 "bloomington campus", "bloomington location",
                 "what is the address for ivytech in bloomington", "location of ivytech in bloomington", "where is ivytech located in bloomington",
                 "ivytech address in bloomington", "ivytech location in bloomington", "what is the address for ivytech in bloomington",
                 "location of ivytech in bloomington", "where is ivytech located in bloomington",
                 "ivytech address in bloomington", "ivytech location in bloomington", "bloomington campus address",
                 "bloomington campus location", "how do i get to bloomington campus", "directions to bloomington campus"
        ],
        reply: "<strong>Bloomington Campus:</strong> <br> 200 Daniels Way, Bloomington, IN 47404",
        url: "https://www.google.com/maps/place/200+Daniels+Way,+Bloomington,+IN+47404",
        link: "Google Maps"
    },
    {
        intent: "address_info_columbus",
        pattern: [
                 "columbus campus", "columbus location",
                 "what is the address for ivytech in columbus", "location of ivytech in columbus", "where is ivytech located in columbus",
                 "ivytech address in columbus", "ivytech location in columbus", "what is the address for ivytech in columbus",
                 "location of ivytech in columbus", "where is ivytech located in columbus",
                 "ivytech address in columbus", "ivytech location in columbus", "columbus campus address",
                 "columbus campus location", "how do i get to columbus campus", "directions to columbus campus"
        ],
        reply: "<strong>Columbus Campus:</strong> <br> 4475 Central Ave, Columbus, IN 47203",
        url: "https://www.google.com/maps/place/4475+Central+Ave,+Columbus,+IN+47203",
        link: "Google Maps"
    },
    {
        intent: "address_info_connersville",
        pattern: [
                 "connersville campus", "connersville location",
                 "what is the address for ivytech in connersville", "location of ivytech in connersville", "where is ivytech located in connersville",
                 "ivytech address in connersville", "ivytech location in connersville", "what is the address for ivytech in connersville",
                 "location of ivytech in connersville", "where is ivytech located in connersville",
                 "ivytech address in connersville", "ivytech location in connersville", "connersville campus address",
                 "connersville campus location", "how do i get to connersville campus", "directions to connersville campus"
        ],
        reply: "<strong>Connersville Campus:</strong> <br> 717 W 21st Street, Connersville, IN 47331",
        url: "https://www.google.com/maps/place/717+W+21st+Street,+Connersville,+IN+47331",
        link: "Google Maps"
    },
    {
        intent: "address_info_crawfordsville",
        pattern: [
                 "crawfordsville campus", "crawfordsville location",
                 "what is the address for ivytech in crawfordsville", "location of ivytech in crawfordsville", "where is ivytech located in crawfordsville",
                 "ivytech address in crawfordsville", "ivytech location in crawfordsville", "what is the address for ivytech in crawfordsville",
                 "location of ivytech in crawfordsville", "where is ivytech located in crawfordsville",
                 "ivytech address in crawfordsville", "ivytech location in crawfordsville", "crawfordsville campus address",
                 "crawfordsville campus location", "how do i get to crawfordsville campus", "directions to crawfordsville campus"
        ],
        reply: "<strong>Crawfordsville Campus:</strong> <br> 2255 Phil Ward Boulevard, Crawfordsville, IN 47933",
        url: "https://www.google.com/maps/place/2255+Phil+Ward+Boulevard,+Crawfordsville,+IN+47933",
        link: "Google Maps"
    },
    {
        intent: "address_info_crown_point",
        pattern: [
                 "crown point campus", "crown point location",
                 "what is the address for ivytech in crown point", "location of ivytech in crown point", "where is ivytech located in crown point",
                 "ivytech address in crown point", "ivytech location in crown point", "what is the address for ivytech in crown point",
                 "location of ivytech in crown point", "where is ivytech located in crown point",
                 "ivytech address in crown point", "ivytech location in crown point", "crown point campus address",
                 "crown point campus location", "how do i get to crown point campus", "directions to crown point campus"
        ],
        reply: "<strong>Crown Point Campus:</strong> <br> 9900 Connecticut Drive, Crown Point, IN 46307",
        url: "https://www.google.com/maps/place/9900+Connecticut+Drive,+Crown+Point,+IN+46307",
        link: "Google Maps"
    },
    {
        intent: "address_info_east_chicago",
        pattern: [
                 "east chicago campus", "east chicago location",
                 "what is the address for ivytech in east chicago", "location of ivytech in east chicago", "where is ivytech located in east chicago",
                 "ivytech address in east chicago", "ivytech location in east chicago", "what is the address for ivytech in east chicago",
                 "location of ivytech in east chicago", "where is ivytech located in east chicago",
                 "ivytech address in east chicago", "ivytech location in east chicago", "east chicago campus address",
                 "east chicago campus location", "how do i get to east chicago campus", "directions to east chicago campus"
        ],
        reply: "<strong>East Chicago Campus:</strong> <br> 410 E Columbus Drive, East Chicago, IN 46312",
        url: "https://www.google.com/maps/place/410+E+Columbus+Drive,+East+Chicago,+IN+46312",
        link: "Google Maps"
    },
    {
        intent: "address_info_elkhart",
        pattern: [
            "elkhart campus", "elkhart location",
            "what is the address for ivytech in elkhart", "location of ivytech in elkhart", "where is ivytech located in elkhart",
            "ivytech address in elkhart", "ivytech location in elkhart", "what is the address for ivytech in elkhart",
            "location of ivytech in elkhart", "where is ivytech located in elkhart",
            "ivytech address in elkhart", "ivytech location in elkhart", "elkhart campus address",
            "elkhart campus location", "how do i get to elkhart campus", "directions to elkhart campus"
        ],
        reply: "<strong>Elkhart Campus:</strong> <br> 22531 County Road 18 Goshen, IN 46528",
        url: "https://www.google.com/maps/place/22531+County+Road+18,+Goshen,+IN+46528",
        link: "Google Maps"
    },
    {
        intent: "address_info_evansville",
        pattern: [
            "evansville campus", "evansville location",
            "what is the address for ivytech in evansville", "location of ivytech in evansville", "where is ivytech located in evansville",
            "ivytech address in evansville", "ivytech location in evansville", "what is the address for ivytech in evansville",
            "location of ivytech in evansville", "where is ivytech located in evansville",
            "ivytech address in evansville", "ivytech location in evansville", "evansville campus address",
            "evansville campus location", "how do i get to evansville campus", "directions to evansville campus"
        ],
        reply: "<strong>Evansville Campus:</strong> <br> 3501 N First Ave, Evansville, IN 47710",
        url: "https://www.google.com/maps/place/3501+N+First+Ave,+Evansville,+IN+47710",
        link: "Google Maps"
    },
    {
        intent: "address_info_fort_wayne",
        pattern: [
            "fort wayne campus", "fort wayne location",
            "what is the address for ivytech in fort wayne", "location of ivytech in fort wayne", "where is ivytech located in fort wayne",
            "ivytech address in fort wayne", "ivytech location in fort wayne", "what is the address for ivytech in fort wayne",
            "location of ivytech in fort wayne", "where is ivytech located in fort wayne",
            "ivytech address in fort wayne", "ivytech location in fort wayne", "fort wayne campus address",
            "fort wayne campus location", "how do i get to fort wayne campus", "directions to fort wayne campus"
        ],
        reply: "<strong>Fort Wayne Campus:</strong> <br> 3800 N Anthony Blvd, Fort Wayne, IN 46805",
        url: "https://www.google.com/maps/place/3800+N+Anthony+Blvd,+Fort+Wayne,+IN+46805",
        link: "Google Maps"
    },
    {
        intent: "address_info_frankfort",
        pattern: [
            "frankfort campus", "frankfort location",
            "what is the address for ivytech in frankfort", "location of ivytech in frankfort", "where is ivytech located in frankfort",
            "ivytech address in frankfort", "ivytech location in frankfort", "what is the address for ivytech in frankfort",
            "location of ivytech in frankfort", "where is ivytech located in frankfort",
            "ivytech address in frankfort", "ivytech location in frankfort", "frankfort campus address",
            "frankfort campus location", "how do i get to frankfort campus", "directions to frankfort campus"
        ],
        reply: "<strong>Frankfort Campus:</strong> <br> 215 E Clinton St, Frankfort, IN 46041",
        url: "https://www.google.com/maps/place/215+E+Clinton+St,+Frankfort,+IN+46041",
        link: "Google Maps"
    },
    {
        intent: "address_info_franklin",
        pattern: [
            "franklin campus", "franklin location",
            "what is the address for ivytech in franklin", "location of ivytech in franklin", "where is ivytech located in franklin",
            "ivytech address in franklin", "ivytech location in franklin", "what is the address for ivytech in franklin",
            "location of ivytech in franklin", "where is ivytech located in franklin",
            "ivytech address in franklin", "ivytech location in franklin", "franklin campus address",
            "franklin campus location", "how do i get to franklin campus", "directions to franklin campus"
        ],
        reply: "<strong>Franklin Campus:</strong> <br> 2205 McClain Drive, Franklin, IN 46131",
        url: "https://www.google.com/maps/place/2205+E+King+St,+Franklin,+IN+46131",
        link: "Google Maps"
    },
    {
        intent: "address_info_gary",
        pattern: [
            "gary campus", "gary location",
            "what is the address for ivytech in gary", "location of ivytech in gary", "where is ivytech located in gary",
            "ivytech address in gary", "ivytech location in gary", "what is the address for ivytech in gary",
            "location of ivytech in gary", "where is ivytech located in gary",
            "ivytech address in gary", "ivytech location in gary", "gary campus address",
            "gary campus location", "how do i get to gary campus", "directions to gary campus"
        ],
        reply: "<strong>Gary Campus:</strong> <br> 3491 Broadway, Gary, IN 46409",
        url: "https://www.google.com/maps/place/3491+Broadway,+Gary,+IN+46409",
        link: "Google Maps"
    },
    {
        intent: "address_info_greencastle",
        pattern: [
            "greencastle campus", "greencastle location",
            "what is the address for ivytech in greencastle", "location of ivytech in greencastle", "where is ivytech located in greencastle",
            "ivytech address in greencastle", "ivytech location in greencastle", "what is the address for ivytech in greencastle",
            "location of ivytech in greencastle", "where is ivytech located in greencastle",
            "ivytech address in greencastle", "ivytech location in greencastle", "greencastle campus address",
            "greencastle campus location", "how do i get to greencastle campus", "directions to greencastle campus"
        ],
        reply: "<strong>Greencastle Campus:</strong> <br> 1915 S Zinc Mill Road, Greencastle, IN 46135",
        url: "https://www.google.com/maps/place/1915+S+Zinc+Mill+Road,+Greencastle,+IN+46135",
        link: "Google Maps"
    },
    {
        intent: "address_info_hamilton_county",
        pattern: [
            "hamilton county campus", "hamilton county location",
            "what is the address for ivytech in hamilton county", "location of ivytech in hamilton county", "where is ivytech located in hamilton county",
            "ivytech address in hamilton county", "ivytech location in hamilton county", "what is the address for ivytech in hamilton county",
            "location of ivytech in hamilton county", "where is ivytech located in hamilton county",
            "ivytech address in hamilton county", "ivytech location in hamilton county", "hamilton county campus address",
            "hamilton county campus location", "how do i get to hamilton county campus", "directions to hamilton county campus"
        ],
        reply: "<strong>Hamilton County Campus:</strong> <br> 300 N. 17th Street, Noblesville, IN 46060",
        url: "https://www.google.com/maps/place/300+N+17th+St,+Noblesville,+IN+46060",
        link: "Google Maps"
    },
    {
        intent: "address_info_hamilton_county",
        pattern: [
            "hamilton county campus", "hamilton county location",
            "what is the address for ivytech in hamilton county", "location of ivytech in hamilton county", "where is ivytech located in hamilton county",
            "ivytech address in hamilton county", "ivytech location in hamilton county", "what is the address for ivytech in hamilton county",
            "location of ivytech in hamilton county", "where is ivytech located in hamilton county",
            "ivytech address in hamilton county", "ivytech location in hamilton county", "hamilton county campus address",
            "hamilton county campus location", "how do i get to hamilton county campus", "directions to hamilton county campus"
        ],
        reply: "<strong>Hamilton County Campus:</strong> <br> 300 N. 17th Street, Noblesville, IN 46060",
        url: "https://www.google.com/maps/place/300+N+17th+St,+Noblesville,+IN+46060",
        link: "Google Maps"
    },
    {
        intent: "address_info_kokomo",
        pattern: [
            "kokomo campus", "kokomo location",
            "what is the address for ivytech in kokomo", "location of ivytech in kokomo", "where is ivytech located in kokomo",
            "ivytech address in kokomo", "ivytech location in kokomo", "what is the address for ivytech in kokomo",
            "location of ivytech in kokomo", "where is ivytech located in kokomo",
            "ivytech address in kokomo", "ivytech location in kokomo", "kokomo campus address",
            "kokomo campus location", "how do i get to kokomo campus", "directions to kokomo campus"
        ],
        reply: "<strong>Kokomo Campus:</strong> <br> 1815 E. Morgan Street, Kokomo, IN 46901",
        url: "https://www.google.com/maps/place/1815+E+Morgan+St,+Kokomo,+IN+46901",
        link: "Google Maps"
    },
    {
        intent: "address_info_warsaw",
        pattern: [
            "warsaw campus", "warsaw location",
            "what is the address for ivytech in warsaw", "location of ivytech in warsaw", "where is ivytech located in warsaw",
            "ivytech address in warsaw", "ivytech location in warsaw", "what is the address for ivytech in warsaw",
            "location of ivytech in warsaw", "where is ivytech located in warsaw",
            "ivytech address in warsaw", "ivytech location in warsaw", "warsaw campus address",
            "warsaw campus location", "how do i get to warsaw campus", "directions to warsaw campus"
        ],
        reply: "<strong>Kosciusko County (Warsaw) Satellite Location:</strong> <br> 2545 Silveus Crossing, Warsaw, IN 46582",
        url: "https://www.google.com/maps/place/2545+Silveus+Crossing,+Warsaw,+IN+46582",
        link: "Google Maps"
    },
    {
        intent: "address_info_warsaw",
        pattern: [
            "warsaw campus", "warsaw location",
            "what is the address for ivytech in warsaw", "location of ivytech in warsaw", "where is ivytech located in warsaw",
            "ivytech address in warsaw", "ivytech location in warsaw", "what is the address for ivytech in warsaw",
            "location of ivytech in warsaw", "where is ivytech located in warsaw",
            "ivytech address in warsaw", "ivytech location in warsaw", "warsaw campus address",
            "warsaw campus location", "how do i get to warsaw campus", "directions to warsaw campus"
        ],
        reply: "<strong>Kosciusko County (Warsaw) Satellite Location:</strong> <br> 2545 Silveus Crossing, Warsaw, IN 46582",
        url: "https://www.google.com/maps/place/2545+Silveus+Crossing,+Warsaw,+IN+46582",
        link: "Google Maps"
    },
    {
        intent: "address_info_la_porte",
        pattern: [
            "la porte campus", "la porte location",
            "what is the address for ivytech in la porte", "location of ivytech in la porte", "where is ivytech located in la porte",
            "ivytech address in la porte", "ivytech location in la porte", "what is the address for ivytech in la porte",
            "location of ivytech in la porte", "where is ivytech located in la porte",
            "ivytech address in la porte", "ivytech location in la porte", "la porte campus address",
            "la porte campus location", "how do i get to la porte campus", "directions to la porte campus"
        ],
        reply: "<strong>La Porte Satellite Campus:</strong> <br> 1900 Whirlpool Dr, La Porte, IN 46350",
        url: "https://www.google.com/maps/place/1900+Whirlpool+Dr,+La+Porte,+IN+46350",
        link: "Google Maps"
    },
    {
        intent: "address_info_lafayette",
        pattern: [
            "lafayette campus", "lafayette location",
            "what is the address for ivytech in lafayette", "location of ivytech in lafayette", "where is ivytech located in lafayette",
            "ivytech address in lafayette", "ivytech location in lafayette", "what is the address for ivytech in lafayette",
            "location of ivytech in lafayette", "where is ivytech located in lafayette",
            "ivytech address in lafayette", "ivytech location in lafayette", "lafayette campus address",
            "lafayette campus location", "how do i get to lafayette campus", "directions to lafayette campus"
        ],
        reply: "<strong>Lafayette Satellite Campus:</strong> <br> 3101 S Creasy Ln, Lafayette, IN 47905",
        url: "https://www.google.com/maps/place/3101+S+Creasy+Ln,+Lafayette,+IN+47905",
        link: "Google Maps"
    },
    {
        intent: "address_lake_county",
        pattern: [
            "lake county campus", "lake county location",
            "what is the address for ivytech in lake county", "location of ivytech in lake county", "where is ivytech located in lake county",
            "ivytech address in lake county", "ivytech location in lake county", "what is the address for ivytech in lake county",
            "location of ivytech in lake county", "where is ivytech located in lake county",
            "ivytech address in lake county", "ivytech location in lake county", "lake county campus address",
            "lake county campus location", "how do i get to lake county campus", "directions to lake county campus"
        ],
        reply: "<strong>Lake County Satellite Campus:</strong> <br> has 3 locations: Crown Point, East Chicago, and Gary. Please specify which location you would like the address for.",
        url: "https://www.google.com/maps/place/2300+173rd+St,+Hammond,+IN+46323",
        link: "Google Maps"
    },
    {
        intent: "address_info_lawrence",
        pattern: [
            "lawrence campus", "lawrence location",
            "what is the address for ivytech in lawrence", "location of ivytech in lawrence", "where is ivytech located in lawrence",
            "ivytech address in lawrence", "ivytech location in lawrence", "what is the address for ivytech in lawrence",
            "location of ivytech in lawrence", "where is ivytech located in lawrence",
            "ivytech address in lawrence", "ivytech location in lawrence", "lawrence campus address",
            "lawrence campus location", "how do i get to lawrence campus", "directions to lawrence campus"
        ],
        reply: "<strong>Lawrence Satellite Campus:</strong> <br> 9301 E 59th St, Indianapolis, IN 46216",
        url: "https://www.google.com/maps/place/9301+E+59th+St,+Indianapolis,+IN+46216",
        link: "Google Maps"
    },
    {
        intent: "address_info_lawrenceburg",
        pattern: [
            "lawrenceburg campus", "lawrenceburg location",
            "what is the address for ivytech in lawrenceburg", "location of ivytech in lawrenceburg", "where is ivytech located in lawrenceburg",
            "ivytech address in lawrenceburg", "ivytech location in lawrenceburg", "what is the address for ivytech in lawrenceburg",
            "location of ivytech in lawrenceburg", "where is ivytech located in lawrenceburg",
            "ivytech address in lawrenceburg", "ivytech location in lawrenceburg", "lawrenceburg campus address",
            "lawrenceburg campus location", "how do i get to lawrenceburg campus", "directions to lawrenceburg campus"
        ],
        reply: "<strong>Lawrenceburg Campus:</strong> <br> 50 Walnut St, Lawrenceburg, IN 47025",
        url: "https://www.google.com/maps/place/50+Walnut+St,+Lawrenceburg,+IN+47025",
        link: "Google Maps"
    },
    {
        intent: "address_info_logansport",
        pattern: [
            "logansport campus", "logansport location",
            "what is the address for ivytech in logansport", "location of ivytech in logansport", "where is ivytech located in logansport",
            "ivytech address in logansport", "ivytech location in logansport", "what is the address for ivytech in logansport",
            "location of ivytech in logansport", "where is ivytech located in logansport",
            "ivytech address in logansport", "ivytech location in logansport", "logansport campus address",
            "logansport campus location", "how do i get to logansport campus", "directions to logansport campus"
        ],
        reply: "<strong>Logansport Campus:</strong> <br> 1 Ivy Tech Way, Logansport, IN 46947",
        url: "https://www.google.com/maps/place/1+Ivy+Tech+Way,+Logansport,+IN+46947",
        link: "Google Maps"
    },
    {
        intent: "address_info_madison",
        pattern: [
            "madison campus", "madison location",
            "what is the address for ivytech in madison", "location of ivytech in madison", "where is ivytech located in madison",
            "ivytech address in madison", "ivytech location in madison", "what is the address for ivytech in madison",
            "location of ivytech in madison", "where is ivytech located in madison",
            "ivytech address in madison", "ivytech location in madison", "madison campus address",
            "madison campus location", "how do i get to madison campus", "directions to madison campus"
        ],
        reply: "<strong>Madison Campus:</strong> <br> 590 Ivy Tech Dr, Madison, IN 47250",
        url: "https://www.google.com/maps/place/590+Ivy+Tech+Dr,+Madison,+IN+47250",
        link: "Google Maps"
    },
    {
        intent: "address_info_marion",
        pattern: [
            "marion campus", "marion location",
            "what is the address for ivytech in marion", "location of ivytech in marion", "where is ivytech located in marion",
            "ivytech address in marion", "ivytech location in marion", "what is the address for ivytech in marion",
            "location of ivytech in marion", "where is ivytech located in marion",
            "ivytech address in marion", "ivytech location in marion", "marion campus address",
            "marion campus location", "how do i get to marion campus", "directions to marion campus"
        ],
        reply: "<strong>Marion Campus:</strong> <br> 261 Commerce Dr, Marion, IN 46953",
        url: "https://www.google.com/maps/place/261+Commerce+Dr,+Marion,+IN+46953",
        link: "Google Maps"
    },
    {
        intent: "address_info_logansport",
        pattern: [
            "logansport campus", "logansport location",
            "what is the address for ivytech in logansport", "location of ivytech in logansport", "where is ivytech located in logansport",
            "ivytech address in logansport", "ivytech location in logansport", "what is the address for ivytech in logansport",
            "location of ivytech in logansport", "where is ivytech located in logansport",
            "ivytech address in logansport", "ivytech location in logansport", "logansport campus address",
            "logansport campus location", "how do i get to logansport campus", "directions to logansport campus"
        ],
        reply: "<strong>Logansport Campus:</strong> <br> 1 Ivy Tech Way, Logansport, IN 46947",
        url: "https://www.google.com/maps/place/1+Ivy+Tech+Way,+Logansport,+IN+46947",
        link: "Google Maps"
    },
    {
        intent: "address_info_michigan_city",
        pattern: [
            "michigan city campus", "michigan city location",
            "what is the address for ivytech in michigan city", "location of ivytech in michigan city", "where is ivytech located in michigan city",
            "ivytech address in michigan city", "ivytech location in michigan city", "what is the address for ivytech in michigan city",
            "location of ivytech in michigan city", "where is ivytech located in michigan city",
            "ivytech address in michigan city", "ivytech location in michigan city", "michigan city campus address",
            "michigan city campus location", "how do i get to michigan city campus", "directions to michigan city campus"
        ],
        reply: "<strong>Michigan City Satellite Campus:</strong> <br> 3714 Franklin St, Michigan City, IN 46360",
        url: "https://www.google.com/maps/place/3714+Franklin+St,+Michigan+City,+IN+46360",
        link: "Google Maps"
    },
    {
        intent: "address_info_muncie",
        pattern: [
            "muncie campus", "muncie location",
            "what is the address for ivytech in muncie", "location of ivytech in muncie", "where is ivytech located in muncie",
            "ivytech address in muncie", "ivytech location in muncie", "what is the address for ivytech in muncie",
            "location of ivytech in muncie", "where is ivytech located in muncie",
            "ivytech address in muncie", "ivytech location in muncie", "muncie campus address",
            "muncie campus location", "how do i get to muncie campus", "directions to muncie campus"
        ],
        reply: "<strong>Muncie Campus:</strong> <br> 345 S. High St, Muncie, IN 47305",
        url: "https://www.google.com/maps/place/345+S+High+St,+Muncie,+IN+47305",
        link: "Google Maps"
    },
    {
        intent: "address_info_new_castle",
        pattern: [
            "new castle campus", "new castle location",
            "what is the address for ivytech in new castle", "location of ivytech in new castle", "where is ivytech located in new castle",
            "ivytech address in new castle", "ivytech location in new castle", "what is the address for ivytech in new castle",
            "location of ivytech in new castle", "where is ivytech located in new castle",
            "ivytech address in new castle", "ivytech location in new castle", "new castle campus address",
            "new castle campus location", "how do i get to new castle campus", "directions to new castle campus"
        ],
        reply: "<strong>New Castle Satellite Campus:</strong> <br> 3325 IN-3, New Castle, IN 47362",
        url: "https://www.google.com/maps/place/3325+IN-3,+New+Castle,+IN+47362",
        link: "Google Maps"
    },
    {
        intent: "address_info_perkins_technology_center",
        pattern: [
            "perkins technology center", "perkins location",
            "what is the address for ivytech in perkins", "location of ivytech in perkins", "where is ivytech located in perkins",
            "ivytech address in perkins", "ivytech location in perkins", "what is the address for ivytech in perkins",
            "location of ivytech in perkins", "where is ivytech located in perkins",
            "ivytech address in perkins", "ivytech location in logansport", "logansport campus address",
            "perkins technology center campus location", "how do i get to perkins technology center campus", "directions to perkins technology center campus"
        ],
        reply: "<strong>Perkins Technology Center:</strong> <br> 1638 Production Rd, Jeffersonville, IN 47130",
        url: "https://www.google.com/maps/place/1638+Production+Rd,+Jeffersonville,+IN+47130",
        link: "Google Maps"
    },
    {
        intent: "address_info_peru",
        pattern: [
            "peru campus", "peru location",
            "what is the address for ivytech in peru", "location of ivytech in peru", "where is ivytech located in peru",
            "ivytech address in peru", "ivytech location in peru", "what is the address for ivytech in peru",
            "location of ivytech in peru", "where is ivytech located in peru",
            "ivytech address in peru", "ivytech location in peru", "peru campus address",
            "peru campus location", "how do i get to peru campus", "directions to peru campus"
        ],
        reply: "<strong>Peru Campus:</strong> <br> 425 W. Main St., Peru, IN 46970",
        url: "https://www.google.com/maps/place/425+W+Main+St,+Peru,+IN+46970",
        link: "Google Maps"
    },
    {
        intent: "address_info_plainfield",
        pattern: [
            "plainfield campus", "plainfield location",
            "what is the address for ivytech in plainfield", "location of ivytech in plainfield", "where is ivytech located in plainfield",
            "ivytech address in plainfield", "ivytech location in plainfield", "what is the address for ivytech in plainfield",
            "location of ivytech in plainfield", "where is ivytech located in plainfield",
            "ivytech address in plainfield", "ivytech location in plainfield", "plainfield campus address",
            "plainfield campus location", "how do i get to plainfield campus", "directions to plainfield campus"
        ],
        reply: "<strong>Plainfield Satellite Campus:</strong> <br> 1610 Reeves Rd, Plainfield, IN 46168",
        url: "https://www.google.com/maps/place/1610+Reeves+Rd,+Plainfield,+IN+46168",
        link: "Google Maps"
    },
    {
        intent: "address_info_richmond",
        pattern: [
            "richmond campus", "richmond location",
            "what is the address for ivytech in richmond", "location of ivytech in richmond", "where is ivytech located in richmond",
            "ivytech address in richmond", "ivytech location in richmond", "what is the address for ivytech in richmond",
            "location of ivytech in richmond", "where is ivytech located in richmond",
            "ivytech address in richmond", "ivytech location in richmond", "richmond campus address",
            "richmond campus location", "how do i get to richmond campus", "directions to richmond campus"
        ],
        reply: "<strong>Richmond Campus:</strong> <br> 2357 Chester Boulevard, Richmond, IN 47374",
        url: "https://www.google.com/maps/place/2357+Chester+Boulevard,+Richmond,+IN+47374",
        link: "Google Maps"
    },
    {
        intent: "address_info_rushville",
        pattern: [
            "rushville campus", "rushville location",
            "what is the address for ivytech in rushville", "location of ivytech in rushville", "where is ivytech located in rushville",
            "ivytech address in rushville", "ivytech location in rushville", "what is the address for ivytech in rushville",
            "location of ivytech in rushville", "where is ivytech located in rushville",
            "ivytech address in rushville", "ivytech location in rushville", "rushville campus address",
            "rushville campus location", "how do i get to rushville campus", "directions to rushville campus"
        ],
        reply: "<strong>Rushville Campus:</strong> <br> 330 N. Main St., Rushville, IN 46173",
        url: "https://www.google.com/maps/place/330+N+Main+St,+Rushville,+IN+46173",
        link: "Google Maps"
    },
    {
        intent: "address_info_richmond",
        pattern: [
            "richmond campus", "richmond location",
            "what is the address for ivytech in richmond", "location of ivytech in richmond", "where is ivytech located in richmond",
            "ivytech address in richmond", "ivytech location in richmond", "what is the address for ivytech in richmond",
            "location of ivytech in richmond", "where is ivytech located in richmond",
            "ivytech address in richmond", "ivytech location in richmond", "richmond campus address",
            "richmond campus location", "how do i get to richmond campus", "directions to richmond campus"
        ],
        reply: "<strong>Richmond Campus:</strong> <br> 2357 Chester Boulevard, Richmond, IN 47374",
        url: "https://www.google.com/maps/place/2357+Chester+Boulevard,+Richmond,+IN+47374",
        link: "Google Maps"
    },
    {
        intent: "address_info_scottsburg",
        pattern: [
            "scottsburg campus", "scottsburg location",
            "what is the address for ivytech in scottsburg", "location of ivytech in scottsburg", "where is ivytech located in scottsburg",
            "ivytech address in scottsburg", "ivytech location in scottsburg", "what is the address for ivytech in scottsburg",
            "location of ivytech in scottsburg", "where is ivytech located in scottsburg",
            "ivytech address in scottsburg", "ivytech location in scottsburg", "scottsburg campus address",
            "scottsburg campus location", "how do i get to scottsburg campus", "directions to scottsburg campus"
        ],
        reply: "<strong>Scottsburg Satellite Campus:</strong> <br> 821 South Lake Rd S, Scottsburg, IN 47170",
        url: "https://www.google.com/maps/place/821+South+Lake+Rd+S,+Scottsburg,+IN+47170",
        link: "Google Maps"
    },
    {
        intent: "address_info_sellersburg",
        pattern: [
            "sellersburg campus", "sellersburg location",
            "what is the address for ivytech in sellersburg", "location of ivytech in sellersburg", "where is ivytech located in sellersburg",
            "ivytech address in sellersburg", "ivytech location in sellersburg", "what is the address for ivytech in sellersburg",
            "location of ivytech in sellersburg", "where is ivytech located in sellersburg",
            "ivytech address in sellersburg", "ivytech location in sellersburg", "sellersburg campus address",
            "sellersburg campus location", "how do i get to sellersburg campus", "directions to sellersburg campus"
        ],
        reply: "<strong>Sellersburg Campus:</strong> <br> 8204 Highway 311, Sellersburg, IN 47172",
        url: "https://www.google.com/maps/place/8204+Highway+311,+Sellersburg,+IN+47172",
        link: "Google Maps"
    },
    {
        intent: "address_info_shelbyville",
        pattern: [
            "shelbyville campus", "shelbyville location",
            "what is the address for ivytech in shelbyville", "location of ivytech in shelbyville", "where is ivytech located in shelbyville",
            "ivytech address in shelbyville", "ivytech location in shelbyville", "what is the address for ivytech in shelbyville",
            "location of ivytech in shelbyville", "where is ivytech located in shelbyville",
            "ivytech address in shelbyville", "ivytech location in shelbyville", "shelbyville campus address",
            "shelbyville campus location", "how do i get to shelbyville campus", "directions to shelbyville campus"
        ],
        reply: "<strong>Shelbyville Satellite Campus:</strong> <br> 2177 Intelliplex Drive, Shelbyville, IN 46176",
        url: "https://www.google.com/maps/place/2177+Intelliplex+Drive,+Shelbyville,+IN+46176",
        link: "Google Maps"
    },
    {
        intent: "address_info_south_bend",
        pattern: [
            "south bend campus", "south bend location",
            "what is the address for ivytech in south bend", "location of ivytech in south bend", "where is ivytech located in south bend",
            "ivytech address in south bend", "ivytech location in south bend", "what is the address for ivytech in south bend",
            "location of ivytech in south bend", "where is ivytech located in south bend",
            "ivytech address in south bend", "ivytech location in south bend", "south bend campus address",
            "south bend campus location", "how do i get to south bend campus", "directions to south bend campus"
        ],
        reply: "<strong>South Bend Campus:</strong> <br> 220 Dean Johnson Blvd, South Bend, IN 46614",
        url: "https://www.google.com/maps/place/220+Dean+Johnson+Blvd,+South+Bend,+IN+46614",
        link: "Google Maps"
    },
    {
        intent: "address_info_tell_city",
        pattern: [
            "tell city campus", "tell city location",
            "what is the address for ivytech in tell city", "location of ivytech in tell city", "where is ivytech located in tell city",
            "ivytech address in tell city", "ivytech location in tell city", "what is the address for ivytech in tell city",
            "location of ivytech in tell city", "where is ivytech located in tell city",
            "ivytech address in tell city", "ivytech location in tell city", "tell city campus address",
            "tell city campus location", "how do i get to tell city campus", "directions to tell city campus"
        ],
        reply: "<strong>Tell City Satellite Campus:</strong> <br> 1034 31st Street, Tell City, IN 47586",
        url: "https://www.google.com/maps/place/1034+31st+Street,+Tell+City,+IN+47586",
        link: "Google Maps"
    },
    {
        intent: "address_info_terre_haute",
        pattern: [
            "terre haute campus", "terre haute location",
            "what is the address for ivytech in terre haute", "location of ivytech in terre haute", "where is ivytech located in terre haute",
            "ivytech address in terre haute", "ivytech location in terre haute", "what is the address for ivytech in terre haute",
            "location of ivytech in terre haute", "where is ivytech located in terre haute",
            "ivytech address in terre haute", "ivytech location in terre haute", "terre haute campus address",
            "terre haute campus location", "how do i get to terre haute campus", "directions to terre haute campus"
        ],
        reply: "<strong>Terre Haute Campus:</strong> <br> 8000 South Education Drive, Terre Haute, IN 47802",
        url: "https://www.google.com/maps/place/8000+South+Education+Drive,+Terre+Haute,+IN+47802",
        link: "Google Maps"
    },
    {
        intent: "address_info_valparaiso",
        pattern: [
            "valparaiso campus", "valparaiso location",
            "what is the address for ivytech in valparaiso", "location of ivytech in valparaiso", "where is ivytech located in valparaiso",
            "ivytech address in valparaiso", "ivytech location in valparaiso", "what is the address for ivytech in valparaiso",
            "location of ivytech in valparaiso", "where is ivytech located in valparaiso",
            "ivytech address in valparaiso", "ivytech location in valparaiso", "valparaiso campus address",
            "valparaiso campus location", "how do i get to valparaiso campus", "directions to valparaiso campus"
        ],
        reply: "<strong>Valparaiso Campus:</strong> <br> 3100 Ivy Tech Drive, Valparaiso, IN 46383",
        url: "https://www.google.com/maps/place/3100+Ivy+Tech+Drive,+Valparaiso,+IN+46383",
        link: "Google Maps"
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