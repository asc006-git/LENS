# LENS Platform — Project Status

_Last updated: 2026-07-05_

---

## 1. Tech Stack

| Layer | Technology | Version / Notes |
|-------|-----------|-----------------|
| **Frontend** | React 18 + Vite + TypeScript | `frontend/` — Vite dev server on :5173 |
| **Frontend routing** | React Router v6 | Guards: `AuthGuard`, `RoleGuard(role)` |
| **Frontend state** | TanStack React Query v5 | All API calls via hooks in `frontend/src/hooks/api/` |
| **Frontend styling** | Tailwind CSS | Custom theme with coral/sage/copper/terracotta palette |
| **Backend** | Node.js + Express + TypeScript | `backend/` — runs on :5000 |
| **Database** | MongoDB Atlas | `MONGODB_URI` points to `lens-cluster.qxrwzdn.mongodb.net/lens` |
| **ODM** | Mongoose 8.x | All models in `backend/src/modules/**/*.model.ts` |
| **AI Provider (primary)** | Groq | `llama-3.3-70b-versatile` via OpenAI SDK (`openai` npm pkg) |
| **AI Provider (fallback)** | Gemini | `gemini-2.5-flash` via REST API |
| **AI Provider (fallback 2)** | Ollama | `llama3.2` via localhost:11434 |
| **File storage** | Local filesystem | Cloudinary credentials are `dummy/dummy/dummy` — cloud uploads broken |
| **Auth** | JWT (access + refresh) | Access: 15m, Refresh: 7d |
| **Email** | Not configured | SMTP creds are empty — forgot-password generates a token but can't email it |

---

## 2. Backend Routes — Complete Inventory

### 2a. Auth (`/api/v1/auth`)

| Method | Path | Auth | Status | Notes |
|--------|------|------|--------|-------|
| POST | `/register` | Public | **Working** | Creates user, hashes password, returns tokens |
| POST | `/login` | Public | **Working** | Validates credentials, returns access+refresh tokens |
| POST | `/logout` | JWT | **Working** | Clears refresh token |
| POST | `/refresh` | Public | **Working** | Issues new access token from refresh token |
| POST | `/forgot-password` | Public | **Working** | Creates reset token — **cannot email it** (SMTP not configured) |
| POST | `/reset-password` | Public | **Working** | Validates reset token and updates password |
| GET | `/me` | JWT | **Working** | Returns current user |

### 2b. Learning Sessions (`/api/v1/learning-sessions`)

| Method | Path | Auth | Status | Notes |
|--------|------|------|--------|-------|
| POST | `/` | JWT | **Working** | Creates session with course/assignment refs |
| GET | `/` | JWT | **Working** | Paginated session list for student |
| GET | `/active` | JWT | **Working** | Returns most recent non-completed/archived session |
| GET | `/:id` | JWT | **Working** | Returns full session document |
| POST | `/:id/upload` | JWT | **Working** | Uploads files (multipart, max 10 files, 50MB) |
| POST | `/:id/analyze` | JWT | **Working** | Sync analysis (old path — prefer upload-and-analyze) |
| POST | `/:id/upload-and-analyze` | JWT | **Working** | Returns 202, runs `runFullAnalysisPipeline` in background |
| GET | `/:id/blueprint` | JWT | **Working** | Returns session with blueprint |
| PUT | `/:id/blueprint/confirm` | JWT | **Working** | Sets `blueprint.confirmed = true` |
| POST | `/:id/validation/start` | JWT | **Working** | Sets `validation.startedAt`, generates questions from blueprint concepts |
| POST | `/:id/validation/response` | JWT | **Working** | Saves a validation response to `validation.responses[]` |
| POST | `/:id/validation/evaluate` | JWT | **Working** | Calls LLM to evaluate + save answer |
| POST | `/:id/reflection` | JWT | **Working** | Calls LLM to generate reflection sections |
| POST | `/:id/reflection/analyze` | JWT | **Working** | Analyzes free-text reflection |
| POST | `/:id/report` | JWT | **Working** | Generates report from session data |
| PUT | `/:id/resume` | JWT | **Working** | Updates `lastActiveTime` + `deviceInfo` |
| POST | `/:id/complete` | JWT | **Working** | Sets status to `completed` |
| DELETE | `/:id` | JWT | **Working** | Hard-deletes session |

