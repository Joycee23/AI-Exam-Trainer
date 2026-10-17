# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are learners preparing for AI engineering work and course exams. (Inferred from the user's request and existing application.)

## Product Purpose

AI Exam Trainer helps learners review course material through question banks, practice sessions, and timed mock exams. Success means recalling course concepts and applying them to realistic engineering situations. (Inferred from the user's request and existing application.)

## Capabilities and Constraints

- The existing application has separate Data Track and Midterm learning areas.
- AI Thực Chiến has two independent programs: Track 1 and Track 4. Their practice questions and mock exams must stay separate.
- Track 1 uses the slides in `PDF track 1st`; Track 4 uses the slides in `PDF track 4`.
- Both programs combine their own course slide content with realistic workplace scenarios.
- Each mock exam is 50 questions in 90 minutes: 30 single-choice, 8 multiple-choice, 6 true/false, and 6 written responses.
- Existing question formats, local browser persistence, and the app's product UI conventions should be preserved where applicable.

## Evidence on Hand

- Track 1 bank: 160 questions from 40 artifacts. Track 4 bank: 148 questions from 37 artifacts. Both are in `data/ai-thuc-chien-bank.ts` and derive from the user's slide folders.
- Existing product routes and visual implementation under `app/` and `components/`.

## Product Principles

- Keep distinct courses and exam banks clearly separated.
- Connect slide knowledge to evidence-based work scenarios.
- Make practice varied and reduce repeated questions across sessions.
- Make exam timing, format, and self-review limits clear.
