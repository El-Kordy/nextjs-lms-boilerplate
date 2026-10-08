# WNM LMS — Project Plan & Progress

> **Project status document**
>
> This document is the source of truth for the WNM LMS project.
>
> **Rule:** Only record work that has actually been completed, decisions that have been explicitly approved, and work that has been intentionally planned for later. Do not mark future work as completed.

---

## 1. Project Vision

WNM is a learning management platform where students can:

* Discover courses
* Discover curated Learning Paths
* Enroll in courses
* Learn through structured lessons
* Watch videos
* Read rich lesson content
* Track their learning progress
* Take optional diagnostic assessments
* Review identified weak areas
* Retake assessments with different questions
* Ask questions and participate in course/lesson discussions

Instructors are part of the V1 product and will be able to create and manage courses.

Administrators will manage the platform, users, courses, Learning Paths, moderation, and security.

The platform is designed to start small and grow with real users rather than implementing every possible feature before launch.

---

# 2. Current Development Philosophy

The project follows these principles:

1. **Build a real MVP, not a giant LMS.**
2. **Make expensive architectural decisions correctly before implementation.**
3. **Do not build future features before they are needed.**
4. **Keep the architecture ready for future expansion.**
5. **Use real database/authentication instead of fake production data.**
6. **Keep the application as a modular monolith initially.**
7. **Prefer simple infrastructure while the project has no users.**
8. **Use YouTube for video initially.**
9. **Introduce self-hosted protected video when paid courses justify the infrastructure.**
10. **Keep AI out of the V1 dependency chain while making the learning data AI-ready for future use.**
11. **Support, Chat, badges, certificates, advanced assessment systems, and other advanced systems are future features unless explicitly moved forward.**
12. **Learning Paths and the defined diagnostic assessment experience are explicit V1 exceptions to the otherwise deferred advanced-feature rule.**

---

# 3. What Has Been Completed

## 3.1 Repository Baseline

The original Next.js LMS boilerplate was audited before architectural changes were made.

The repository was initialized with Git.

Initial branch:

```text
main
```

Original boilerplate was preserved in the first baseline commit:

```text
8db35ea chore: baseline original boilerplate
```

---

## 3.2 Dependency Build Configuration

The project uses `pnpm`.

The required package build scripts were reviewed and approved.

Approved packages:

* `msw`
* `sharp`
* `unrs-resolver`

The configuration was committed:

```text
ff25e99 chore: configure pnpm dependency builds
```

---

## 3.3 Legacy Messages System Removed

The original global Messages/DM system was determined to be incompatible with the new LMS architecture.

The following legacy feature was removed:

```text
src/features/messages
src/app/(member)/messages
src/app/(admin)/admin/messages
```

The old global messaging architecture is **not part of WNM V1**.

Course/lesson Q&A remains a separate feature.

Future private/global Chat may be implemented later as a separate system.

---

## 3.4 Messages Navigation Removed

Legacy Messages references were removed from:

* Member navigation
* Admin navigation
* Routes
* Middleware protected prefixes
* Layout properties
* Dashboard statistics
* Member pages
* Admin pages

The old `unreadMessages` prop was also removed from the affected layouts/pages.

---

## 3.5 Legacy Messaging Routes Removed

The old routes:

```text
/messages
/admin/messages
```

were removed from the route configuration.

---

## 3.6 Architecture Review Completed

Independent architecture reviews were obtained from:

* Claude
* Kimi
* Qwen

The reviews were compared and used to establish the current WNM architecture direction.

The reviews broadly agreed that the original boilerplate contains legacy business assumptions that should not be carried into the new platform.

---

# 4. Legacy Systems Approved for Removal

The following old boilerplate concepts are not part of the new WNM architecture:

* Foyzul branding
* Foyzul's Circle branding
* bKash-specific payment logic
* Nagad-specific payment logic
* Telegram-specific profile/contact fields
* Old membership/subscription assumptions
* Old `MemberStatus` model
* Fake authentication
* Fake role switching
* Legacy global Messages
* Old API-client architecture
* Old Bangladesh-specific business logic
* Old single-admin assumptions

These should be removed/refactored as the cleanup phase continues.

---

# 5. Current Architecture Decisions

## 5.1 Application Architecture

WNM will initially use a:

**Next.js modular monolith**

rather than multiple separate backend/frontend services.

---

## 5.2 Database

The application will use:

* PostgreSQL
* Drizzle ORM

Database-backed application data will replace the legacy mock business logic as the real features are implemented.

---

## 5.3 Authentication

The planned authentication system is:

**Better Auth**

Better Auth will handle authentication concerns such as:

* Accounts
* Sessions
* Email verification
* Password reset
* Authentication identity

Application-specific roles and permissions will remain part of WNM's own domain model.

---

# 6. Roles & Permissions

The platform must support more than one administrator/support person.

The system will not assume:

> "Ahmed is the only person who can manage everything."

The planned role/permission architecture will support multiple staff members.

The current direction is:

* SUPER_ADMIN
* ADMIN
* INSTRUCTOR
* MODERATOR
* SUPPORT
* STUDENT

Users should not be artificially restricted to being only one kind of person.

For example, an instructor may also be a student.

Permissions will be centralized rather than scattering role checks throughout the application.

---

# 7. Learning Architecture

The core learning structure will be:

```text
Course
  │
  ├── Chapter
  │     ├── Lesson
  │     ├── Lesson
  │     └── Lesson
  │
  └── Chapter
        └── Lesson
```

The old simplistic course/video relationship will be refactored toward:

**Course → Chapter → Lesson**

Learning Paths provide a separate curated layer over existing courses:

```text
LearningPath
  └── LearningPathCourse
        └── Course
```

Courses remain independent and reusable.

---

# 8. Lesson Content

The course authoring experience will use:

**Tiptap**

The goal is a WYSIWYG-style editor so course authors can write and format lessons without needing to write HTML or Markdown.

Lesson content will use structured Tiptap JSON rather than raw HTML.

The editor will eventually support common authoring features such as:

* Headings
* Paragraphs
* Bold
* Italic
* Lists
* Links
* Quotes
* Code blocks
* Images
* Tables
* Video embeds
* Undo/redo

The exact toolbar will be implemented when the lesson editor is built.

---

# 9. Lesson Video Strategy

Video is intentionally separated from lesson content.

A lesson can contain:

* Rich text
* Video
* Images
* Resources
* Future interactive content

### V1

YouTube will be used for video.

This keeps the first deployment inexpensive and simple.

### Later

When WNM has paid courses and real revenue/users, the platform can introduce:

**Self-hosted protected video**

The architecture will not hard-code lessons to YouTube so that a future self-hosted video provider can be added without redesigning the entire LMS.

Self-hosted video is intentionally **not being implemented now**.

---

# 10. Course Q&A

Q&A is different from global Chat.

The planned structure is:

```text
Course
  ↓
Lesson
  ↓
Question
  ↓
Replies
```

Students will eventually be able to ask questions related to learning content.

Instructors/moderators will be able to participate and moderate discussions.

There will be no generic global `Messages` system for this purpose.

---

# 11. Support System

Support will be a **future first-class module**.

We have deliberately decided:

> **Design for Support now, implement Support later.**

This is appropriate because WNM currently has no user base.

The future system is planned around:

```text
Student / Visitor
       ↓
Support Request
       ↓
Ticket
       ↓
Assigned Staff Member
       ↓
Reply
       ↓
Email Notification
```

The eventual Support system can include:

* Public contact form
* Authenticated support requests
* Tickets
* Ticket status
* Assignment
* Priority
* Staff replies
* Internal notes
* Email notifications
* Attachments
* Audit history

Advanced support features will only be implemented when they are actually needed.

Gmail will eventually act as an email/notification channel, not as the application's support database.

---

# 12. Notifications

Notifications will remain separate from:

* Q&A
* Support
* Chat

A notification is an output from another part of the system.

For example:

```text
Support ticket reply
       ↓
Notification
       ↓
Email
```

Notifications will be implemented when the relevant product features require them.

---

# 13. Future Chat

A private/global Chat system may be added later.

It will be designed as a separate feature rather than recreating the old Messages system.

Chat is not part of the initial MVP.

---

# 14. Features Planned for Later

The following features are intentionally deferred:

## Learning Features

* Badges
* Certificates
* Advanced quizzes
* Assignments
* Question banks
* Advanced progress analytics

The V1 diagnostic assessment described in Section 20 is an explicit, limited exception and must not be expanded into a general advanced assessment platform without a separate product decision.

## Communication

* Support system
* Global/private Chat
* Advanced notifications
* Broadcast notifications

## Media

* Self-hosted protected video
* Advanced media library
* Video processing/transcoding