**Notable endpoint mismatches (frontend calls routes that don't exist):**
- `GET /:id/analysis` — frontend `useSessionAnalysis` calls this; **route does not exist** (but hook is unused in any page)
- `GET /:id/validation` — frontend `useValidation` calls this; **route does not exist** (but SessionValidation.tsx bypasses it with direct `apiClient.get` to BY_ID)
- `POST /:id/validation/answer` — frontend `useSubmitAnswer` sends to this path; backend route is `POST /:id/validation/evaluate` — **404 if called**

### 2c. Courses (`/api/v1/courses`)

| Method | Path | Auth | Status | Notes |
|--------|------|------|--------|-------|
| POST | `/` | Faculty | **Working** | Creates course with facultyId + institution |
| POST | `/:courseId/enroll` | Student | **Working** | Self-enrolls student in course |
| POST | `/:courseId/enroll-student` | Faculty | **Working** | Enrolls student by email |
| GET | `/` | JWT | **Working** | Faculty sees own courses; students see enrolled courses |
| GET | `/:courseId` | JWT | **Working** | Returns course with populated students |
| POST | `/:courseId/assignments` | Faculty | **Working** | Creates assignment with optional expectations |
| GET | `/:courseId/assignments` | JWT | **Working** | Lists assignments for a course |
| GET | `/:courseId/assignments/:assignmentId` | JWT | **Working** | Single assignment detail |
| GET | `/:courseId/assignments/:assignmentId/submissions` | Faculty | **Working** | All student submissions for an assignment |
| GET | `/assignments/mine` | Student | **Working** | Cross-course assignments for current student |

### 2d. Faculty (`/api/v1/faculty`)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/dashboard` | **Working** | Aggregated metrics + concept heatmap + recent activity |
| GET | `/courses` | **Working** | Faculty's courses with avg authenticity |
| GET | `/courses/:courseId` | **Working** | Course detail with concept stats + `flaggedSessions[]` |
| GET | `/students` | **Working** | Reuses dashboard data |
| GET | `/students/:studentId` | **Working** | Per-student intelligence (sessions, concept mastery) |
| GET | `/students/:studentId/journey` | **Working** | Chronological session timeline for a student |
| GET | `/analytics` | **Working** | Teaching recommendations from concept difficulty analysis |
| GET | `/insights` | **Working** | Same as `/analytics` (duplicate route) |
| GET | `/reports` | **Working** | Reuses dashboard data |
| GET | `/interventions` | **Working** | All interventions for this faculty |
| POST | `/interventions` | **Working** | Creates intervention with title, targetStudents, targetConcepts |
| GET | `/impact` | **Working** | Time-windowed stats (`?startDate=&endDate=`) |

### 2e. Dashboard (`/api/v1/dashboard`)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/` | **Working** | Student dashboard with metrics, recommendations, streak |

### 2f. Mentor (`/api/v1/mentor`)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| POST | `/chat` | **Working** | Returns AI mentor response with student session context. Uses 45s timeout client-side, 2 retries (500ms/1500ms). Graceful error fallback. |

### 2g. Reports (`/api/v1/reports`)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/` | **Working** | Returns completed sessions aggregated as reports |
| GET | `/:id` | **Working** | `ReportService.getReport()` |
| POST | `/:id/export` | **Working** | Export with `?format=` param |
| POST | `/share` | **Working** | `ReportService.shareReport()` |

### 2h. Recommendations (`/api/v1/recommendations`)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/` | **Working** | Sessions with guidedLearning activities |
| GET | `/:sessionId` | **Working** | `RecommendationService.getRecommendations()` |
| POST | `/:sessionId/complete` | **Working** | Completes an activity (`body.activityIndex`) |
| POST | `/regenerate` | **Working** | `body.sessionId` + `body.focusAreas` |

### 2i. Portfolio (`/api/v1/portfolio`)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/` | **Working** | Aggregated portfolio (stats, concept mastery, reflection library, learning DNA) |
| GET | `/dna` | **Working** | Learning style distribution from completed sessions |
| GET | `/timeline` | **Working** | Paginated session timeline |
| GET | `/export` | **Working** | Full portfolio export (`?format=json`) |

### 2j. Reflection (`/api/v1/reflection`)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/` | **Working** | All sessions where `reflection.sections` exists and non-empty |
| GET | `/:sessionId` | **Working** | Single session's reflection |
| PUT | `/:sessionId/sections/:sectionId` | **Working** | Updates specific section content |

### 2k. Achievements (`/api/v1/achievements`)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/` | **Working** | All achievements for current student, sorted by earnedAt desc |
| POST | `/evaluate` | **Working** | Re-evaluates and creates any newly earned achievements |
| POST | `/:id/claim` | **Working** | Marks achievement as claimed |

### 2l. Notifications (`/api/v1/notifications`)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/` | **Working** | Paginated notifications |
| GET | `/unread-count` | **Working** | Count of unread |
| PUT | `/:id/read` | **Working** | Mark single as read |
| PUT | `/read-all` | **Working** | Mark all as read |
| DELETE | `/:id` | **Working** | Delete notification |

---

## 3. Learning Session Lifecycle

The pipeline goes through these stages. **No session has ever completed end-to-end** due to the now-fixed blueprint timeout bug.

### Stage Flow
```
created → uploading → analyzing → [assignment_mismatch?] → blueprint_generated
    → blueprint_confirmed → validating → validating_completed → reflection_saved
    → report_generated → completed
```

### Stage-by-stage status

| Stage | Status | Details |
|-------|--------|---------|
| `created` | **Working** | `POST /` creates session with student/course/assignment refs |
| `uploading` | **Working** | Files stored to `backend/uploads/:sessionId/` via multer |
| `analyzing` | **Working** | Text extracted via `pdf-parse@1.1.1`, sent to Groq for concept extraction |
| `assignment_mismatch` | **NEW — Untested** | New stage. LLM checks alignment if assignment linked. If `aligned===false && confidence>=0.7`, pipeline stops here. |
| `blueprint_generated` | **Working (with 60s timeout)** | Groq generates JSON blueprint. `safelyParseBlueprint()` handles schema variations. **60s timeout added** — if exceeded, falls to `analysis_failed`. |
| `blueprint_confirmed` | **Working** | Student confirms blueprint via PUT /blueprint/confirm |
| `validating` | **Working** | `POST /validation/start` generates typed questions from blueprint concepts + faculty expectations |
| `validating_completed` | **Working** | All concepts answered, overall understanding computed |
| `reflection_saved` | **Working** | LLM generates reflection with cross-session consistency |
| `report_generated` | **Working** | Report with conceptMastery, authenticity, recommendations |
| `completed` | **Working** | Final status set |

### Known lifecycle issue
- **No end-to-end test has succeeded** because the previous blueprint timeout (AI response taking >30s) caused `runFullAnalysisPipeline` to get stuck at `analyzing` forever, stuck at 25% progress with "Processing..." state in the UI.
- **Fix applied**: 60s hard `Promise.race` timeout wraps `generateBlueprintFromAnalysis`. If it times out, session stage is set to `analysis_failed` with `errorMessage: "Blueprint generation timed out after 60s"`. The frontend polling will see this and show the retry/failure UI.

---

## 4. Validation Flow — Specifics

| Step | Backend Route | Frontend Caller | Status | Details |
|------|---------------|----------------|--------|---------|
| **Start validation** | `POST /:id/validation/start` | `useStartValidation` → `SessionValidation` | **Working** | Sets `validation.startedAt`, clears responses. Now also generates questions from blueprint concepts if `validation.questions` is empty (added in current batch) |
| **Get questions** | No dedicated GET route | Reads from `GET /:id` session response → `session.validation.questions` | **Working** via session endpoint | Frontend calls `GET /api/v1/learning-sessions/:sessionId` and extracts `data.validation.questions`. If empty, falls back to generating name-based questions from `blueprint.concepts`. |
| **Submit answer** | `POST /:id/validation/response` | `useSubmitAnswer` calls `POST /:id/validation/answer` | **BROKEN** | Frontend sends to `/validation/answer` (no backend route). Backend only has `/validation/response` and `/validation/evaluate`. The frontend payload `{questionId, answer, timeSpent, confidence}` also doesn't match backend's expected `{concept, question, response, understanding, confidence, hints}`. This will 404 or 400. |
| **Evaluate answer** | `POST /:id/validation/evaluate` | Not called from any frontend page | **Working** but orphaned | Calls LLM to score the answer against `expectedAnswerPoints`. No frontend code sends to this route. |
| **Complete validation** | Handled by `completeSession` | No explicit complete-validate call | **Partially working** | `POST /:id/complete` sets status to `completed` but doesn't specifically seal validation phase. The learning-session routes have no dedicated "complete validation" endpoint; must go through the full pipeline. |

### Validation Route Mismatch Detail
- Backend route file: `backend/src/modules/learning/learning-session.routes.ts:53`
- Frontend endpoint: `frontend/src/api/endpoints.ts:17` — `SUBMIT_ANSWER: (id) => /api/v1/learning-sessions/${id}/validation/answer`
- Frontend hook: `frontend/src/hooks/api/useValidation.ts:46` — posts to `SUBMIT_ANSWER(sessionId)` with `{ questionId, answer, timeSpent, confidence }`
- Backend expects: `POST /validation/evaluate` with `{ concept, question, studentAnswer, expectedAnswerPoints, confidence }` OR `POST /validation/response` with `{ concept, question, response, understanding, confidence, hints }`
- **Impact**: SessionValidation.tsx's `handleNext` calls `submitAnswer.mutateAsync` which will hit a 404. The frontend `SessionValidation` page will show "Failed to submit answer" toast and block navigation.

---

## 5. Assignment Alignment Check

| Aspect | Status | Details |
|--------|--------|---------|
| **Implementation** | **Done** | `checkAssignmentAlignment()` in `backend/src/modules/learning/document-analysis.service.ts:194` |
| **Schema** | Done | Returns `{ aligned: boolean, confidence: number, reason: string }` parsed from LLM JSON response |
| **Pipeline integration** | **Done** | Called in `runFullAnalysisPipeline()` at `learning-session.service.ts:230` — runs after text extraction, before `analyzeDocument()` |
| **Skip condition** | Done | Skips entirely when `session.assignment` is not set (self-directed sessions) |
| **Mismatch threshold** | Done | Confidence >= 0.7 required; below that, logs but proceeds (ambiguous result) |
| **Stage on mismatch** | Done | Sets `session.status = ASSIGNMENT_MISMATCH` (value `'assignment_mismatch'`) |
| **Reason stored** | Done | Stored in `session.assignmentMismatchReason` |
| **Faculty view** | Done | `getFacultyCourseDetail()` includes `flaggedSessions[]` with student name + reason |
| **Frontend display** | Done | SessionAnalysis.tsx shows neutral message + amber-colored warning badge |
| **End-to-end test** | **Not tested** | No session has completed the pipeline. Need to upload a clearly mismatched document (e.g., a recipe against a "Data Structures" assignment) and confirm the pipeline stops. |

---

## 6. Database Models

### 6a. User (`backend/src/modules/users/user.model.ts`)
| Field | Type | Constraints |
|-------|------|------------|
| `name` | String | required, 2-100 chars, trim |
| `email` | String | required, unique, lowercase, regex validated |
| `password` | String | required, min 8 chars, `select: false`, bcrypt-hashed |
| `role` | UserRole | default: `student` |
| `institution` | String | optional, trim |
| `department` | String | optional, trim |
| `avatar` | String | optional |
| `preferences.learningStyle` | LearningStyle | default: `visual` |
| `preferences.aiExplanationDepth` | `'beginner'\|'intermediate'\|'advanced'` | default: `'intermediate'` |
| `preferences.theme` | `'light'\|'dark'\|'system'` | default: `'system'` |
| `preferences.language` | String | default: `'en'` |
| `isEmailVerified` | Boolean | default: `false` |
| `refreshToken` | String | `select: false` |
| `lastLogin` | Date | optional |
| `status` | `'active'\|'inactive'\|'suspended'` | default: `'active'` |
| `createdAt` / `updatedAt` | Date | auto (timestamps: true) |

### 6b. Course (`backend/src/modules/course/course.model.ts`)
| Field | Type | Constraints |
|-------|------|------------|
| `name` | String | required, trim |
| `code` | String | required, trim |
| `description` | String | default: `''` |
| `facultyId` | ObjectId (ref: User) | required |
| `institution` | String | required, trim |
| `semester` | String | default: `''` |
| `students[]` | ObjectId[] (ref: User) | |
| `createdAt` / `updatedAt` | Date | auto |

### 6c. Assignment (`backend/src/modules/course/assignment.model.ts`)
| Field | Type | Constraints |
|-------|------|------------|
| `courseId` | ObjectId (ref: Course) | required |
| `facultyId` | ObjectId (ref: User) | required |
| `title` | String | required, trim |
| `description` | String | default: `''` |
| `dueDate` | Date | optional |
| `fileAttachment` | String | optional |
| `expectedConcepts[]` | String[] | optional |
| `rubricCriteria[]` | String[] | optional |
| `learningObjectives[]` | String[] | optional |
| `facultyNotes` | String | optional |
| `createdAt` / `updatedAt` | Date | auto |

### 6d. LearningSession (`backend/src/modules/learning/learning-session.model.ts`)

Full document with nested sub-objects:

| Top Field | Sub-fields | Notes |
|-----------|-----------|-------|
| `student` | ObjectId (ref: User) | required |
| `course` | ObjectId (ref: Course) | optional |
| `assignment` | ObjectId (ref: Assignment) | optional |
| `status` | SessionStatus enum | default: `created` |
| `learningObjective` | String | optional |
| `assignmentMismatchReason` | String | added via `schema.add()` |
| `errorMessage` | String | added via `schema.add()` |
| `uploadedFiles[]` | `{ name, url, size, type, uploadedAt }` | |
| `aiAnalysis` | `{ concepts[], topicClassification, difficultyEstimate, learningObjectives[], generatedAt }` | |
| `blueprint` | `{ concepts[], learningGoals[], dependencies, estimatedTime, difficulty, confirmed, confirmedAt }` | |
| `validation` | `{ startedAt?, completedAt?, questions[], responses[], overallConfidence, overallUnderstanding }` | `questions[]` added in current batch |
| `reflection` | `{ generatedAt?, sections[], studentEdits, aiGenerated }` | |
| `report` | `{ generatedAt?, learningAuthenticity, confidenceIndex, conceptMastery, aiLearningBalance, strengths[], growthOpportunities[], recommendations[] }` | |
| `guidedLearning` | `{ activities[], roadmap[] }` | |
| `sessionState` | `{ currentStage, completionPercentage, lastActiveTime, resumePoint, deviceInfo }` | |
| `createdAt` / `updatedAt` | Date | auto |

### 6e. Intervention (`backend/src/modules/faculty/intervention.model.ts`)
| Field | Type |
|-------|------|
| `facultyId` | ObjectId (ref: User), required |
| `title` | String, required |
| `description` | String, required |
| `targetStudents[]` | ObjectId[] (ref: User) |
| `targetConcepts[]` | String[] |
| `status` | `'draft'\|'active'\|'completed'\|'archived'` |
| `startDate` / `endDate` | Date (optional) |

### 6f. Achievement (`backend/src/modules/achievements/achievement.service.ts`)
| Field | Type |
|-------|------|
| `student` | ObjectId (ref: User), required |
| `type` | String, required (8 predefined types) |
| `title` | String, required |
| `description` | String, required |
| `icon` | String, default: `'trophy'` |
| `criteria` | Mixed |
| `earnedAt` | Date (optional) |
| `claimed` | Boolean, default: false |
| `metadata` | Mixed |

### 6g. AiDebugLog (`backend/src/ai/models/ai-debug-log.model.ts`)
| Field | Type |
|-------|------|
| `sessionId` | String, required, indexed |
| `module` | String, required, indexed |
| `prompt` | String, required |
| `responseText` | String, default: `''` |
| `aiModel` | String, required |
| `duration` | Number, required |
| `tokensUsed` | `{ prompt: Number, completion: Number }` (optional) |
| `error` | String (optional) |
| `createdAt` | Date, TTL index: 7 days |

### 6h. Institution (`backend/src/modules/institution/institution.model.ts`)
| Field | Type |
|-------|------|
| `name` | String, required, trim |
| `code` | String, required, unique, uppercase |
| `domain` | String, optional |

### 6i. Notification (`backend/src/modules/notifications/notification.service.ts`)
| Field | Type |
|-------|------|
| `recipient` | ObjectId (ref: User), required |
| `type` | NotificationType enum, required |
| `title` | String, required |
| `message` | String, required |
| `read` | Boolean, default: false |
| `data` | Mixed (optional) |

---

## 7. Frontend Pages / Screens

### Student pages

| Route | Component | Data Status | Notes |
|-------|-----------|------------|-------|
| `/student/dashboard` | `Dashboard` | **Real** | Metrics from `GET /api/v1/dashboard`; sessions from `GET /api/v1/learning-sessions` |
| `/student/learning/new` | `CreateLearningSession` | **Real** | Courses from `GET /api/v1/courses`; assignments per course; file upload; 6-step wizard |
| `/student/learning/:sessionId` | `SessionAnalysis` | **Real** | Redirects to `/analysis`. Session from `GET /:id`. Polls every 2.5s. |
| `/student/learning/:sessionId/analysis` | `SessionAnalysis` | **Real** | Real stages, concepts display, blueprint navigation, retry on failure, mismatch display |
| `/student/learning/:sessionId/blueprint` | `SessionBlueprint` | **Real** | Blueprint from `GET /:id/blueprint`. Confirms via `PUT /blueprint/confirm`. |
| `/student/learning/:sessionId/validation` | `SessionValidation` | **Real (partially)** | Loads questions from `GET /:id` → `validation.questions`. Submit POST is **broken** (wrong route). |
| `/student/learning/:sessionId/reflection` | `SessionReflection` | **Real** | Shows reflection sections from session data |
| `/student/learning/:sessionId/report` | `SessionReport` | **Real** | Report data from session |
| `/student/learning/:sessionId/guided-learning` | `GuidedLearning` | **Real** | Guided learning activities from session |
| `/student/portfolio` | `Portfolio` | **Real** | Uses `GET /api/v1/portfolio`. No mock fallback. Streak computed. |
| `/student/reports` | `Reports` | **Real** | Sessions list, each linkable |
| `/student/mentor` | `AIMentor` | **Real** | Chat UI backed by `POST /api/v1/mentor/chat` with 45s timeout |
| `/student/achievements` | `Achievements` | **Real** | Uses `GET /api/v1/achievements`. No static list. |
| `/student/settings` | `StudentSettings` | **Real** | User preferences |
| `/student/reflection` | `ReflectionNotebook` | **Real** | Uses `GET /api/v1/reflection` |

### Faculty pages

| Route | Component | Data Status | Notes |
|-------|-----------|------------|-------|
| `/faculty/dashboard` | `FacultyDashboard` | **Real** | Dashboard metrics from `GET /api/v1/faculty/dashboard` |
| `/faculty/courses` | `CourseIntelligence` | **Real** | Course list view; Create Course modal; links to detail |
| `/faculty/courses/:courseId` | `CourseIntelligence` | **Real** | Course detail with stats, heatmap, assignments, enroll, flagged submissions |
| `/faculty/students/:studentId` | `StudentIntelligence` | **Real** | Per-student concept mastery |
| `/faculty/analytics` | `TeachingInsights` | **Real** | Class analytics, challenging concepts, AI suggestions |
| `/faculty/interventions` | `InterventionPlanner` | **Real** | Create and view interventions |
| `/faculty/reports` | `ImpactAnalytics` | **Real** | Time-windowed impact stats |
| `/faculty/settings` | `StudentSettings` (reused) | **Real** | Settings page (reused component) |

---

## 8. Known Bugs

### 8a. Validation answer submission hits 404 — **HIGH PRIORITY**
- **File**: `frontend/src/hooks/api/useValidation.ts:46` sends to `POST /api/v1/learning-sessions/:id/validation/answer`
- **Backend**: `backend/src/modules/learning/learning-session.routes.ts:53` registers `POST /:id/validation/response` and `:54` registers `POST /:id/validation/evaluate`
- **Effect**: When a student clicks "Next" on SessionValidation.tsx, `useSubmitAnswer()` fires `POST /validation/answer` → 404 → `toast.error('Failed to submit answer')` → validation progress is blocked.

### 8b. Frontend validation answer payload shape doesn't match backend
- **Frontend sends**: `{ questionId: string, answer: string, timeSpent: number, confidence: number }`
- **Backend `/response` expects**: `{ concept: string, question: string, response: string, understanding: string, confidence: number, hints: string[] }`
- **Backend `/evaluate` expects**: `{ concept: string, question: string, studentAnswer: string, expectedAnswerPoints: string[], confidence: number }`
- **Effect**: Even if the route were fixed, the payload doesn't match any backend schema.

### 8c. `GET /:id/validation` and `GET /:id/analysis` routes do not exist
- **File**: `frontend/src/hooks/api/useValidation.ts:10` and `frontend/src/hooks/api/useLearningSession.ts:44`
- **Backend**: No `GET /:id/validation` or `GET /:id/analysis` routes exist in any route file
- **Current workaround**: SessionValidation.tsx bypasses `useValidation` and calls `GET /:id` directly; SessionAnalysis.tsx uses `useLearningSession` (calls `GET /:id`). The orphaned hooks cause no current crash but waste query cache entries.

### 8d. Blueprint timeout was previously indefinite — **FIXED in current batch**
- **Context**: `runFullAnalysisPipeline` called `BlueprintService.generateBlueprintFromAnalysis()` with no timeout. Groq free-tier can take >30s for large documents and occasionally never returns.
- **Fix**: `Promise.race` with 60s timeout added at `backend/src/modules/learning/learning-session.service.ts:288`
- **Residual risk**: If Groq takes 30-60s, the frontend polls for 60 seconds before seeing either `blueprint_generated` or `analysis_failed`. This is correct behavior but may appear slow.

### 8e. Cloudinary credentials are placeholders
- **File**: `backend/.env:26-28` — all three values are `dummy`
- **Effect**: Any code path that tries to upload to Cloudinary will fail (no current code path uses Cloudinary — files are stored locally).

### 8f. SMTP not configured — forgot-password can't email
- **File**: `backend/.env` — no SMTP_USER or SMTP_PASS set
- **Effect**: `POST /auth/forgot-password` generates a reset token and stores it on the user, but `POST /auth/reset-password` cannot verify it via email link. Password reset is effectively non-functional.

### 8g. `POST /:id/validation/evaluate` exists but is never called from frontend
- **File**: `backend/src/modules/learning/learning-session.routes.ts:54`
- **Frontend**: No frontend code calls this route. The `evaluateAnswer` controller calls `ValidationService.submitAndEvaluateAnswer()` which calls `DocumentAnalysisService.evaluateAnswer()` (LLM call for scoring). Fully implemented and tested at backend level but has no UI trigger.

### 8h. No streak evaluation for `streak_3` and `streak_7` achievements
- **File**: `backend/src/modules/achievements/achievement.service.ts`
- **Details**: The `evaluateAchievements()` method handles `first_session`, `five_sessions`, `ten_sessions`, `high_confidence`, `perfect_session`, and `master_concept` but has **no cases for `streak_3` or `streak_7`** — they fall through the switch without setting `earned = true`, so they will never unlock.

---

## 9. Environment Variables

### Required variables

| Variable | Current Value | Status | Used In |
|----------|--------------|--------|---------|
| `PORT` | `5000` | **Set** | Server listen port |
| `NODE_ENV` | `development` | **Set** | Express environment |
| `MONGODB_URI` | `mongodb+srv://lens-user:asc123!@lens-cluster.qxrwzdn.mongodb.net/lens` | **Set** | MongoDB Atlas connection |
| `JWT_SECRET` | `ccafab6e03e...` (64-char hex) | **Set** | Access token signing |
| `JWT_REFRESH_SECRET` | `b4354de71991a...` (64-char hex) | **Set** | Refresh token signing |
| `GROQ_API_KEY` | `gsk_7NxSbN3HVIrJmFXm9Rsx...` | **Set** | Primary AI provider |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | **Set** | Groq model name |
| `GEMINI_API_KEY` | `AQ.Ab8RN6LL8Ylvt7azZvgfRlM2GpO9zA...` | **Set** | Fallback AI provider |
| `GEMINI_MODEL` | `gemini-2.5-flash` | **Set** | Gemini model name |
| `FRONTEND_URL` | `http://localhost:5173` | **Set** | CORS origin |

### Optional / Fallback variables

| Variable | Current Value | Status | Notes |
|----------|--------------|--------|-------|
| `REDIS_URL` | `redis://localhost:6379` | **Set** | Not actively used (no connection code found) |
| `JWT_EXPIRES_IN` | `15m` | **Set** | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | **Set** | Refresh token TTL |
| `CLOUDINARY_CLOUD_NAME` | `dummy` | **Set (placeholder)** | Cloud uploads broken |
| `CLOUDINARY_API_KEY` | `dummy` | **Set (placeholder)** | Cloud uploads broken |
| `CLOUDINARY_API_SECRET` | `dummy` | **Set (placeholder)** | Cloud uploads broken |
| `RATE_LIMIT_WINDOW_MS` | `900000` | **Set** | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | **Set** | Max requests per window |
| `OPENROUTER_API_KEY` | (not set) | **Not set** | Not used |
| `OPENAI_API_KEY` | (not set) | **Not set** | Not used |
| `SMTP_HOST` | `smtp.gmail.com` | **Default** | Not functional |
| `SMTP_USER` / `SMTP_PASS` | (not set) | **Not set** | Email sending broken |
| `LLM_PROVIDER` | `auto` | **Default** | `auto` = picks Groq if key present |
| `LOG_LEVEL` | Not in .env (default: `debug`) | **Default** | `backend/src/config/index.ts:72` |

---

## 10. Critical Path to First Complete Session

To complete one full session end-to-end, these bugs must be fixed in order:

1. **Fix `POST /:id/validation/answer` route** — Either rename backend route to `/validation/answer` or update frontend to call `/validation/response` or `/validation/evaluate`. Also fix the payload shape.
2. **Fix `POST /:id/validation/response` payload mismatch** — Update the frontend to send `{ concept, question, response, understanding, confidence, hints }` instead of `{ questionId, answer, timeSpent, confidence }`.
3. **(optional) Address streak achievements** — Add `streak_3` and `streak_7` cases to the achievement evaluation switch.
4. **Run an end-to-end test** — After the above fixes, create a session, upload a matching document, confirm the pipeline completes through all stages, and verify Portfolio/Achievements pages populate with real data.
