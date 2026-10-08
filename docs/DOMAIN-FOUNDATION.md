# WNM LMS — Domain Foundation Specification

**Status:** Draft — pending architecture review
**Project:** WNM Learning Platform
**Architecture:** Next.js modular monolith
**Database:** PostgreSQL + Drizzle ORM — planned
**Authentication:** Better Auth — planned

---

# 1. Core Product Principle

> **Build the foundation for the future, but only build features for the present.**

WNM should remain a modular monolith.

We will not introduce microservices, Kubernetes, Redis, Kafka, queues, or other infrastructure simply because they may become useful at scale.

Future scalability should primarily come from:

* clear domain boundaries;
* explicit ownership;
* centralized authorization;
* normalized data;
* replaceable infrastructure providers;
* good database design;
* predictable module boundaries.

---

# 2. Current Product Scope

The initial real LMS focuses on:

### Student

A student should be able to:

* register and log in;
* maintain their profile;
* browse published courses;
* browse published learning paths;
* enroll in courses;
* navigate courses;
* open learning paths and view their ordered courses;
* read lesson content;
* watch lesson videos;
* mark lessons as completed;
* track learning progress;
* track course progress within a learning path;
* take optional diagnostic assessments when available;
* review assessment results and identified weak topics;
* receive recommendations for relevant lessons/topics to review;
* retake assessments with different questions and increased emphasis on previously weak topics;
* ask questions about lessons;
* read replies to their questions.

### Instructor

An instructor is part of the V1 product and should be able to:

* create courses;
* manage assigned courses;
* create chapters;
* create lessons;
* edit lesson content;
* attach YouTube videos;
* manage lesson resources;
* publish/update courses;
* configure assessment content where authorized;
* answer or participate in course Q&A where permitted.

### Admin

Administrators should eventually be able to:

* manage users;
* manage roles;
* manage courses;
* manage instructors;
* manage learning paths;
* manage categories;
* manage assessment configuration/content where authorized;
* moderate Q&A;
* manage platform settings;
* perform security-sensitive administrative actions.

---

# 3. Explicitly Deferred

The following are not part of the current MVP implementation unless explicitly included by the V1 assessment/path decisions below.

## Deferred product features

* paid-course infrastructure;
* payment processing;
* subscriptions;
* global/private chat;
* direct messaging;
* support/ticket implementation;
* certificates as a credentialing system;
* badges;
* advanced analytics;
* generalized advanced quizzes;
* advanced assignments;
* generalized question banks;
* AI features;
* RAG;
* AI agents;
* advanced notification infrastructure;
* self-hosted protected video;
* advanced media processing.

### Explicit V1 exceptions

The following are approved V1 features despite the broader deferred categories:

* Learning Paths;
* limited final diagnostic assessments for Courses and Learning Paths;
* assessment attempts/results;
* diagnostic weak-topic feedback;
* deterministic retake question weighting.

The assessment feature must remain within the defined V1 boundary and must not silently expand into a generalized advanced assessment platform.

The architecture may reserve boundaries for future features, but their implementation must not leak into the MVP unnecessarily.

---

# 4. Identity Domain

## 4.1 User

The system has one primary identity entity:

`User`

A user represents a person who can interact with WNM.

The current legacy model:

```ts
role: string
```

must not survive into the production domain model.

A user may have multiple roles.

Examples:

* STUDENT
* INSTRUCTOR
* MODERATOR
* SUPPORT
* ADMIN
* SUPER_ADMIN

A user may therefore be both:

```text
STUDENT + INSTRUCTOR
```

or:

```text
INSTRUCTOR + MODERATOR
```

without requiring duplicate user accounts.

---

## 4.2 Roles

The planned role set is:

```text
SUPER_ADMIN
ADMIN
INSTRUCTOR
MODERATOR
SUPPORT
STUDENT
```

Roles describe broad capabilities.

Roles do not replace permission checks.

Application authorization should ultimately be based on permissions/capabilities rather than scattered checks such as:

```ts
user.role === "admin"
```

---

## 4.3 UserRole

Production authorization requires a many-to-many relationship:

```text
User
  |
  +--- UserRole --- Role
```

This allows one user to have multiple roles.

The exact physical implementation of the Role entity/table will be finalized during schema design.

The important domain rule is:

> A user must not be represented by one hard-coded role field.

---

## 4.4 Account Status

The domain should support account lifecycle management independently of roles.

Examples include:

```text
ACTIVE
SUSPENDED
```

The exact final enum/value set will be finalized during schema design.

Suspending a user must not require changing or deleting their roles.

---

# 5. Authentication Boundary

Authentication is delegated to Better Auth.

Better Auth owns authentication concerns such as:

* credentials;
* sessions;
* authentication accounts;
* verification;
* authentication lifecycle.

WNM owns application-specific authorization.

Therefore:

```text
Better Auth
    ↓
Who is this user?
    ↓
WNM authorization
    ↓
What may this user do?
```

The current:

```ts
AuthSession {
  user;
  token;
}
```

is a temporary mock abstraction and must not be treated as the final authentication model.