## Intelligence

* AI learning assistants
* AI-assisted course creation
* AI-generated recommendations
* AI-generated Learning Paths
* Other AI features

AI is intentionally **not a V1 dependency**. The architecture and structured learning data should remain suitable for future AI/RAG capabilities.

## Business

* Payment system
* Paid-course infrastructure
* Advanced subscription/billing functionality

Payment architecture will be revisited when the product/business model requires it.

---

# 15. Infrastructure Strategy

The project will start with simple infrastructure.

We do not currently plan to introduce unnecessary infrastructure such as:

* Microservices
* Kubernetes
* Redis
* Kafka
* Complex distributed systems
* Large-scale analytics infrastructure

while the platform has no meaningful user load.

Infrastructure will grow when the actual product requires it.

---

# 16. Cloudflare

Cloudflare will be used where it provides practical value for:

* DNS
* HTTPS
* Security
* WAF/DDoS protection
* Deployment/networking needs

Cloudflare Tunnel remains an optional deployment tool rather than a requirement for the application architecture.

---

# 17. Security

Security is not a "later" feature.

The initial real application must include appropriate security around:

* Authentication
* Authorization
* Server-side permission checks
* Input validation
* Zod schemas
* Database access
* IDOR prevention
* Session handling
* Environment secrets
* Rate limiting where required
* Administrative access
* Audit/security information

The client must never be trusted to decide whether a user is authorized to perform an operation.

---

# 18. User IP / Security Administration

The admin system will eventually provide appropriate security information, including user IP information where needed for moderation/security actions.

IP information must be:

* Restricted to authorized staff
* Used for legitimate security/moderation purposes
* Handled with appropriate retention/access rules
* Kept out of unnecessary client-facing data

User banning/unbanning will be implemented as part of the appropriate security/admin functionality.

---

# 19. Current MVP Target

The first deployable WNM MVP should allow:

### Student

* Register/login
* Browse courses
* Browse learning paths
* Open a learning path and view its ordered courses
* Track course progress within a learning path
* Open courses
* Navigate chapters
* Read lessons
* Watch YouTube lessons
* Track lesson progress
* Take an optional diagnostic assessment when a course/path provides one
* Review assessment results and identified weak topics
* Receive lesson/topic review recommendations
* Retake an assessment with different questions, with later attempts emphasizing previously weak topics
* Participate in Q&A
* Manage profile

### Instructor

* Manage their courses
* Manage chapters
* Manage lessons
* Write rich lesson content
* Add YouTube videos
* Configure course assessment content where authorized

### Admin

* Manage users
* Manage courses
* Manage instructors
* Manage learning paths
* Manage assessment configuration/content where authorized
* Moderate Q&A
* Manage platform settings
* Access appropriate security/audit information

The exact certificate/credential system is not part of V1. Assessment results are educational/diagnostic first.

---

# 20. Learning Paths V1

Learning Paths are part of the V1 product. A Learning Path is a curated learning journey made by arranging existing courses into a meaningful order.

Courses remain independent and reusable. A course may belong to zero, one, or many Learning Paths, and its position may be different in each path.

The relationship is:

```text
LearningPath
    ↓
LearningPathCourse
    ├── courseId
    └── position
```

The application should enforce a unique `(pathId, courseId)` relationship so the same course is not added twice to one path. Ordering belongs to the relationship, not to the Course itself, because the same course can appear at different positions in different paths.

### Student experience

The main navigation will provide separate entry points for:

* Courses — browse all available courses independently
* Paths — browse all published Learning Paths

A student can open a Learning Path and see its courses in the intended order. Path progress is derived from the student's existing course/lesson progress rather than introducing a separate PathProgress system in V1.

A Learning Path does not automatically grant access or enrollment to its courses. Course access remains governed by the course enrollment/access model.

### Path content

A Learning Path will support:

* Title
* Slug
* Description
* Status
* Optional cover image
* Optional introductory video
* Ordered existing courses

The cover image and introductory video are independently optional. A path may have neither, either one, or both.

Intro videos will use YouTube in V1, consistent with the current YouTube-first video strategy.

### V1 boundary

V1 will support creating paths, adding existing published courses, ordering courses, removing courses, publishing paths, and allowing students to browse and follow the curated journey.

The following are intentionally not part of Learning Paths V1:

* Prerequisite engines
* Automatic course unlocking
* Complex course dependencies
* Skill graphs
* Adaptive learning paths
* AI career recommendations
* Dynamic path generation
* Automatic enrollment into all path courses

A Learning Path represents a recommended journey, not a technical restriction on how a student must learn.

---

# 21. Diagnostic Assessments V1

WNM V1 will include a deliberately limited assessment capability for Courses and Learning Paths.

These assessments are **optional**. They are not required for course/path completion and are not a mandatory pass/fail gate.

Their primary purpose is educational:

> Help the student discover what they understand well, identify what they need to review, and guide them toward the relevant learning material.

The assessment experience should encourage students to use the result as a study tool rather than treating the score as the sole objective.

## 21.1 Assessment Ownership

An assessment may belong to:

```text
Course
  └── Assessment
```

or:

```text
LearningPath
  └── Assessment
```

The assessment is a separate domain concept and is not a Lesson.

A Course or Learning Path may have no assessment.

The initial V1 scope should support an optional final assessment rather than a general quiz engine attached to every lesson.

---

## 21.2 Assessment Questions

Assessment questions should be structured enough to identify what knowledge area they test.

Conceptually:

```text
Assessment
  └── Question
        ├── topic/skill
        └── related lesson/content
```

A question should have enough structured metadata to connect an incorrect answer back to the relevant topic/skill and learning material.

This is important because the system should be able to say:

> Review this topic/lesson because your assessment results show that you need more practice here.

The first implementation should remain intentionally limited. It does not require a general-purpose question-bank product.

---

## 21.3 Assessment Attempts

Each student attempt must be preserved.

Conceptually:

```text
Assessment
  └── AssessmentAttempt
        └── AttemptAnswer[]
```

An attempt should preserve the questions presented, the student's answers, the result, and the relevant timing/submission information.

Historical attempts must not silently change when assessment content is edited later.

---

## 21.4 Diagnostic Results

After an assessment, the student should receive more than a single score.

The result should be able to show:

* overall score;
* strengths;
* weak topics/skills;
* incorrect answers;
* explanations where configured;
* recommended lessons/topics to review;
* attempt history;
* improvement between attempts.

The system should not require AI to produce these core results.

Deterministic assessment data remains the source of truth.

---

## 21.5 Retakes

Students may retake an assessment.

A retake should not simply replay the exact same questions.

V1 should support:

* different questions where alternatives are available;
* preserving previous attempts;
* identifying previously weak topics;
* giving subsequent attempts greater emphasis on those weak topics.

A simple deterministic selection/weighting system is sufficient for V1.

A sophisticated adaptive-testing engine is not required.

Conceptually:

```text
Attempt 1
    ↓
Topic performance
    ↓
Weak-topic identification
    ↓
Next-attempt question weighting
    ↓
Different questions
    ↓
Attempt 2
```

---

## 21.6 Review Recommendations

Assessment results should connect students back to the learning material.

For example:

```text
Weak topic:
Linux File Permissions

Recommended review:
Lesson 4 — File Permissions
Lesson 5 — chmod and Ownership
```

The exact recommendation algorithm can remain simple in V1.

The important domain requirement is that questions/skills can be associated with relevant learning material.

---

## 21.7 Exam Experience

Where an assessment uses a timed exam mode, V1 may support:

* time limit;
* visible countdown timer;
* question navigation;
* answer selection;
* explicit submission;
* automatic handling of time expiration.

The timer and submission rules must be enforced server-side as well as reflected in the UI.

The exact UI design can be finalized during implementation.

---

## 21.8 Assessment Scope Boundary

The following are explicitly outside the V1 assessment scope:

* generalized question-bank management;
* advanced assignment systems;
* complex adaptive testing;
* AI-generated questions;
* AI grading;
* proctoring;
* advanced anti-cheat systems;
* coding-exam infrastructure;
* complex certification workflows;
* mandatory exam-based course completion.

The V1 assessment feature exists to support diagnosis, review, and retesting.

---

# 22. Future AI Learning Assistance

AI is intentionally **not part of the V1 dependency chain**.

However, WNM will be designed so future AI assistance can consume structured, trustworthy learning data.

Potential future capabilities include:

* explaining an incorrect assessment answer;
* explaining a lesson in another way;
* generating personalized review guidance;
* conversational practice around weak topics;
* generating additional practice questions;
* identifying recurring knowledge gaps;
* personalized learning assistance;
* instructor/content assistance;
* future RAG-based learning over WNM's own course content.

