# AI Exam Trainer

An exam practice site for AI engineering course material.

## Learning areas

- `/data-track` and `/midterm` are the separate Data Track practice and exam.
- `/ai-thuc-chien` lets learners choose between two independent course banks. Track 1 uses the 14 slide PDFs in `PDF track 1st`: AI/LLM foundations, product discovery, agents, RAG, data pipelines, deployment and evaluation. It has 160 questions from 40 practical artifacts.
- `/ai-thuc-chien/track-1` practices only Track 1. `/ai-thuc-chien/track-1/thi` samples its own 50-question, 90-minute exam.
- Track 4 uses the 9 slide PDFs in `PDF track 4`: neural networks, computer vision, sensing, tracking, fusion and annotation. It has 148 questions from 37 practical artifacts.
- `/ai-thuc-chien/track-4` practices only Track 4. `/ai-thuc-chien/track-4/thi` samples its own 50-question, 90-minute exam.

Each exam has 30 single-choice, 8 multiple-choice, 6 true/false and 6 written questions. Practice sessions draw up to 10 questions and store seen IDs separately per track in browser local storage. Objective answers are scored automatically. Written responses include rubrics for self-review.

## Unique visitors

The dashboard shows unique visitor browsers, deduplicated with a first-party HTTP-only cookie. It does not store IP addresses or personal information. Without accounts, the same person using another browser or device will be counted separately.

To enable the shared count in local and deployed environments, create an Upstash Redis database and add the values from `.env.example` to `.env.local` and the deployment environment. The count is not a page-view counter.

## Development

```bash
npm run dev
```