The final Better Auth schema/adapter integration must be verified against the current Better Auth documentation during implementation.

---

# 6. Authorization Model

Authorization must be enforced server-side.

Client-side UI visibility is not security.

The application should eventually provide centralized authorization helpers such as:

```text
requireUser()
requirePermission()
requireRole()
requireCourseAccess()
requireCourseOwnership()
```

Exact APIs are implementation details.

The important rule is:

> Every protected operation must verify the authenticated user and the required authorization on the server.

This includes:

* course management;
* lesson management;
* progress updates;
* assessment access;
* assessment submission;
* assessment attempt creation;
* question creation;
* question replies;
* administrative actions;
* profile updates;
* role management;
* learning path management;
* path/course relationship management.

---

# 7. Course Domain

The target learning structure is:

```text
Course
  └── Chapter
        └── Lesson
```

The current:

```text
Course
  └── Video[]
```

model is legacy and will be replaced.

---

# 8. Course

A Course represents a learning product published by WNM.

A course should conceptually contain:

* identity;
* title;
* description;
* slug;
* status;
* level;
* timestamps;
* assigned instructors;
* categories;
* chapters;
* lessons;
* optional diagnostic assessment.

The production entity must not store values such as:

```text
totalVideos
watchedVideos
```

as canonical course data.

Those are derived/read-model values.

---

## 8.1 Course Status

The current boilerplate status:

```text
published
draft
in_progress
```

is not accepted as the final domain model.

`in_progress` describes workflow/progress rather than a durable course publication state.

A production status model should distinguish at least:

```text
DRAFT
PUBLISHED
```

An `ARCHIVED` state is a possible addition and remains a decision for the final schema.

---

# 9. Course Ownership and Instructors

Instructors are users.

A course should not contain an embedded instructor object as its canonical ownership model.

The recommended relationship is:

```text
User
  └── CourseInstructor
          └── Course
```

This permits:

* one instructor teaching multiple courses;
* multiple instructors working on one course;
* future reassignment;
* explicit ownership checks.

The exact V1 rule for whether a course must have one or may have multiple instructors is still subject to final product approval.

The relationship should nevertheless be designed so that it does not require a future destructive migration to support multiple instructors.

---

# 10. Categories

Courses may belong to multiple categories.

Recommended domain:

```text
Category
CourseCategory
Course
```

This is many-to-many.

Example:

```text
Course:
  "System Design Fundamentals"

Categories:
  Software Architecture
  System Design
  Backend
```

Category management itself is an administrative concern.

---

# 11. Course Level

The initial course level is a controlled value:

```text
BEGINNER
INTERMEDIATE
ADVANCED
```

This should not be arbitrary user-entered text.

---

# 12. Chapter

A Chapter groups related lessons inside a course.

Relationship:

```text
Course 1 ─── N Chapter
```

A chapter should have:

* title;
* optional description;
* ordering;
* timestamps;
* course ownership.

Ordering must be explicit.

The database should not depend on array position or title sorting to determine lesson order.

---

# 13. Lesson

A Lesson is the fundamental learning unit.

Relationship:

```text
Course
  └── Chapter
        └── Lesson
```

A lesson may contain:

* title;
* rich text content;
* optional video;
* resources;
* ordering;
* timestamps.

The exact lesson content-type rules remain a product decision.

The preferred direction is for a lesson to be able to contain rich educational content and optionally a video rather than making "video" itself the domain entity.

---

# 14. Lesson Content

Tiptap is the selected authoring technology.

The canonical lesson content format should be:

```text
Tiptap JSON
```

stored as PostgreSQL JSON/JSONB rather than treating HTML as the canonical source.

The application must eventually define:

* allowed Tiptap extensions;
* supported node types;
* supported marks;
* sanitization/validation;
* rendering rules;
* content schema versioning.

The editor itself must only be available to authorized users such as instructors/admins.

Students receive rendered content, not unrestricted editor functionality.

---

# 15. Video Model

Video is a capability of a Lesson.

The target model is conceptually:

```text
Lesson
  └── Video
        provider
        external/provider ID
        duration
```

rather than:

```text
Course
  └── Video
```

---

## 15.1 Current Provider

The current provider is:

```text
YouTube
```

This is intentionally temporary.

---

## 15.2 Future Provider

Paid courses may eventually require self-hosted protected video.

Therefore the application should not hard-code the entire domain around YouTube.

The video model should be provider-aware.

Conceptually:

```text
provider = YOUTUBE
providerVideoId = ...
durationSeconds = ...
```

A future provider can then be added without redesigning Course/Chapter/Lesson.

---

# 16. Video Duration Rule

WNM has a hard maximum video duration:

```text
17 minutes 30 seconds
```

Equivalent:

```text
1050 seconds
```

Rules:

```text
16:55 → allowed
17:00 → allowed
17:29 → allowed
17:30 → allowed
17:31 → rejected
18:00 → rejected
```

The exact duration must be stored in seconds.

Display formatting may convert seconds into human-readable minutes/seconds.