The future architecture should prefer grounding AI responses in WNM's approved educational content rather than allowing the model to become the source of truth for course facts.

Conceptually:

```text
WNM Courses / Lessons / Skills / Assessments
                    ↓
              Retrieval / RAG
                    ↓
                AI Layer
                    ↓
           WNM Learning Assistant
```

AI must not become a prerequisite for:

* authentication;
* enrollment;
* lesson access;
* progress tracking;
* assessment scoring;
* correct-answer determination;
* authorization.

The project should first gain real users and real learning data before deciding the appropriate AI provider, RAG architecture, model strategy, evaluation process, or agent design.

---

# 23. Deployment Target

The goal is not to build every planned WNM feature before deployment.

The goal is:

```text
Real Authentication
        ↓
Real Database
        ↓
Real Courses
        ↓
Real Lessons
        ↓
Real Learning Progress
        ↓
Learning Paths
        ↓
Diagnostic Assessments
        ↓
Real Q&A
        ↓
Production Deployment
        ↓
First Users
        ↓
Real Feedback
        ↓
Prioritize Next Features
```

---

# 24. Development Order

The planned implementation order is:

## Phase 0 — Cleanup

**Current phase**

Remove/refactor the legacy boilerplate business assumptions.

---

## Phase 1 — Foundation

Later:

* PostgreSQL
* Drizzle
* Better Auth
* Users
* Roles
* Permissions
* Security foundation
* Environment configuration
* RTL/Arabic foundation

---

## Phase 2 — Core LMS

Later:

* Courses
* Categories
* Levels
* Instructors
* Chapters
* Lessons
* Tiptap editor
* YouTube integration
* Enrollment
* Access control
* Progress
* Learning Paths
* Diagnostic Assessments
* Assessment attempts/results/retakes

---

## Phase 3 — Q&A

Later:

* Questions
* Replies
* Moderation
* Reporting
* Instructor participation

---

## Phase 4 — Production

Later:

* Production database
* Domain
* Cloudflare
* HTTPS
* Backups
* Production configuration
* Security hardening
* Deployment
* Smoke testing
* Initial administrator setup

---

## Phase 5 — Post-Launch

Only after real users exist, prioritize based on actual needs:

* Support
* Notifications
* Paid courses
* Self-hosted video
* Badges
* Certificates
* Chat
* Advanced quizzes/assignments
* Advanced analytics
* AI learning assistance
* RAG
* AI agents
* Other requested features

---

# 25. Important Rule for Future Development

A feature should not automatically be built just because it is possible.

Before implementing a deferred feature, ask:

1. Do users need it now?
2. Does it solve a real problem?
3. Does the current architecture need preparation for it?
4. Is it worth the maintenance cost?
5. Will building it now delay deployment unnecessarily?

If the answer is no, keep it deferred.

---

# 26. Current Status

### Completed

* Repository baseline
* Git initialized
* `main` branch established
* pnpm dependency build configuration
* Original boilerplate audited
* Legacy Messages system removed
* Messages navigation removed
* Messages routes removed
* Legacy message references removed from layouts/pages
* Architecture reviews completed
* New WNM architecture direction agreed
* Support strategy agreed
* YouTube-first video strategy agreed
* Future self-hosted video strategy agreed
* Tiptap chosen for lesson authoring
* MVP-first development strategy agreed
* Learning Paths approved as a V1 feature
* Diagnostic assessment concept approved as a V1 feature
* Future AI/RAG direction approved as an architectural capability, not a V1 dependency

### In Progress

* Remaining legacy boilerplate cleanup
* Final architecture review/freeze

### Planned

* Database foundation
* Authentication
* Roles/permissions
* Core LMS
* Tiptap lesson editor
* YouTube lessons
* Enrollment/access
* Progress
* Learning Paths
* Diagnostic assessments
* Q&A
* Production deployment

### Intentionally Deferred

* Support implementation
* Self-hosted protected video
* Paid-course infrastructure
* Chat
* Badges
* Certificates
* AI implementation
* RAG
* AI agents
* Advanced notifications
* Advanced analytics
* Generalized advanced quiz/assignment systems
* Other non-MVP features

---

# 27. Project Principle

> **Build the foundation for the future, but only build features for the present.**

WNM should launch when it is useful and stable enough to serve its first real students — not when every idea on the roadmap has been implemented.
