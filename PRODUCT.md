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
- AI Thực Chiến L3–4 must have its own dedicated practice page. Its mock exam can live on a separate L3–4 route.
- L3–4 content is based on course slides and practical work, with realistic workplace scenarios.
- The L3–4 mock exam format is 50 questions in 90 minutes: 30 single-choice, 8 multiple-choice, 6 true/false, and 6 written responses.
- Existing question formats, local browser persistence, and the app's product UI conventions should be preserved where applicable.

## Evidence on Hand

- L3–4 question bank: `data/ai-thuc-chien-bank.ts`, generated from 77 practical artifacts and covering 23 course days. (Existing project content; original PDFs are in the user's AIthucchien folder.)
- Existing product routes and visual implementation under `app/` and `components/`.

## Product Principles

- Keep distinct courses and exam banks clearly separated.
- Connect slide knowledge to evidence-based work scenarios.
- Make practice varied and reduce repeated questions across sessions.
- Make exam timing, format, and self-review limits clear.