The limit must be enforced server-side.

If a video exceeds the limit, the instructor should be instructed to split it into multiple lessons/videos.

The product may recommend shorter videos such as 15–16 minutes, but recommendation is not the enforcement rule.

---

# 17. Resources

Resources belong to lessons rather than courses/videos as a legacy flat attachment.

Conceptually:

```text
Lesson
  └── Resource[]
```

A resource may contain:

* label;
* URL;
* ordering;
* timestamps if needed.

The MVP does not require self-hosted file storage.

External resources such as documentation, GitHub repositories, slides, and references are sufficient initially.

---

# 18. Enrollment

Enrollment is a first-class learning relationship.

Conceptually:

```text
User
  └── Enrollment
          └── Course
```

This provides the foundation for:

* course access;
* progress;
* completion;
* future paid-course access;
* future entitlement rules.

The exact enrollment statuses and whether every free published course requires explicit enrollment are still product decisions to finalize before schema implementation.

---

# 19. Progress

Progress belongs to the relationship between a user and a lesson.

The canonical model should therefore be conceptually:

```text
User
  └── LessonProgress
          └── Lesson
```

The MVP requires lesson completion.

Recommended core fields:

```text
userId
lessonId
completed
completedAt
updatedAt
```

The current:

```text
watched: boolean
```

is therefore a temporary UI/mock representation.

---

## 19.1 Derived Course Progress

Course progress should be calculated from lesson progress.

Examples:

```text
completed lessons
total lessons
completion percentage
```

Values such as:

```text
totalVideos
watchedVideos
```

must not be stored as the authoritative course state.

They are derived/read-model values.

---

# 20. Course Completion

A course can be considered completed when the applicable lessons are completed.

A future course update must not accidentally erase historical completion merely because new lessons are added.

The exact completion semantics after course structure changes must be finalized during implementation.

The important domain principle is:

> Course completion history must be treated deliberately when the course evolves.

Assessment completion does not automatically become a course-completion gate.

---

# 21. Questions & Answers

Q&A is a first-class domain separate from global chat.

The target model is:

```text
User
  └── Question
          └── Lesson
          └── QuestionReply[]
```

A Question belongs to:

* the user who asked it;
* the lesson it concerns.

A Question must not depend on copied strings such as:

```text
memberName
course
videoTitle
videoUrl
```

Those values can be resolved through relationships.

---

# 22. Question

A question conceptually contains:

* id;
* userId;
* lessonId;
* content;
* status;
* timestamps.

The current:

```ts
answered: boolean
```

is too limited for the long-term domain.

A richer question lifecycle may eventually distinguish states such as:

```text
OPEN
ANSWERED
RESOLVED
HIDDEN
```

The final state set will be approved before schema implementation.

---

# 23. Question Reply

A question may have multiple replies.

Therefore:

```text
Question 1 ─── N QuestionReply
```

is preferred over storing one answer directly on the question.

A reply belongs to:

* the authoring user;
* the question;
* its content;
* timestamps.

This permits future instructor/moderator participation without redesigning Q&A.

---

# 24. Q&A Authorization

At minimum:

### Student

May:

* ask questions for lessons they can access;
* read permitted questions/replies.

### Instructor

May:

* read questions for courses they are authorized to manage;
* reply where permitted.

### Moderator

May:

* moderate questions/replies;
* hide inappropriate content where authorized.

### Admin/Super Admin

May manage/moderate according to centralized permissions.

Exact permission names belong in the authorization implementation rather than being scattered through components.

---

# 25. Course Updates

Course updates are different from the technical `updatedAt` timestamp.

The course entity should have a normal:

```text
updatedAt
```

for technical modification tracking.

Separately, WNM may maintain historical meaningful course updates:

```text
CourseUpdate
```

Conceptually:

```text
Course
  └── CourseUpdate[]
```

A CourseUpdate may contain:

* courseId;
* updatedBy;
* summary;
* details;
* createdAt.

---

# 26. Learning Paths

A Learning Path is a curated learning journey made by arranging existing courses into a meaningful order.

It is not a replacement for courses and it is not a playlist.

Courses remain independent and reusable.

A course may belong to:

* zero Learning Paths;
* one Learning Path;
* many Learning Paths.

The same course may appear at a different position in different Learning Paths.

The core relationship is therefore many-to-many:

```text
LearningPath
    |
    +--- LearningPathCourse --- Course
    |
    +--- LearningPathCourse --- Course
    |
    +--- LearningPathCourse --- Course
```

The ordering belongs to the relationship between the path and the course, not to the Course itself.

Conceptually:

```text
LearningPathCourse
├── pathId
├── courseId
└── position
```

The relationship should enforce:

```text
unique(pathId, courseId)
```

so the same course cannot be added twice to the same path.

The path position should also be unique within a path so that one position cannot represent multiple courses.

---

## 26.1 Learning Path

A Learning Path should conceptually contain:

* identity;
* title;
* slug;
* description;
* status;
* optional cover image;
* optional introductory video;
* timestamps;
* ordered courses;
* optional diagnostic assessment.

