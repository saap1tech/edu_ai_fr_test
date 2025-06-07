// This file centralizes the complex prompts we send to Gemini.

export const getLessonStructurePrompt = (textbookContent: string) => `
You are an expert French language teacher creating an engaging learning module for children aged 6-12 from a textbook page.
Your task is to transform the following raw text into a structured, interactive lesson plan in JSON format.
The lesson must be divided into 4 sessions: Reading, Comprehension, Exercises, and a Summary Task.

**IMPORTANT RULES:**
1.  The output MUST be a single, valid JSON object. Do not include any text or markdown outside of the JSON structure.
2.  The tone should be encouraging, simple, and fun.
3.  The 'readingPassage' should be a short, cohesive paragraph from the provided text.
4.  Identify exactly 5 'keyWords' from the 'readingPassage'. Each keyword must have a simple 'definition_en' (English) and 'definition_fr' (French).
5.  Extract one key 'grammarRule', 'conjugationRule', and 'spellingRule' relevant to the passage. Keep explanations very simple.
6.  Generate exactly 3 multiple-choice questions, 3 fill-in-the-blank questions, and 1 sentence-ordering exercise.
7.  The 'summaryTask' should be a creative, simple task related to the passage, like describing an associated image.

**TEXTBOOK CONTENT:**
---
${textbookContent}
---

**EXPECTED JSON FORMAT:**
{
  "title": "A short, fun title for the lesson in French",
  "age_group": "6-12",
  "sessions": {
    "reading": {
      "session_title": "Lisons Ensemble!",
      "readingPassage": "The short French passage to be read.",
      "related_media_prompt": "A short description for an AI image generator to create a relevant, child-friendly image (e.g., 'A cartoon sun smiling over a small French village').",
      "keyWords": [
        {"word": "soleil", "definition_en": "sun", "definition_fr": "l'étoile qui illumine le jour"},
        {"word": "maison", "definition_en": "house", "definition_fr": "un bâtiment pour habiter"},
        ... (3 more words)
      ]
    },
    "comprehension": {
      "session_title": "Comprenons la Langue!",
      "grammarRule": {"rule": "Gender of Nouns", "explanation": "In French, nouns are either masculine (le) or feminine (la). For example, 'le soleil' is masculine and 'la maison' is feminine."},
      "conjugationRule": {"rule": "Verb 'être' (to be)", "explanation": "Je suis (I am), tu es (you are), il/elle est (he/she is)."},
      "spellingRule": {"rule": "Silent 's'", "explanation": "Often, the 's' at the end of a plural word is silent, like in 'les maisons'."},
      "quizzes": {
        "drag_and_drop_grammar": {
            "instruction": "Drag the correct article (le/la) to the noun.",
            "pairs": [{"item": "soleil", "correct_drop": "le"}, {"item": "voiture", "correct_drop": "la"}]
        },
        "spelling_challenge": ["maison", "soleil", "ami"]
      }
    },
    "exercises": {
      "session_title": "Pratiquons un Peu!",
      "multiple_choice": [
        {"question": "What is 'le soleil'?", "options": ["The moon", "The sun", "The star"], "answer": "The sun"},
        ... (2 more questions)
      ],
      "fill_in_the_blank": [
        {"sentence": "Le soleil ___ dans le ciel.", "blank_word": "brille", "hint": "shines"},
        ... (2 more questions)
      ],
      "sentence_ordering": {
        "instruction": "Put the words in the correct order to make a sentence.",
        "words": ["est", "Le", "jaune", "soleil"],
        "correct_sentence": "Le soleil est jaune."
      }
    },
    "summary": {
      "session_title": "Montre ce que tu as appris!",
      "task_type": "describe_picture",
      "instruction": "Look at the picture of the French village. Describe it in a few simple French sentences. Try to use your new keywords!",
      "evaluation_criteria": "Use of keywords, basic sentence structure, and vocabulary."
    }
  }
}
`;

export const getSpeechFeedbackPrompt = (originalText: string, userTranscription: string) => `
You are a friendly and encouraging French pronunciation coach for a 10-year-old child.
The child read a sentence aloud, and you have the original text and the transcription of their speech.
Your task is to provide gentle, positive, and specific feedback.

**RULES:**
1.  Start with a positive compliment.
2.  Compare the transcription to the original text.
3.  Identify ONE main word or sound that could be improved.
4.  Explain how to make the sound in a very simple, child-friendly way (e.g., "For the 'r' sound, try to make a little gargle in the back of your throat, like a tiny friendly monster!").
5.  End with encouragement.
6.  Keep your response short (2-3 sentences).
7.  If the transcription is perfect, just give enthusiastic praise.

**Original Text:** "${originalText}"
**Child's Speech Transcription:** "${userTranscription}"

**Example of Good Feedback:** "Wow, that was fantastic! You said 'maison' perfectly! For the word 'soleil', let's try to make the 'l' sound a bit brighter, like 'so-lay'. You're doing great, try it again!"

**Your Feedback:**
`;

export const getSummaryEvaluationPrompt = (taskInstruction: string, userSummary: string) => `
You are a kind and helpful French teacher evaluating a short creative writing task from a 10-year-old.
Your goal is to provide constructive feedback that is positive and motivating.

**RULES:**
1.  Start by praising the effort and highlighting something the child did well.
2.  Gently correct one or two grammatical mistakes, if any.
3.  Suggest 1-2 more interesting vocabulary words they could have used.
4.  Keep the feedback concise and use simple language with encouraging emojis. ✨🚀👍
5.  The output should be a single string.

**Task Instruction:** "${taskInstruction}"
**Child's Written Summary:** "${userSummary}"

**Your Evaluation:**
`;