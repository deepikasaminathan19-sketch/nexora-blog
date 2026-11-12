
import 'dotenv/config';
import bcrypt from 'bcrypt';
import connectDB from '../config/db.js';
import {
  User,
  Category,
  Author,
  Tag,
  Blog,
  Settings,
  slugify
} from '../models/index.js';

const REQUIRED_ARTICLES = 28;

const categoryNames = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Software Engineering',
  'Cybersecurity',
  'Cloud Computing',
  'Future Technology'
];

const authorsData = [
  {
    name: 'Aarav Menon',
    bio: 'A software engineer exploring artificial intelligence, language models and the changing relationship between people and technology.',
    avatar: 'https://ui-avatars.com/api/?name=Aarav+Menon&background=244B65&color=fff&size=200'
  },
  {
    name: 'Priya Raman',
    bio: 'A machine learning practitioner interested in making data science understandable, useful and accessible to everyone.',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Raman&background=B65B70&color=fff&size=200'
  },
  {
    name: 'Kavin Raj',
    bio: 'A frontend developer who writes about web standards, JavaScript, responsive design and thoughtful digital experiences.',
    avatar: 'https://ui-avatars.com/api/?name=Kavin+Raj&background=397C69&color=fff&size=200'
  },
  {
    name: 'Meera Krishnan',
    bio: 'A software engineer focused on clean architecture, developer collaboration, testing and reliable applications.',
    avatar: 'https://ui-avatars.com/api/?name=Meera+Krishnan&background=AD7442&color=fff&size=200'
  },
  {
    name: 'Rahul Varma',
    bio: 'A cybersecurity enthusiast writing about digital privacy, secure development and practical online safety.',
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Varma&background=67569A&color=fff&size=200'
  },
  {
    name: 'Ananya Iyer',
    bio: 'A cloud technology writer interested in infrastructure, distributed systems and building dependable services.',
    avatar: 'https://ui-avatars.com/api/?name=Ananya+Iyer&background=287D91&color=fff&size=200'
  },
  {
    name: 'Vikram Das',
    bio: 'A technology researcher exploring emerging computing ideas and their possible impact on everyday life.',
    avatar: 'https://ui-avatars.com/api/?name=Vikram+Das&background=9A5364&color=fff&size=200'
  }
];

// Individual editorial photographs.
// Each article has its own image and colour direction.
const image = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