A conceptual model is:

```text
LearningPath
├── id
├── title
├── slug
├── description
├── status
├── coverImage
├── introVideoUrl
├── createdAt
└── updatedAt
```

The final status values will be settled during schema design, but the path must support at least a non-public/draft state and a published state.

---

## 26.2 Learning Path Courses

A path contains existing courses.

The path must not duplicate course data.

For example:

```text
Learning Path: DevOps Foundation

1. Linux Foundation
2. Git Fundamentals
3. Bash Scripting Introduction
```

The three courses remain independent Course entities.

The path only defines:

```text
which courses
+
in what order
```

If a course is removed from a path:

> The course itself is not deleted or otherwise affected.

If the same course belongs to another path, that other relationship remains intact.

---

## 26.3 Learning Path Access

A Learning Path does not automatically grant access to every course inside it.

Course access remains governed by the course's own enrollment/access rules.

Therefore:

```text
User
  ↓
Learning Path
  ↓
Course
```

does not mean:

```text
Path membership = Course enrollment
```

This separation is important for future paid courses and entitlement rules.

---

## 26.4 Learning Path Progress

The MVP does not require a separate `PathProgress` entity.

Path progress is derived from the user's existing course/lesson progress.

Conceptually:

```text
LearningPath
    ↓
Courses
    ↓
Lessons
    ↓
LessonProgress
```

The UI may therefore show:

* completed courses;
* course completion percentages;
* overall path progress.

These values are read-model/derived values rather than a second source of truth.

---

## 26.5 Learning Path Intro Media

A Learning Path may have:

* a cover image;
* an introductory video;
* or both.

The V1 video provider is YouTube.

The introductory video is informational and does not replace the actual courses inside the path.

The path itself does not become a video/course container.

---

## 26.6 Learning Path V1 Features

Learning Paths are part of V1.

The V1 implementation should support:

### Admin

* create a Learning Path;
* define title and description;
* define slug;
* optionally add a cover image;
* optionally add a YouTube introductory video;
* add existing published courses;
* remove courses;
* reorder courses;
* publish a path.

### Student

* browse published Learning Paths;
* open a Learning Path;
* see its ordered courses;
* open accessible courses;
* see course completion/progress within the path;
* understand the intended learning sequence.

The main navigation should expose Learning Paths separately from Courses:

```text
Courses
Paths
```

---

## 26.7 Learning Path Publication and Course Status

The final behavior when a course inside a published path later becomes `DRAFT` or `ARCHIVED` is still an explicit schema/product decision.

The system must define this before production implementation.

The preferred principle is:

> A published path must not silently promise access to content the student cannot access.

Possible implementation policies include hiding unavailable courses from the public path, showing them as unavailable, or preventing publication/archiving transitions under specific conditions. The final rule must be selected before implementation.

V1 should allow paths to be built from existing published courses.

---

## 26.8 Learning Path Boundaries

Learning Paths are intentionally simple in V1.

The following are not part of the initial implementation:

* prerequisite engines;
* automatic course unlocking;
* complex course dependencies;
* skill graphs;
* adaptive learning paths;
* AI-generated paths;
* AI career recommendations;
* dynamic path generation;
* separate PathProgress persistence;
* automatic enrollment into every course.

The purpose of V1 is to provide a clear, curated learning journey using existing reusable courses.

---

# 27. Diagnostic Assessments

WNM V1 includes a deliberately limited assessment capability for Courses and Learning Paths.

These assessments are **optional**. They are not required for course/path completion and are not a mandatory pass/fail gate.

Their primary purpose is educational:

> Help the student discover what they understand well, identify what they need to review, and guide them toward relevant learning material.

The assessment experience should encourage students to use the result as a study tool rather than treating the score as the sole objective.

---

## 27.1 Assessment Ownership

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

## 27.2 Assessment

Conceptually:

```text
Assessment
├── id
├── owner
├── title
├── description/instructions
├── status
├── timeLimitSeconds
├── passingScore (optional/future credential use)
└── timestamps
```

The exact physical ownership model will be finalized during schema design. The important domain rule is that an assessment belongs to exactly one supported owner type: Course or Learning Path.

The assessment should be independently publishable/configurable according to the permissions of the owning Course/Path.

The existence of a `passingScore` does not make passing mandatory for course/path completion. It may be useful for reporting or future certification rules.

---

## 27.3 Assessment Questions

Assessment questions should be structured enough to identify what knowledge area they test.

Conceptually:

```text
Assessment
  └── AssessmentQuestion
        ├── prompt
        ├── answer choices
        ├── correct answer
        ├── topic/skill
        └── related lesson/content
```

A question should have enough structured metadata to connect an incorrect answer back to the relevant topic/skill and learning material.

Questions should be authored and stored as controlled assessment content rather than generated dynamically by AI in V1.

The first implementation should remain intentionally limited. It does not require a general-purpose question-bank product.

---

## 27.4 Topics / Skills

The assessment system needs a stable way to group questions by knowledge area.

A topic/skill may be represented initially using a controlled assessment-domain relationship rather than a large generalized skill graph.

