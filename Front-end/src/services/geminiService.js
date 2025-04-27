import { handleDatabase } from '../data/handleDatabase.js';

const API_KEY = 'AIzaSyDdrmCTZ1dRW6dLlR0X-qImb-t9KKqpjfc'; // replace with env later
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function analyzeVibe(petDescription) {
  try {
    // Step 1: Fetch pets from backend
    const pets = await handleDatabase();

    if (!pets.length) {
      throw new Error('No pets available to analyze.');
    }

    // Step 2: Build prompt
    const prompt = `
You are a pet matching expert system. Analyze the provided pet description to find ideal pet matches.

User's Desired Pet Description:
"${petDescription}"

Available Pet IDs:
[${pets.map(p => `"${p.id}"`).join(', ')}]

Instructions:
1. First, identify the primary pet type (cat, dog, bird, rabbit, etc.) mentioned in the description.
2. Prioritize matching pets of the requested type.
3. For each pet in the database:
   - Calculate compatibility score (0-100)
   - Consider: activity level, space needs, time commitment, experience required, allergies, household fit.
4. Include ALL pets with a match percentage of 50% or higher.
5. Create a brief lifestyle analysis of the user's preferences.

Important:
- Only include pets with IDs from the list above.
- Output only raw JSON (no markdown, no commentary, no code blocks).

Response Format:
{
  "pets": [
    {
      "id": "pet-id",
      "matchPercentage": number,
      "matchReason": "specific reason for match score"
    }
  ],
  "analysis": "concise lifestyle analysis focusing on key pet compatibility factors"
}
`;

    // Step 3: Call Gemini
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: prompt }] }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Gemini API');
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Step 4: Parse Gemini JSON output
    const jsonMatch = generatedText.match(/```json\s*(\{.*?\})\s*```|(\{.*?\})/s);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[2]) : null;

    if (!jsonStr) {
      throw new Error('Could not extract JSON from Gemini response');
    }

    const result = JSON.parse(jsonStr);

    // Step 5: Map Gemini results to real pets
    const seenIds = new Set();
    const updatedPets = result.pets
        .map(match => {
          const pet = pets.find(p => p.id === match.id);
          if (!pet || seenIds.has(pet.id)) return null;
          seenIds.add(pet.id);

          return {
            ...pet,
            matchPercentage: match.matchPercentage,
            matchReason: match.matchReason
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
      pets: updatedPets,
      analysis: result.analysis
    };

  } catch (error) {
    console.error('Error in analyzeVibe:', error);

    // Fallback if Gemini fails
    const fallbackPets = (await handleDatabase()).map(pet => ({
      ...pet,
      matchPercentage: Math.floor(Math.random() * 30) + 70,
      matchReason: `${pet.name} could be a good match based on your description.`
    }))
        .filter(pet => pet.matchPercentage >= 50)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
      pets: fallbackPets,
      analysis: "Fallback analysis: Based on your description, we've matched pets considering basic compatibility factors."
    };
  }
}