const posts = [
  // 1–4: ARTIFICIAL INTELLIGENCE
  {
    title: 'How Large Language Models Actually Work',
    category: 'Artificial Intelligence',
    author: 'Aarav Menon',
    tags: ['Large Language Models', 'Generative AI', 'Natural Language Processing'],
    excerpt: 'Explore how large language models learn patterns from enormous collections of text and use those patterns to generate surprisingly human-like responses.',
    image: image('photo-1677442136019-21780ecad995'),
    imageAlt: 'Colourful abstract artificial intelligence concept',
    featured: true,
    sections: [
      ['A model learns from patterns', 'Large language models, commonly called LLMs, are machine learning systems trained on enormous collections of text. During training, they process examples and gradually learn relationships between words, sentences, concepts and the structure of language. They do not simply store a collection of ready-made answers. Instead, they develop mathematical representations that help them predict what text is likely to come next.'],
      ['Understanding tokens and transformers', 'Before text enters a model, it is divided into smaller units called tokens. These may represent complete words, parts of words or punctuation. Transformer architecture allows the model to examine relationships between tokens using a mechanism called attention. This helps it identify which parts of the input are relevant to the current context.'],
      ['From a question to an answer', 'When a person submits a question, the model converts the input into tokens and processes them through its learned network. It then predicts a likely next token, adds it to the response and repeats the process. The result is a sequence of generated tokens that forms an answer.'],
      ['What LLMs cannot guarantee', 'An LLM can produce fluent explanations while still making factual mistakes. Its output should not automatically be treated as verified information. Human review, reliable sources and careful evaluation remain important, especially in education, healthcare, finance and other sensitive fields.']
    ]
  },
  {
    title: 'Generative AI vs Traditional AI: What Is the Difference?',
    category: 'Artificial Intelligence',
    author: 'Aarav Menon',
    tags: ['Generative AI', 'Traditional AI', 'Artificial Intelligence'],
    excerpt: 'Traditional AI often predicts or classifies information, while generative AI creates new content. Understand the differences through practical examples.',
    image: image('photo-1518770660439-4636190af475'),
    imageAlt: 'Electronic components and a technology circuit board',
    sections: [
      ['Two approaches to intelligent systems', 'Artificial intelligence includes many approaches to solving problems. Traditional AI systems are commonly designed to recognise patterns, classify information, predict outcomes or recommend actions. Generative AI systems focus on producing new content, such as text, images, audio, video or computer code.'],
      ['How traditional AI is used', 'An email filtering system can examine message characteristics and estimate whether a message is spam. A recommendation engine can analyse previous behaviour to suggest products or films. These systems generally produce a prediction, classification or ranking rather than creating a complete new piece of content.'],
      ['What generative AI adds', 'Generative models learn patterns in training data and use them to create new outputs. A language model can draft an explanation, an image model can create an illustration, and an audio model can generate speech. The output is newly generated, even though the model learned from existing examples.'],
      ['Choosing the right approach', 'The best technology depends on the problem. A fraud detection task may benefit from classification, while creating a first draft of a marketing article may benefit from generative AI. Some applications combine both approaches, using predictive systems to evaluate information and generative systems to communicate results.']
    ]
  },
  {
    title: 'AI in Education: How Technology Supports Personalized Learning',
    category: 'Artificial Intelligence',
    author: 'Aarav Menon',
    tags: ['AI in Education', 'EdTech', 'Personalized Learning'],
    excerpt: 'Discover how adaptive learning platforms, intelligent feedback and AI-powered study tools can support different learning speeds and needs.',
    image: image('photo-1509062522246-3755977927d7'),
    imageAlt: 'Students learning together in a bright classroom',
    sections: [
      ['Learning does not happen at one speed', 'Every student approaches a subject differently. Some learners understand a concept immediately, while others need additional examples and practice. Traditional classrooms often have limited time to provide individual attention to every student. AI-powered educational tools can help address part of this challenge.'],
      ['Adaptive learning experiences', 'An adaptive platform can examine a learner’s answers, identify topics that need more practice and recommend suitable exercises. If a student repeatedly struggles with fractions, the system may provide simpler examples before moving to advanced problems. This creates a learning path that responds to individual progress.'],
      ['Feedback and study assistance', 'AI tools can help explain difficult concepts, generate practice questions and provide feedback on written work. They can also support teachers by helping organise learning materials and identify common areas of difficulty across a class.'],
      ['Keeping teachers at the centre', 'Technology cannot replace the encouragement, judgement and understanding that good teachers provide. Educational AI should be used with privacy protections, accessible design and human supervision. Its greatest value is helping students and educators spend more time on meaningful learning.']
    ]
  },
  {
    title: 'How AI Chatbots Understand and Respond to User Questions',
    category: 'Artificial Intelligence',
    author: 'Aarav Menon',
    tags: ['AI Chatbots', 'NLP', 'Conversational AI'],
    excerpt: 'A beginner-friendly look at how chatbots process messages, identify context and generate responses in conversational applications.',
    image: image('photo-1535223289827-42f1e9919769'),
    imageAlt: 'Colourful digital communication and technology installation',
    sections: [
      ['The journey begins with a message', 'When a user sends a message to a chatbot, the system first receives and processes the text. Depending on its design, it may identify the language, detect important phrases, recognise the user’s intention and extract useful details such as dates or product names.'],
      ['Intent, context and conversation', 'Older rule-based chatbots often rely on predefined patterns and responses. More advanced conversational systems use machine learning and language models to interpret a wider range of expressions. Conversation history can help them understand follow-up questions and maintain context.'],
      ['Generating a useful response', 'After processing a request, the chatbot selects or generates a response. A customer support bot might retrieve information from a knowledge base, while a generative chatbot might construct an explanation using a language model. Some systems combine retrieval with generation to improve factual accuracy.'],
      ['Designing responsible chatbots', 'Good chatbot design includes clear limitations, privacy safeguards and an easy way to contact a human when necessary. Developers should test unusual inputs, monitor failure cases and avoid presenting uncertain answers as guaranteed facts.']
    ]
  },

  // 5–8: MACHINE LEARNING
  {
    title: 'Choosing Between Supervised and Unsupervised Learning',
    category: 'Machine Learning',
    author: 'Priya Raman',
    tags: ['Supervised Learning', 'Unsupervised Learning', 'Data Science'],
    excerpt: 'Learn how labelled and unlabelled datasets shape two major machine learning approaches, and when each one makes sense.',
    image: image('photo-1551288049-bebda4e38f71'),
    imageAlt: 'Colourful data analytics charts on a computer display',
    sections: [
      ['Learning from labelled examples', 'Supervised learning trains a model using examples that include both input data and the correct output. A dataset containing house sizes and their selling prices, for example, can help a model learn to estimate the price of another house. The known answers guide the learning process.'],
      ['Finding structure without labels', 'Unsupervised learning works with data that does not include predefined answers. Instead of predicting a known target, the model searches for patterns, similarities or groups. A retailer might use clustering to identify customer groups based on purchasing behaviour.'],
      ['Important differences', 'Supervised learning is useful when a clear target is available, such as predicting a number or classifying an email. Unsupervised learning is useful when the goal is exploration, grouping or discovering hidden structure. Both approaches depend on data quality and appropriate evaluation.'],
      ['How to make a decision', 'Start by defining the problem and checking what information is available. If historical examples include reliable answers, supervised learning may be appropriate. If the objective is to explore relationships or discover groups, unsupervised learning may be a better starting point.']
    ]
  },
  {
    title: 'Machine Learning in Real Life: 7 Practical Applications',
    category: 'Machine Learning',
    author: 'Priya Raman',
    tags: ['Machine Learning', 'Real World AI', 'Applications'],
    excerpt: 'From spam filters to medical image analysis, explore seven everyday areas where machine learning helps people make decisions.',
    image: image('photo-1498050108023-c5249f4df085'),
    imageAlt: 'Modern workspace with laptop and development tools',
    sections: [
      ['Machine learning beyond the laboratory', 'Machine learning is already part of many everyday digital services. It allows software to learn patterns from data and use those patterns to make predictions or recommendations. Its applications range from simple convenience features to complex scientific tools.'],
      ['Seven practical applications', '1. Email filtering identifies suspicious or unwanted messages. 2. Recommendation systems suggest films, music and products. 3. Navigation applications estimate traffic and travel times. 4. Banking systems help detect unusual transactions. 5. Healthcare tools can assist specialists in examining medical images. 6. Predictive maintenance estimates when industrial equipment may need attention. 7. Speech recognition converts spoken language into text.'],
      ['Why data and evaluation matter', 'Each application depends on suitable training data and careful testing. A recommendation system may reflect historical preferences, while a fraud detection model must balance catching suspicious activity with avoiding unnecessary interruptions. Performance should be measured against the real purpose of the system.'],
      ['A tool, not a replacement for judgement', 'Machine learning can make information easier to process, but its predictions are not automatically correct. Human oversight, transparent evaluation and responsible handling of data are essential for systems that affect people.']
    ]
  },
  {
    title: 'Supervised, Unsupervised and Reinforcement Learning Explained',
    category: 'Machine Learning',
    author: 'Priya Raman',
    tags: ['Reinforcement Learning', 'ML Fundamentals', 'Algorithms'],
    excerpt: 'Understand three foundational machine learning approaches through simple examples, their training methods and practical use cases.',
    image: image('photo-1516321318423-f06f85e504b3'),
    imageAlt: 'Close-up of a complex electronic circuit board',
    sections: [
      ['Three ways machines can learn', 'Machine learning is not a single training method. Supervised learning, unsupervised learning and reinforcement learning approach problems in different ways. Understanding these differences helps developers choose suitable algorithms and prepare the right data.'],
      ['Supervised and unsupervised learning', 'Supervised learning uses labelled examples to learn a relationship between inputs and known outputs. Unsupervised learning looks for patterns in data without predefined target labels. Classification and regression are common supervised tasks, while clustering is a common unsupervised technique.'],
      ['Learning through rewards', 'Reinforcement learning trains an agent to make decisions by interacting with an environment. The agent receives rewards or penalties based on its actions and gradually learns a strategy. This approach is used in areas such as robotics, simulations and game-playing research.'],
      ['Selecting an approach', 'The choice depends on the problem, available data and desired outcome. Predicting a known result often suggests supervised learning. Discovering unknown groups suggests unsupervised learning. Learning a sequence of actions through feedback may suggest reinforcement learning.']
    ]
  },
  {
    title: 'Machine Learning Model Training: A Beginner’s Guide',
    category: 'Machine Learning',
    author: 'Priya Raman',
    tags: ['Model Training', 'Python', 'Machine Learning Basics'],
    excerpt: 'Follow the main stages of preparing data, training a model, evaluating results and improving a machine learning solution.',
    image: image('photo-1461749280684-dccba630e2f6'),
    imageAlt: 'Programming code displayed on a computer screen',
    sections: [
      ['Start with a clearly defined problem', 'Model training begins with a question. A developer might want to predict customer churn, identify spam messages or estimate delivery times. A clearly defined target helps determine which data is needed and how success should be measured.'],
      ['Prepare the dataset', 'Data preparation may involve removing duplicates, handling missing values, correcting inconsistent formats and converting categories into numerical representations. The dataset is generally divided into training and testing portions so that performance can be evaluated on examples the model did not learn from.'],
      ['Train and evaluate', 'During training, an algorithm adjusts its internal parameters to reduce prediction errors. Evaluation metrics depend on the task. Classification may use precision, recall and accuracy, while regression may use measures such as mean absolute error. No single metric is suitable for every problem.'],
      ['Improve without overfitting', 'A model can perform well on training data but poorly on new examples. This is called overfitting. Developers can use validation data, regularisation, suitable model complexity and careful feature selection to improve generalisation.']
    ]
  },

  // 9–12: WEB DEVELOPMENT
  {
    title: 'A Practical Guide to React Performance',
    category: 'Web Development',
    author: 'Kavin Raj',
    tags: ['React', 'Frontend', 'Performance'],
    excerpt: 'Learn practical techniques for making React applications feel faster, from measuring renders to managing large lists and assets.',
    image: image('photo-1555066931-4365d14bab8c'),
    imageAlt: 'Developer working with code in a dark editor',
    sections: [
      ['Measure before changing code', 'React performance work should begin with observation rather than guesswork. A page may feel slow because of large images, unnecessary network requests, expensive calculations or repeated component rendering. Browser developer tools and React profiling tools can help identify the actual cause.'],
      ['Keep components focused', 'Smaller components with clear responsibilities are easier to understand and maintain. Avoid passing rapidly changing data through unnecessarily large parts of the component tree. State should live close to the components that need it whenever practical.'],
      ['Use optimisation tools carefully', 'React provides tools such as memo, useMemo and useCallback for specific performance situations. They can reduce repeated work, but they also add complexity. Use them when profiling indicates that a calculation or render is genuinely expensive.'],
      ['Optimise the complete experience', 'Lazy loading, code splitting, responsive images and efficient API requests can improve perceived speed. Always test on realistic devices and network conditions. A fast experience is the result of a well-designed application, not simply a collection of optimisation hooks.']
    ]
  },
  {
    title: 'HTML, CSS and JavaScript: How They Work Together',
    category: 'Web Development',
    author: 'Kavin Raj',
    tags: ['HTML', 'CSS', 'JavaScript', 'Frontend Basics'],
    excerpt: 'Understand the three core technologies behind the modern web and how they combine to create interactive websites.',
    image: image('photo-1507238691740-187a5b1d37b8'),
    imageAlt: 'Creative website design displayed on a laptop',
    sections: [
      ['HTML creates the structure', 'HTML stands for HyperText Markup Language. It describes the content and structure of a webpage through elements such as headings, paragraphs, images, links and forms. Semantic HTML also gives browsers and assistive technologies useful information about the meaning of page content.'],
      ['CSS controls presentation', 'CSS stands for Cascading Style Sheets. It controls how elements appear, including colours, spacing, typography, alignment and responsive layouts. Modern CSS tools such as Flexbox and Grid make it easier to create layouts that adapt to different screen sizes.'],
      ['JavaScript adds behaviour', 'JavaScript makes pages interactive. It can respond to clicks, validate forms, update content, communicate with APIs and create dynamic interfaces. Developers use it to turn a static document into an application that responds to user actions.'],
      ['How the technologies work together', 'A browser reads HTML to build the document structure, applies CSS to determine its appearance and executes JavaScript to provide behaviour. Learning these technologies together gives beginners a strong foundation for frontend development.']
    ]
  },
  {
    title: 'Building Responsive Websites for Every Screen',
    category: 'Web Development',
    author: 'Kavin Raj',
    tags: ['Responsive Design', 'CSS', 'Web Design'],
    excerpt: 'Explore fluid layouts, flexible images, media queries and accessibility practices for websites that work across devices.',
    image: image('photo-1522542550221-31fd19575a2d'),
    imageAlt: 'Modern desk setup for responsive website development',
    sections: [
      ['Design for different conditions', 'People visit websites on phones, tablets, laptops and large desktop displays. A responsive website adapts its layout to the available space instead of assuming every visitor has the same screen size. This makes content easier to read and controls easier to use.'],
      ['Build flexible layouts', 'CSS Grid and Flexbox help create layouts that adjust naturally. Relative units, flexible containers and sensible maximum widths prevent content from becoming too cramped or stretched. Images should scale within their containers while maintaining their aspect ratio.'],
      ['Use media queries thoughtfully', 'Media queries allow developers to change layout rules when the viewport reaches particular conditions. A navigation layout may become more compact on a narrow screen, while a multi-column article grid may change into a single column.'],
      ['Test real user experiences', 'Responsive testing should include keyboard navigation, readable text, touch-friendly controls and sufficient colour contrast. Check different viewport sizes and avoid relying on one device alone. Good responsive design makes a website usable, not merely smaller.']
    ]
  },
  {
    title: 'JavaScript Fetch API: Connecting a Website to a Backend',
    category: 'Web Development',
    author: 'Kavin Raj',
    tags: ['JavaScript', 'Fetch API', 'REST API'],
    excerpt: 'Learn how the Fetch API sends HTTP requests, receives server responses and helps frontend applications work with backend data.',
    image: image('photo-1558494949-ef010cbdcc31'),
    imageAlt: 'Network server equipment in a technology data centre',
    sections: [
      ['Why websites communicate with servers', 'A frontend application often needs information that is stored on a backend. This might include user accounts, articles, product details or order information. The browser communicates with the server through HTTP requests.'],
      ['Understanding fetch()', 'The JavaScript Fetch API provides a way to make network requests. A basic request can retrieve data from an endpoint, and the response can be converted into JSON when the server returns JSON content. Fetch uses promises, making asynchronous operations easier to organise.'],
      ['Handle errors and loading states', 'A successful network request does not always mean the server returned a successful status code. Developers should check response.ok, handle network failures with try/catch and provide clear loading and error states to users.'],
      ['A practical example', 'A blog frontend might call a backend endpoint to retrieve published articles. The backend validates the request, queries its database and sends a JSON response. The frontend then displays the returned articles. This separation allows the interface and data services to evolve independently.']
    ]
  },

  // 13–16: SOFTWARE ENGINEERING
  {
    title: 'Writing Code Your Teammates Will Thank You For',
    category: 'Software Engineering',
    author: 'Meera Krishnan',
    tags: ['Clean Code', 'Teamwork', 'Software Engineering'],
    excerpt: 'Good code is not only code that works. Explore naming, structure, small functions and documentation that make software easier to maintain.',
    image: image('photo-1521737711867-e3b97375f902'),
    imageAlt: 'Software team collaborating around a table',
    sections: [
      ['Code is read more often than it is written', 'Software projects rarely belong to one developer forever. Teammates review code, fix defects and add features months or years after the original implementation. Clear code reduces the effort required to understand those changes.'],
      ['Choose meaningful names', 'Variables, functions and classes should communicate their purpose. A name such as calculateTotal is more useful than a vague name such as processData. Consistent naming helps readers understand intent without repeatedly examining implementation details.'],
      ['Keep functions focused', 'A function that handles too many unrelated tasks is difficult to test and modify. Smaller functions with clear responsibilities make behaviour easier to reason about. Avoid unnecessary complexity, repeated logic and deeply nested conditions.'],
      ['Make collaboration easier', 'Useful comments explain decisions that are not obvious from the code. Automated tests protect important behaviour, while code reviews help teams catch problems early. Clean code is ultimately an act of respect for the people who will work with it next.']
    ]
  },
  {
    title: 'Version Control with Git: A Practical Beginner Guide',
    category: 'Software Engineering',
    author: 'Meera Krishnan',
    tags: ['Git', 'GitHub', 'Version Control'],
    excerpt: 'Understand repositories, commits, branches and merges with a beginner-friendly explanation of the Git workflow.',
    image: image('photo-1556075798-4825dfaaf498'),
    imageAlt: 'Developer workstation with source code and version control tools',
    sections: [
      ['Why version control matters', 'When developers edit a project, they need a reliable way to track changes and work together. Git is a distributed version control system that records project history and makes it easier to compare, restore and combine changes.'],
      ['Repositories and commits', 'A Git repository stores project files and their history. A commit records a set of changes with a message describing what was updated. Useful commit messages make the project history easier to understand.'],
      ['Branches and collaboration', 'A branch provides an independent line of development. Developers can create a feature branch, make changes and later merge those changes into the main branch. Platforms such as GitHub make code review and collaboration easier through pull requests.'],
      ['A simple daily workflow', 'A common workflow is to check the current status, pull recent changes, create a branch, edit files, review the diff, stage changes, commit and push. Beginners should practise these steps on a small project before using them in a large team.']
    ]
  },
  {
    title: 'Software Testing: From Unit Tests to Integration Tests',
    category: 'Software Engineering',
    author: 'Meera Krishnan',
    tags: ['Software Testing', 'Unit Testing', 'Quality Assurance'],
    excerpt: 'Discover how different testing levels help developers find defects and build software that behaves reliably.',
    image: image('photo-1519389950473-47ba0277781c'),
    imageAlt: 'Technology team discussing software testing and development',
    sections: [
      ['Testing builds confidence', 'Software can appear to work in one situation and fail in another. Testing provides a structured way to check whether an application behaves as expected. It helps developers find defects earlier and reduces the risk of breaking existing features.'],
      ['Unit testing', 'Unit tests examine small pieces of code, such as individual functions or methods. They usually run quickly and focus on specific inputs and expected outputs. A unit test might verify that a price calculation returns the correct result for a particular order.'],
      ['Integration and end-to-end testing', 'Integration tests examine whether different components work together correctly, such as an application service communicating with a database. End-to-end tests simulate important user journeys through the complete application. Each level catches different kinds of problems.'],
      ['Build testing into development', 'Tests are most useful when they are repeatable and maintained alongside the code. Developers should cover important business rules, meaningful error conditions and critical user flows. Testing does not prove that software has no defects, but it makes quality more measurable.']
    ]
  },
  {
    title: 'REST APIs Explained: How Frontend and Backend Communicate',
    category: 'Software Engineering',
    author: 'Meera Krishnan',
    tags: ['REST API', 'Backend', 'HTTP'],
    excerpt: 'Learn how REST APIs organise resources and allow frontend applications to exchange information with backend services.',
    image: image('photo-1555949963-ff9fe0c870eb'),
    imageAlt: 'Rows of server infrastructure in a data centre',
    sections: [
      ['The frontend and backend have different responsibilities', 'The frontend presents an interface that people can interact with. The backend handles business logic, authentication, data storage and other services. APIs provide a defined way for these parts of an application to communicate.'],
      ['Resources and HTTP methods', 'REST is an architectural style commonly used for web APIs. It organises information as resources identified by URLs. GET commonly retrieves data, POST creates resources, PUT or PATCH updates them, and DELETE removes them.'],
      ['Requests and responses', 'An API request may include a URL, HTTP method, headers and a request body. The server processes the request and returns a status code and response data. JSON is a common format for exchanging structured information between frontend and backend systems.'],
      ['Designing dependable APIs', 'Good APIs use consistent naming, clear status codes, validation and suitable authentication. Developers should document endpoints and handle errors carefully. A well-designed API makes it easier for different applications and services to work together.']
    ]
  },

  // 17–20: CYBERSECURITY
  {
    title: 'Password Hygiene in 2026: What Still Matters',
    category: 'Cybersecurity',
    author: 'Rahul Varma',
    tags: ['Password Security', 'Privacy', 'Online Safety'],
    excerpt: 'Strong passwords, unique credentials and multi-factor authentication remain important habits for protecting online accounts.',
    image: image('photo-1510511459019-5dda7724fd87'),
    imageAlt: 'Laptop and personal workspace representing digital privacy',
    sections: [
      ['Why password habits still matter', 'Online accounts contain personal conversations, financial information, work documents and other valuable data. A compromised password can give attackers access to more than one service, especially when people reuse the same credentials across websites.'],
      ['Use unique and strong credentials', 'Every important account should have its own password. Long, unpredictable passwords are generally harder to guess than short, familiar combinations. A reputable password manager can generate and store unique credentials without requiring people to memorise each one.'],
      ['Add another layer of protection', 'Multi-factor authentication adds a verification step beyond a password. Authenticator applications and passkeys can provide stronger protection than relying only on passwords. Recovery methods should also be secured and kept up to date.'],
      ['Make security a regular habit', 'Review account activity, update recovery details and change credentials if an account may have been exposed. Be careful with unexpected login prompts and links. Security improves when strong technical protections are combined with informed everyday behaviour.']
    ]
  },
  {
    title: 'Phishing Attacks: How to Recognise and Avoid Them',
    category: 'Cybersecurity',
    author: 'Rahul Varma',
    tags: ['Phishing', 'Cybersecurity Awareness', 'Email Safety'],
    excerpt: 'Learn how fraudulent emails, messages and websites imitate trusted organisations to steal information or gain access to accounts.',
    image: image('photo-1550751827-4bd374c3f58b'),
    imageAlt: 'Cybersecurity themed digital security illustration',
    sections: [
      ['What is phishing?', 'Phishing is a social engineering attack in which criminals pretend to be a trusted person or organisation. Their goal may be to steal passwords, collect payment information, deliver harmful software or persuade someone to reveal confidential information.'],
      ['Recognising warning signs', 'Unexpected urgency, unusual sender addresses, unfamiliar links, unexpected attachments and requests for sensitive information can all be warning signs. Some phishing messages are carefully written and may imitate the branding of legitimate organisations.'],
      ['Verify before responding', 'Instead of using a link in a suspicious message, visit the organisation’s official website directly. Confirm unexpected requests through a separate trusted channel. Never share one-time passwords or account recovery codes with someone who contacts you unexpectedly.'],
      ['What to do after a mistake', 'If credentials were entered on a suspicious website, change the password using the official service and secure any other account that reused it. Report the message to the relevant organisation and contact your bank promptly if financial details may be affected.']
    ]
  },
  {
    title: 'Securing Web Applications: Essential Developer Practices',
    category: 'Cybersecurity',
    author: 'Rahul Varma',
    tags: ['Web Security', 'Secure Coding', 'OWASP'],
    excerpt: 'Explore practical security habits for developers, including input validation, access control, safe configuration and dependency management.',
    image: image('photo-1563013544-824ae1b704d3'),
    imageAlt: 'Digital security concept with a protected laptop',
    sections: [
      ['Security starts during development', 'Web application security should not be added only after a product is complete. Developers should consider threats while designing routes, handling user input, storing information and connecting external services. Early security decisions can prevent expensive problems later.'],
      ['Validate and handle input safely', 'Never assume that information received from a browser is trustworthy. Validate inputs on the server, use safe database query methods and escape output appropriately. These practices help reduce risks such as injection attacks and cross-site scripting.'],
      ['Protect accounts and permissions', 'Authentication verifies who a user is, while authorisation determines what that user can do. Applications should use secure password hashing, appropriate session handling and least-privilege permissions. Sensitive operations must be checked on the server, not only hidden in the interface.'],
      ['Maintain the application', 'Keep dependencies updated, protect environment secrets, use HTTPS and avoid exposing internal error details. Security testing, logging and a clear update process help teams respond when weaknesses are discovered.']
    ]
  },
  {
    title: 'Multi-Factor Authentication: An Extra Layer of Account Security',
    category: 'Cybersecurity',
    author: 'Rahul Varma',
    tags: ['MFA', 'Authentication', 'Account Security'],
    excerpt: 'Understand how multi-factor authentication works and why a second verification factor can reduce the risk of account compromise.',
    image: image('photo-1614064641938-3bbee52942c7'),
    imageAlt: 'Abstract cybersecurity visual with glowing digital patterns',
    sections: [
      ['More than a password', 'A password is one way to prove identity, but it can be stolen, guessed or exposed in a data breach. Multi-factor authentication requires an additional form of verification, making it harder for an attacker to access an account with only a password.'],
      ['The main authentication factors', 'Authentication factors generally fall into three groups: something a person knows, such as a password; something they have, such as a security key; and something they are, such as a biometric characteristic. Multi-factor authentication combines different factor types.'],
      ['Common methods', 'One-time codes, authenticator applications, hardware security keys and passkeys are used in modern authentication systems. Their security characteristics differ. Phishing-resistant methods, including appropriately implemented security keys and passkeys, can offer stronger protection against fake login websites.'],
      ['Use MFA thoughtfully', 'Enable multi-factor authentication on important accounts and store recovery codes securely. Do not approve unexpected login requests. Organisations should provide safe recovery processes so that stronger authentication does not create unnecessary barriers for legitimate users.']
    ]
  },

  // 21–24: CLOUD COMPUTING
  {
    title: 'Cloud Cost Control for Small Teams',
    category: 'Cloud Computing',
    author: 'Ananya Iyer',
    tags: ['Cloud Computing', 'FinOps', 'Cost Optimisation'],
    excerpt: 'Practical ways for small development teams to understand cloud spending, avoid waste and plan infrastructure costs.',
    image: image('photo-1451187580459-43490279c0fa'),
    imageAlt: 'Earth viewed from space with a network of lights',
    sections: [
      ['Cloud flexibility comes with responsibility', 'Cloud services allow teams to access computing, storage and managed infrastructure without purchasing physical servers. This flexibility makes experimentation easier, but costs can increase when resources are left running or services are configured without clear limits.'],
      ['Understand where money goes', 'Begin by reviewing billing reports and grouping costs by project, environment and service. Tags and budgets can help identify which workloads generate spending. Teams should understand the difference between fixed commitments and usage-based charges.'],
      ['Reduce avoidable waste', 'Remove unused resources, select appropriate instance sizes and review storage retention policies. Development environments do not always need to run continuously. Automated shutdown schedules and alerts can help prevent unnecessary charges.'],
      ['Build a cost-aware culture', 'Cost management works best when developers can see the financial impact of their technical choices. Regular reviews, clear ownership and simple budgets help small teams balance performance, reliability and affordability.']
    ]
  },
  {
    title: 'Edge Computing: Bringing Servers Closer to Users',
    category: 'Cloud Computing',
    author: 'Ananya Iyer',
    tags: ['Edge Computing', 'Cloud Infrastructure', 'IoT'],
    excerpt: 'Discover how processing data closer to its source can reduce delays and support connected devices and real-time applications.',
    image: image('photo-1544197150-b99a580bb7a8'),
    imageAlt: 'Electronic hardware representing distributed computing infrastructure',
    sections: [
      ['Why location matters', 'In traditional cloud computing, devices often send information to central data centres for processing. For applications that need quick responses, the distance between the device and the server can contribute to network delay. Edge computing moves some processing closer to where data is created or used.'],
      ['How edge computing works', 'An edge device or nearby server can process information locally, filter unnecessary data and send only relevant results to a central cloud service. This can reduce network traffic and help applications continue operating when connectivity is limited.'],
      ['Practical applications', 'Industrial sensors, connected vehicles, smart buildings and some healthcare devices can benefit from local processing. A factory may analyse machine sensor readings near the equipment instead of sending every measurement to a distant data centre.'],
      ['Trade-offs to consider', 'Edge systems introduce challenges such as distributed management, security updates, device limitations and data consistency. Many real-world architectures combine edge computing with cloud services rather than choosing only one approach.']
    ]
  },
  {
    title: 'Cloud Storage and Databases: Choosing the Right Option',
    category: 'Cloud Computing',
    author: 'Ananya Iyer',
    tags: ['Cloud Storage', 'Databases', 'Cloud Architecture'],
    excerpt: 'Understand the difference between object storage, file storage, relational databases and document databases.',
    image: image('photo-1560732488-6b0df240254a'),
    imageAlt: 'Modern data centre infrastructure and network storage',
    sections: [
      ['Different data needs require different tools', 'Cloud platforms provide several ways to store information. Files, images, database records and backups have different access patterns and consistency requirements. Choosing a storage service should begin with understanding how the application uses its data.'],
      ['Object and file storage', 'Object storage is useful for large collections of files such as images, videos, documents and backups. File storage presents a shared directory structure that applications can access as files. Both can support workloads that do not require traditional database queries.'],
      ['Relational and document databases', 'Relational databases organise information into tables and support structured queries and relationships. Document databases store flexible records, often in JSON-like structures. The best choice depends on data relationships, query patterns, consistency requirements and operational needs.'],
      ['Make the choice based on the workload', 'Consider performance, cost, backup, security and future growth. A web application may use a relational database for accounts and transactions while storing uploaded images in object storage. Combining services thoughtfully is often more effective than forcing every kind of data into one system.']
    ]
  },
  {
    title: 'Containers and Docker: A Beginner-Friendly Introduction',
    category: 'Cloud Computing',
    author: 'Ananya Iyer',
    tags: ['Docker', 'Containers', 'DevOps'],
    excerpt: 'Learn what containers are, why developers use Docker and how container images help applications run consistently.',
    image: image('photo-1667372393119-3d4c48d07fc9'),
    imageAlt: 'Hardware components representing modern application infrastructure',
    sections: [
      ['The problem of different environments', 'An application may work on one developer’s laptop but fail on another machine because of different software versions, dependencies or configuration. Containers help package an application with many of the components it needs to run.'],
      ['What is a container?', 'A container is an isolated process that uses the host operating system kernel. Unlike a traditional virtual machine, it does not normally require a complete guest operating system. This makes containers relatively lightweight and convenient for running application services.'],
      ['Understanding Docker', 'Docker is a platform and toolset used to build and run containers. A Dockerfile describes how to create an image. The image can then be used to start containers in different environments, helping developers keep application setup more consistent.'],
      ['Where containers are useful', 'Containers are widely used for local development, automated testing and deployment. They can make it easier to run an application alongside services such as databases and caches. Production environments still need proper security, monitoring, storage and resource management.']
    ]
  },

  // 25–28: FUTURE TECHNOLOGY
  {
    title: 'Quantum Computing for Curious Developers',
    category: 'Future Technology',
    author: 'Vikram Das',
    tags: ['Quantum Computing', 'Emerging Technology', 'Computing'],
    excerpt: 'Explore qubits, superposition and quantum gates, and understand why quantum computers are different from classical machines.',
    image: image('photo-1635070041078-e363dbe005cb'),
    imageAlt: 'Abstract mathematical and scientific visualisation',
    sections: [
      ['A different model of computation', 'Classical computers represent information using bits, which have values of zero or one. Quantum computers use quantum bits, called qubits. Qubits follow the rules of quantum mechanics, creating computational possibilities that differ from conventional digital systems.'],
      ['Superposition and entanglement', 'Superposition allows a qubit to be represented as a combination of possible states before measurement. Entanglement describes correlations between quantum systems that cannot be explained by treating them independently. These properties are central to quantum computing, but they do not mean a quantum computer simply tries every answer at once.'],
      ['Quantum gates and algorithms', 'Quantum circuits use operations called quantum gates to transform qubit states. Specialised algorithms may provide advantages for particular mathematical or scientific problems. Quantum computing is being researched for areas such as chemistry simulation, optimisation and cryptography.'],
      ['What developers should know', 'Current quantum computers face major engineering challenges, including noise and error correction. They are not replacements for ordinary laptops or servers. Developers interested in the field can begin by learning linear algebra, probability and the basic principles of quantum circuits.']
    ]
  },
  {
    title: 'The Internet of Things: Connecting Everyday Devices',
    category: 'Future Technology',
    author: 'Vikram Das',
    tags: ['IoT', 'Connected Devices', 'Smart Technology'],
    excerpt: 'Understand how sensors, networks and software connect physical objects and enable useful applications across homes and industries.',
    image: image('photo-1558618666-fcd25c85cd64'),
    imageAlt: 'Connected electronic hardware and sensor components',
    sections: [
      ['Everyday objects become connected', 'The Internet of Things, or IoT, describes networks of physical devices that collect and exchange data. These devices may include sensors, appliances, industrial equipment, vehicles and wearable technology. Connectivity allows them to communicate with software services and other devices.'],
      ['The main building blocks', 'An IoT solution usually includes sensors or devices, a communication network, data processing and an application interface. Sensors collect information such as temperature or movement. Networks transmit data, while software interprets it and may trigger an action.'],
      ['Applications in daily life', 'Smart thermostats can adjust heating based on conditions, agricultural sensors can monitor soil moisture, and industrial systems can track equipment performance. The usefulness of each application depends on accurate data, reliable connectivity and appropriate automation.'],
      ['Security and privacy challenges', 'Connected devices can create additional security risks if they use weak passwords, outdated software or unsafe network settings. Developers and manufacturers should provide secure updates, protect collected data and limit access to device functions.']
    ]
  },
  {
    title: 'Augmented Reality and Virtual Reality: What Developers Should Know',
    category: 'Future Technology',
    author: 'Vikram Das',
    tags: ['AR', 'VR', 'Extended Reality'],
    excerpt: 'Explore how augmented reality and virtual reality create different digital experiences and what developers need to build them.',
    image: image('photo-1593508512255-86ab42a8e620'),
    imageAlt: 'Immersive digital visualisation in a colourful technology space',
    sections: [
      ['Two ways of experiencing digital worlds', 'Augmented reality adds digital elements to a view of the physical world. Virtual reality places a person inside a computer-generated environment. Both technologies create interactive experiences, but they differ in how they relate to the real surroundings.'],
      ['Augmented reality in practice', 'AR applications may display navigation information, product previews, educational labels or interactive instructions over a camera view. Developers need to consider device cameras, tracking, spatial understanding and how digital objects align with the environment.'],
      ['Virtual reality experiences', 'VR applications use headsets and controllers to create immersive environments. Developers must consider movement, interaction, frame rate and comfort. Poor performance or unexpected motion can make a VR experience unpleasant for users.'],
      ['Skills and design considerations', 'AR and VR development can involve 3D modelling, spatial interaction, performance optimisation and user experience design. The best applications solve a clear problem rather than using immersive technology simply because it is available.']
    ]
  },
  {
    title: 'Blockchain Technology Beyond Cryptocurrency',
    category: 'Future Technology',
    author: 'Vikram Das',
    tags: ['Blockchain', 'Distributed Systems', 'Web3'],
    excerpt: 'Learn how shared ledgers, cryptographic links and smart contracts can support applications beyond digital currencies.',
    image: image('photo-1639762681485-074b7f938ba0'),
    imageAlt: 'Abstract blockchain network with connected digital nodes',
    sections: [
      ['A shared record of information', 'A blockchain is a type of distributed ledger in which records are grouped into blocks and linked using cryptographic techniques. Copies of the ledger may be maintained by multiple participants, depending on the network design. This can make unauthorised changes easier to detect.'],
      ['How transactions are recorded', 'Participants submit transactions to a network. The network follows a consensus mechanism to determine which transactions should be accepted and added to the ledger. Different blockchain systems use different methods, with different trade-offs in performance, security and energy use.'],
      ['Smart contracts and applications', 'Smart contracts are programs deployed on supported blockchain networks. They can execute predefined rules when transactions occur. Potential applications include tracking supply chains, coordinating digital assets and managing certain shared records.'],
      ['Understanding the limitations', 'Blockchain is not automatically the best solution for every database problem. Public networks may have transaction costs, performance constraints and privacy challenges. Developers should compare blockchain with conventional databases and choose it only when its specific properties provide meaningful value.']
    ]
  }
];