The key requirement is:

```text
Question
   ↓
Topic/Skill
   ↓
Relevant lesson(s)
```

This enables deterministic weak-topic analysis and review recommendations.

A full enterprise-wide skill taxonomy is not required for V1.

---

## 27.5 Assessment Attempts

Each student attempt must be preserved.

Conceptually:

```text
Assessment
  └── AssessmentAttempt
        └── AttemptAnswer[]
```

An attempt should preserve:

* the questions presented;
* the student's answers;
* correctness/result;
* score;
* timing/submission information;
* relevant assessment configuration/snapshot information.

Historical attempts must not silently change when assessment content is edited later.

This historical preservation is important for future reporting, improvement tracking, and possible certification use.

---

## 27.6 Diagnostic Results

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

## 27.7 Retakes

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

If the available question set is too small to guarantee a fully different attempt, the system should use the available pool rather than pretending that every question can always be unique.

---

## 27.8 Review Recommendations

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

## 27.9 Exam Experience

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

## 27.10 Assessment Results and Certificates

The V1 assessment is primarily diagnostic.

It may produce a result/score that can later be used by a separate credential/certificate system.

However:

* assessment participation is optional;
* passing is not required for course/path completion;
* certificates are not a V1 credentialing feature;
* no certificate issuance workflow is required now.

---

## 27.11 Assessment Scope Boundary

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

# 28. Meaningful Course Updates

A CourseUpdate is appropriate for changes such as:

* new lesson;
* substantial lesson update;
* lesson removal;
* important correction;
* new learning resources;
* major course structure change.

It should not be created for every trivial technical modification.

Examples that normally should not trigger a student-facing update:

* typo correction;
* internal metadata changes;
* administrative housekeeping;
* insignificant formatting changes.

---

# 29. Course Update Notifications

Notifications are a future feature.

The current architecture should allow a meaningful CourseUpdate to become a future notification event.

One agreed direction is:

> Meaningful course updates may notify students who have completed the course.

However:

* no notification infrastructure is being built now;
* no global notification system is being introduced now;
* no notification queue is required now.

The event boundary should exist conceptually without prematurely implementing the entire notification subsystem.

---

# 30. Support Boundary

Support is intentionally not implemented in the MVP.

However, support is a future first-class domain rather than a synonym for Chat.

Future architecture may look conceptually like:

```text
SupportTicket
SupportMessage
SupportAssignment
SupportStatus
```

The current project must not implement these prematurely.

The SUPPORT role exists as an architectural role for the future.

---

# 31. Chat Boundary

Global/private chat is explicitly deferred.

Q&A must not be turned into a general messaging system.

Therefore:

```text
Q&A ≠ Chat
```

The deleted legacy Messages domain must not be reintroduced simply to solve student/instructor questions.

---

# 32. Notifications Boundary

Notifications are separate from:

* Q&A;
* Support;
* Chat;
* Course Updates.

The MVP may generate future notification events conceptually, but a complete notification subsystem is deferred.

---

# 33. Settings

The current settings model is legacy-heavy:

```text
sessionDate
sessionLink
sessionTitle
announcement
```

These fields must not automatically become core WNM domain entities.

Before production schema implementation, each setting must be classified as one of:

1. actual product configuration;
2. future feature;
3. temporary boilerplate;
4. derived/display information.

The current live-session fields should not be allowed to dictate the overall domain model.

---

# 34. Profile

Profile data is separate from authentication credentials.

Potential profile information includes:

* display name;
* avatar;
* bio;
* optional phone/contact information.

Authentication identity such as:

* email;
* password;
* session;
* verification state

belongs to the authentication system.

The current onboarding requirement that every user provide a phone number is **not yet accepted as a permanent domain requirement**.

This must be decided before final user schema design.

---

# 35. Current Route Model vs Target Model

The current route:

```text
/courses/[courseId]/videos/[videoId]
```

reflects the legacy Course → Video model.

The target domain is:

```text
Course → Chapter → Lesson
```

Therefore the final route structure should eventually represent lessons rather than treating videos as the primary learning entity.

A possible direction is:

```text
/courses/[courseId]/lessons/[lessonId]
```

The exact public URL is an implementation/product decision.

The important rule is:

> Routes must follow the domain model rather than preserving legacy terminology for convenience.

Learning Paths should have their own top-level route boundary rather than being hidden inside Courses.

A possible direction is:

```text
/paths
/paths/[pathSlug]
```

The exact URL structure remains an implementation/product decision.

---

# 36. Current Code → Target Domain Mapping

