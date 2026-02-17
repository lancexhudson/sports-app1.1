Overtime Sports App – Product Requirements Document (PRD)Author: Lance Hudson
Date: November 2025
Version: 1.0

1. Executive Summary
   Overtime is a modern, fan-centric sports app inspired by the fan-first digital experiences. It delivers real-time scores, top news, social buzz, league standings, and interactive fan polls in a clean, dark-mode interface optimized for mobile and desktop.Built as a personal passion project using React, Axios, and ESPN's public API, Overtime demonstrates my ability to conceive, design, and deliver a consumer-facing product from idea to deployment. It reflects my deep interest in sports media and my goal to transition into Product Management at a company like ESPN or Barstool Sports, where I can help shape the future of fan engagement.

2. Business Case & Opportunity
   Problem: Sports fans want a single, fast, beautiful place to stay updated — but many apps feel cluttered, slow, or ad-heavy. Mobile users especially need quick access to scores and news without digging through menus.

   Opportunity: With over 150 million sports fans in the U.S. alone, there's strong demand for intuitive digital experiences. Organizations like Barstool, ESPN, and FOX Sports have led the way with innovative apps, but there's always room to push boundaries in personalization, real-time data, and community interaction.

   Value Proposition: Overtime provides a minimalist, high-performance sports hub that prioritizes speed, readability, and fun — perfect for casual fans and die-hards alike.

   Success Metrics:
   User retention: 60% day-7 return rate

   Engagement:
   Average session duration > 3 minutes  
    Feature adoption: 40% of users interact with polls

3. User Personas
   Casual Fan (Alex, 28) Checks scores 2–3 times/day  
   Wants fast loading, clean design  
   Enjoys polls and social highlights

   Die-Hard Fan (Maria, 35) Follows multiple sports  
    Needs standings, news, and real-time updates  
    Values accuracy and depth

   Mobile-First User (Jordan, 22) Always on phone  
    Hates slow apps and cluttered UI  
    Loves interactive features like polls

4. Core Features & Requirements
   MVP Scope (Delivered): Feature, Description, Priority, Status, Live Scores, Real-time final and upcoming games from ESPN API, Top Stories, Latest news headlines with images and links, Fan Polls
   Interactive polls with live results (localStorage), Social Feed (X.com), Standings, League rankings (mock + API), Responsive Design, Mobile-first, dark mode, sticky footer

   Future Enhancements (Post-MVP Ideas): User accounts & personalized feeds, Push notifications for favorite teams, Video highlights integration

5. Technical Overview
   Frontend: React (Create React App), React Router
   Data Sources: ESPN public API (scores/news), X.com API (social)
   State Management: React hooks (useState, useEffect)
   Styling: CSS modules + global index.css (dark theme, mobile-first)
   Deployment: Netlify (continuous deployment from GitHub)
   Storage: localStorage for poll votes (demo mode)

6. Design & UX Principles
   Dark mode for reduced eye strain during night games
   Minimalist cards with orange accents (#ff6b35) for energy
   Mobile-first: Vertical stacking, large tap targets
   Performance: Optimized API calls, lazy loading where possible
   Accessibility: Semantic HTML, sufficient contrast ratios

7. Risks & Mitigations
   API rate limits - Fallback to mock data, cache responses, Mobile layout issues, Extensive responsive testing, media queries, Use official ESPN endpoints, graceful error handling, Scope creep, Strict MVP focus for showcase

8. Conclusion
   Overtime represents my passion for sports, technology, and user-centered design. It’s not just a project — it’s a prototype of the kind of impactful digital experiences I want to build at XYZ Co.
   By combining real-time data, clean UX, and interactive features, Overtime shows I can: Understand user needs, Work with APIs and constraints, Deliver polished, performant products, Think like a Product Manager

Live Demo: https://overtimesportsapp.netlify.app/
Source Code: https://github.com/lancexhudson/sports-app1.1