function makeContent(sections) {
  return sections.map(([heading, paragraph]) =>
    `<h2>${heading}</h2><p>${paragraph}</p>`
  ).join('');
}

function countWords(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
}

function readingTime(html) {
  return Math.max(1, Math.ceil(countWords(html) / 200));
}

function validatePosts() {
  if (posts.length !== REQUIRED_ARTICLES) {
    throw new Error(`Expected ${REQUIRED_ARTICLES} articles, found ${posts.length}`);
  }

  const slugs = posts.map(post => slugify(post.title));
  if (new Set(slugs).size !== posts.length) {
    throw new Error('Duplicate article titles/slugs found.');
  }

  const imageUrls = posts.map(post => post.image);
  if (new Set(imageUrls).size !== posts.length) {
    throw new Error('Duplicate article thumbnail URLs found.');
  }

  const counts = {};
  for (const post of posts) {
    if (!categoryNames.includes(post.category)) {
      throw new Error(`Unknown category: ${post.category}`);
    }

    if (!authorsData.some(author => author.name === post.author)) {
      throw new Error(`Unknown author: ${post.author}`);
    }

    if (!post.excerpt || post.excerpt.length > 300) {
      throw new Error(`Invalid excerpt: ${post.title}`);
    }

    if (!post.imageAlt || !post.tags?.length || !post.sections?.length) {
      throw new Error(`Missing article data: ${post.title}`);
    }

    counts[post.category] = (counts[post.category] || 0) + 1;
  }

  for (const category of categoryNames) {
    if (counts[category] !== 4) {
      throw new Error(`${category} should contain 4 articles; found ${counts[category] || 0}`);
    }
  }

  return counts;
}