| Current code          | Target direction                      |
| --------------------- | ------------------------------------- |
| `User.role`           | `UserRole` relationship               |
| `Role = string`       | controlled role model                 |
| `Course.totalVideos`  | derived from lessons                  |
| `CourseWithProgress`  | read/view model                       |
| `Video`               | Lesson video/provider data            |
| `VideoWithProgress`   | lesson + progress read model          |
| `watched`             | `LessonProgress.completed`            |
| `Course → Video[]`    | `Course → Chapter → Lesson`           |
| `QAItem`              | Question + QuestionReply              |
| `Question.memberName` | relation to User                      |
| `Question.course`     | relation through Lesson/Course        |
| `Question.videoTitle` | relation through Lesson               |
| `Question.videoUrl`   | lesson video/provider data            |
| `AuthSession.token`   | Better Auth session                   |
| `useMockAuth`         | real authentication/session           |
| `isAdmin` boolean     | permission-based authorization        |
| `middleware TODO`     | real authentication/access protection |
| `CreateVideoInput`    | lesson/video creation workflow        |
| `markVideoWatched`    | lesson completion                     |
| `/videos/[videoId]`   | lesson-oriented routing               |
| legacy course lists   | LearningPathCourse relationship       |

---

# 37. Derived Data Rule

The following principle applies throughout the domain:

> Do not store a value as canonical data when it can be reliably derived from normalized relationships.

Examples:

```text
course.totalVideos
course.watchedVideos
course.progressPercentage
question.memberName
question.courseName
question.videoTitle
learningPath.courseCount
learningPath.progressPercentage
```

These may exist in query results/read models for UI performance, but they should not become competing sources of truth.

Assessment-derived values such as:

```text
weakTopicPercentage
assessmentScore
pathAssessmentScore
```

may be persisted as historical attempt/result data when needed to preserve the exact outcome of an attempt. They must not replace the underlying question/answer records as the source of truth.

---

# 38. Module Boundaries

The current feature-based architecture is directionally correct.

Expected major modules include:

```text
auth
courses
questions
dashboard
profile
settings
```

The future domain may introduce:

```text
users
enrollments
progress
learning-paths
assessments
support
notifications
```

but modules should only be introduced when they contain meaningful behavior.

We should not create empty architectural modules merely to make the folder tree look scalable.

Learning Paths and Assessments should be treated as meaningful domain modules once implementation begins because they contain real V1 behavior.

---

# 39. Server/Client Boundary

Domain access and authorization must live on the server.

Client components may:

* display data;
* submit user actions;
* provide interaction.

Client components must not be trusted for:

* access control;
* course ownership;
* role authorization;
* enrollment authorization;
* lesson completion authorization;
* assessment authorization;
* assessment scoring;
* administrative permissions;
* learning path management authorization.

The current `hasAccess = true` values are explicitly temporary mocks.

---

# 40. IDOR Protection

Every resource lookup must consider ownership/access.

For example:

```text
/course/123/lesson/456
```

must not automatically become accessible merely because the user knows those IDs.

The server must verify:

```text
authenticated user
        ↓
course/lesson exists
        ↓
user has required access
        ↓
requested action is permitted
```

This is especially important for:

* lessons;
* progress;
* questions;
* replies;
* course management;
* assessments;
* assessment attempts;
* assessment answers/results;
* learning paths;
* path/course relationships;
* admin actions.

---

# 41. Validation

Zod remains the preferred application-layer validation mechanism.

Validation should exist at trust boundaries.

Examples:

* authentication input;
* course creation;
* lesson creation;
* lesson content;
* YouTube provider data;
* duration;
* Q&A input;
* profile updates;
* learning path creation;
* learning path course ordering;
* assessment creation;
* assessment questions;
* answer choices;
* time limits;
* assessment submission;
* administrative mutations.

Database constraints must complement, not replace, application validation.

---

# 42. Video Provider Validation

The current schema only validates:

```ts
z.string().url()
```

That is insufficient as a final YouTube rule.

Production validation should verify that the submitted video actually belongs to an allowed provider and extract/store the provider-specific identifier.

The exact accepted YouTube URL formats will be finalized during implementation.

---

# 43. Tiptap Security

Tiptap content is user-authored input and must be treated as untrusted data.

The final implementation must define:

* allowed extensions;
* allowed HTML/rendering output;
* URL handling;
* sanitization;
* server-side validation;
* content schema versioning.

The application must not blindly render arbitrary HTML supplied by users.

---

# 44. Assessment Security and Integrity

Assessment scoring must be performed server-side.

The client must never be trusted to submit:

* the correct answer;
* the final score;
* the weak-topic result;
* the next-attempt weighting.

The server must derive these from the assessment/question definitions and the student's submitted answers.

For timed assessments, the server must also enforce the effective time limit and submission state.

Assessment attempts should preserve enough information to reproduce the result later, even if the underlying assessment content changes.

---

# 45. Audit and Security-Sensitive Actions

Security-sensitive administrative actions should eventually be auditable.

Examples include:

* role assignment/removal;
* account suspension;
* course publication;
* learning path publication;
* learning path course changes;
* assessment publication/configuration;
* moderation actions;
* administrative configuration changes.

A complete audit-log subsystem is not required during the current cleanup stage.

The requirement is preserved as part of the production security architecture.

---

# 46. Future IP Information

User IP information may eventually be useful for security and administrative auditing.

If implemented, it must have:

* a legitimate security purpose;
* restricted access;
* controlled retention;
* careful logging practices;
* no unnecessary exposure to normal users.

It must not become a general-purpose user-tracking mechanism.

---

# 47. Data Integrity Principles

The production database should enforce important relationships and uniqueness constraints.

Examples:

* unique user email;
* unique role assignment per user;
* valid foreign keys;
* valid course/category relationships;
* valid course/instructor relationships;
* valid course/chapter relationships;
* valid chapter/lesson relationships;
* unique lesson ordering within a chapter where appropriate;
* unique progress record per user/lesson;
* unique enrollment per user/course where appropriate;
* valid LearningPath/LearningPathCourse relationships;
* unique course membership within a path;
* unique course position within a path;
* valid assessment ownership;
* valid assessment/question relationships;
* valid attempt/answer relationships.

Exact indexes and constraints belong to the schema design phase.

---

# 48. Soft Delete / Historical Data

Destructive deletion requires special consideration because learning data may reference courses and lessons.

Before implementing delete operations, we must determine the lifecycle policy for:

* courses;
* chapters;
* lessons;
* questions;
* replies;
* enrollments;
* progress;
* learning paths;
* LearningPathCourse relationships;
* assessments;
* assessment questions;
* assessment attempts;
* attempt answers.

The current mock `deleteCourse()` / `deleteVideo()` behavior must not be copied blindly into production.

Preserving learning history and referential integrity is more important than reproducing the mock service API.

For Learning Paths specifically:

* removing a course from a path must not delete the course;
* removing a course from a path must not delete its progress;
* deleting/archiving a path must be considered separately from deleting its courses.

For assessments specifically:

* historical attempts must remain interpretable;
* deleting or editing an active question must not silently rewrite historical answers/results;
* assessment publication changes must be handled deliberately.

---

# 49. Current Mock Data

The existing mock data is transitional.

It is not authoritative domain design.

In particular:

* old video durations may violate the new 17:30 limit;
* old `watched` fields will become lesson progress;
* old course totals will become derived;
* old Q&A strings will become relationships;
* old role strings will become multi-role identity;
* old session/admin assumptions will disappear;
* no existing mock structure should force the Learning Path domain model;
* no existing mock assessment data should be treated as a final assessment model.

We should not spend significant effort making the current mock model perfectly represent the final database.

The correct approach is to refactor the domain first, then create clean mock/seed data matching the new model where useful.

---

# 50. Production Database Direction

The planned persistence stack is:

```text
PostgreSQL
    +
Drizzle ORM
```

The database design must be produced only after this document is approved.

The first schema should be designed around the domain entities rather than around the current mock interfaces.

Better Auth's required authentication tables must also be reconciled with the WNM application tables during implementation.

---

# 51. Initial Domain Entity Inventory

The core conceptual entities are:

```text
User
Role
UserRole

Course
Category
CourseCategory
CourseInstructor

Chapter
Lesson
Resource

Enrollment
LessonProgress

Question
QuestionReply

LearningPath
LearningPathCourse

Assessment
AssessmentQuestion
AssessmentAttempt
AttemptAnswer
AssessmentTopic/Skill relationship
```

The exact physical representation of assessment topics/skills is intentionally not fixed yet. V1 requires topic/skill attribution and lesson mapping, but does not require a generalized skill graph.

Future/domain-reserved entities include:

```text
CourseUpdate
Notification
SupportTicket
SupportMessage
AuditLog
```

These future entities do not automatically mean their tables will be created in the first migration.

---

# 52. MVP Boundary

The MVP domain should remain centered around:

```text
Identity
    ↓
Authorization
    ↓
Course
    ↓
Chapter
    ↓
Lesson
    ├── Tiptap content
    ├── optional YouTube video
    └── resources
    ↓
Enrollment
    ↓
LessonProgress
    ↓
Optional Diagnostic Assessment
    ├── Questions / Topics
    └── Attempts / Answers
    ↓
Question
    ↓
QuestionReply
```

Learning Paths are also part of the V1 product:

```text
LearningPath
    ↓
LearningPathCourse
    ↓
existing Courses
    ↓
existing Lessons / LessonProgress
    ↓
optional Path Assessment
```

Everything else should justify its existence before entering the first production implementation.

---

# 53. Decisions Still Requiring Approval

Before the final Drizzle schema, the following decisions must be explicitly settled:

### Identity

* exact account status values;
* whether phone is optional;
* profile field boundaries;
* final role storage model.

### Course

* final course status values;
* whether `ARCHIVED` is required;
* one vs multiple instructors in V1;
* slug strategy;
* category management;
* course language/localization strategy.

### Learning

* whether enrollment is mandatory for free courses;
* enrollment status values;
* lesson content rules;
* whether a lesson may be content-only, video-only, or both;
* course completion behavior after structural updates;
* deletion/archive behavior.

### Learning Paths

* final path status values;
* final slug rules;
* exact behavior when a published course later becomes draft/archived;
* whether a path may contain only published courses at publication time;
* exact path deletion/archive behavior.

### Assessments