async function seed() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env');
  }

  if (process.env.ADMIN_PASSWORD.length < 8) {
    throw new Error('ADMIN_PASSWORD must contain at least 8 characters.');
  }

  const categoryCounts = validatePosts();

  await connectDB();

  console.log('Connected. Preparing NEXORA content...');

  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();

  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
      }
    },
    { upsert: true, new: true, runValidators: true }
  );

  await Settings.findOneAndUpdate(
    {},
    {
      $setOnInsert: {
        siteName: 'NEXORA',
        tagline: 'EXPLORE. LEARN. INNOVATE.'
      }
    },
    { upsert: true, new: true }
  );

  const categories = {};

  for (const name of categoryNames) {
    categories[name] = await Category.findOneAndUpdate(
      { name },
      {
        $set: {
          name,
          slug: slugify(name),
          description: `Explore practical insights, guides and ideas about ${name}.`
        }
      },
      { upsert: true, new: true, runValidators: true }
    );
  }

  const authors = {};

  for (const authorData of authorsData) {
    authors[authorData.name] = await Author.findOneAndUpdate(
      { name: authorData.name },
      {
        $set: authorData
      },
      { upsert: true, new: true, runValidators: true }
    );
  }

  const tagCache = {};

  async function getTag(name) {
    if (!tagCache[name]) {
      tagCache[name] = await Tag.findOneAndUpdate(
        { name },
        {
          $set: {
            name,
            slug: slugify(name)
          }
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

    return tagCache[name];
  }

  const now = Date.now();

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    const content = makeContent(post.sections);
    const articleTags = await Promise.all(post.tags.map(getTag));
    const articleSlug = slugify(post.title);

    const seoTitle = `${post.title} | NEXORA`;

    const seoDescription =
      post.excerpt.length > 155
        ? post.excerpt.slice(0, 152).trimEnd() + '...'
        : post.excerpt;

    await Blog.findOneAndUpdate(
      { slug: articleSlug },
      {
        $set: {
          title: post.title,
          slug: articleSlug,
          excerpt: post.excerpt,
          content,
          category: categories[post.category]._id,
          tags: articleTags.map(tag => tag._id),
          author: authors[post.author]._id,
          image: post.image,
          imageAlt: post.imageAlt,
          seoTitle,
          seoDescription,
          status: 'published',
          publishedAt: new Date(now - i * 86400000),
          featured: Boolean(post.featured),
          readingTime: readingTime(content)
        },
        $setOnInsert: {
          views: 0,
          helpfulYes: 0,
          helpfulNo: 0
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    console.log(`Published ${i + 1}/${posts.length}: ${post.title}`);
  }

  console.log('\n----------------------------------');
  console.log('NEXORA SEED COMPLETED SUCCESSFULLY');
  console.log('----------------------------------');
  console.log('Articles:', posts.length);
  console.log('Categories:', categoryNames.length);
  console.log('Authors:', authorsData.length);
  console.log('Category distribution:', categoryCounts);
  console.log('Admin email:', email);
  console.log('----------------------------------');
}

try {
  await seed();
} catch (error) {
  console.error('\nNEXORA seed failed:', error);
  process.exitCode = 1;
} finally {
  // Close the database connection cleanly.
  const mongoose = (await import('mongoose')).default;
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