* exact assessment status values;
* whether V1 permits one assessment per Course/Path or multiple assessment instances;
* supported question types in V1;
* exact answer/explanation model;
* exact topic/skill representation;
* exact question-to-lesson mapping rules;
* attempt limit, if any;
* retake availability rules;
* exact adaptive weighting algorithm;
* whether timed assessments are enabled for all assessments or configured per assessment;
* exact historical snapshot/version strategy;
* whether a passing score is stored now as a reporting field even though it is not a completion gate.

### Q&A

* final question statuses;
* whether students may edit/delete questions;
* whether instructors/moderators may edit/delete replies;
* moderation rules.

### Settings

* which current settings survive;
* whether live sessions remain a WNM feature;
* whether announcements become their own future domain.

### Database

* final ID strategy;
* timestamp conventions;
* indexing strategy;
* deletion strategy;
* migration ownership between Drizzle and Better Auth tooling.

These decisions must be settled before writing the production schema where they materially affect table structure.

---

# 54. Explicit Non-Goals for This Stage

We are **not** doing any of the following yet:

* writing Drizzle tables;
* creating PostgreSQL migrations;
* installing/configuring Better Auth;
* implementing real login;
* building the Tiptap editor;
* rebuilding every mock service;
* redesigning every UI route;
* implementing support;
* implementing chat;
* implementing payments;
* implementing self-hosted video;
* implementing notifications;
* implementing advanced analytics;
* implementing advanced path engines;
* implementing AI-generated learning paths;
* implementing RAG;
* implementing AI agents;
* implementing AI grading;
* implementing generalized question banks;
* implementing advanced adaptive testing.

The immediate goal is architectural correctness, not feature volume.

---

# 55. Future AI / RAG Boundary

AI is a planned future capability, not a forgotten feature.

The current architectural requirement is to keep learning data structured and trustworthy enough to support future AI/RAG systems.

Future AI may eventually use:

* course content;
* lesson content;
* topics/skills;
* assessment questions;
* assessment results;
* incorrect answers;
* progress history;
* Q&A;
* Learning Path context.

A future RAG layer may retrieve approved WNM content and provide context to an AI model.

The future system may eventually include specialized WNM agents, but no specific agent architecture, provider, model, vector database, or hosting strategy is approved yet.

The project must not introduce AI as a dependency for core LMS correctness.

---

# 56. Next Implementation Sequence

After this specification is reviewed and approved:

### Step 1 — Finalize Domain Foundation

Resolve the outstanding decisions.

### Step 2 — Refactor TypeScript domain types

Replace the legacy:

```text
Course → Video
```

contracts with:

```text
Course → Chapter → Lesson
```

and introduce the correct identity/progress/Q&A/Learning Path/assessment abstractions.

### Step 3 — Refactor mock data/services

Only after the domain types are stable.

### Step 4 — Design PostgreSQL + Drizzle

Create the production schema based on the approved domain.

### Step 5 — Integrate Better Auth

Connect Better Auth to PostgreSQL/Drizzle and reconcile its required authentication tables with the application domain.

### Step 6 — Implement authorization

Centralize:

* roles;
* permissions;
* server-side access checks;
* course ownership;
* enrollment checks;
* Learning Path management authorization;
* assessment access/submission authorization.

### Step 7 — Build the real LMS foundation

Implement:

* courses;
* chapters;
* lessons;
* Tiptap content;
* YouTube;
* enrollment;
* progress.

### Step 8 — Build Learning Paths

Implement:

* path creation;
* path publication;
* adding existing courses;
* course ordering;
* course removal;
* student path browsing;
* derived course/path progress.

### Step 9 — Build Diagnostic Assessments

Implement:

* assessment configuration;
* structured questions;
* topic/skill attribution;
* lesson recommendations;
* timed assessment behavior where enabled;
* attempt persistence;
* deterministic scoring;
* weak-topic analysis;
* different-question retakes;
* weak-topic weighting for later attempts.

### Step 10 — Build Q&A

Implement:

* questions;
* replies;
* moderation;
* authorization.

### Step 11 — Production hardening

Then address:

* rate limiting;
* audit logging;
* security headers;
* secrets;
* Cloudflare;
* deployment;
* backups;
* monitoring;
* rollback;
* production testing.

---

# 57. Architecture Rule

When future requirements appear, we should ask:

> Does this requirement need to exist in the current product, or does the architecture merely need to leave room for it?

If it only needs architectural room:

**design the boundary, don't build the feature.**

That rule applies especially to:

* support;
* chat;
* notifications;
* paid courses;
* self-hosted video;
* AI;
* RAG;
* AI agents;
* advanced analytics;
* certificates;
* generalized advanced assessments.

Learning Paths and the defined diagnostic assessment experience are explicit exceptions because they have been approved as V1 product features.

---

# 58. Status of This Document

This document is a **draft foundation specification**.

It is not yet authorization to implement the database.

The next checkpoint is independent architecture review by:

* Claude
* Kimi
* Qwen

Their feedback should be compared against this document.

Final decisions remain with the WNM project owner.

Once the specification is approved, the project may proceed to PostgreSQL/Drizzle schema design.
