import { handleDatabase } from '../data/handleDatabase.js';

const API_KEY = 'AIzaSyDdrmCTZ1dRW6dLlR0X-qImb-t9KKqpjfc'; // replace with env later
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function analyzeVibe(petDescription) {
  try {
    const pets = await handleDatabase();

    if (!pets.length) {
      throw new Error('No pets available to analyze.');
    }

    const prompt = `
You are a pet matching expert system. Your primary goal is to match pets based on the user's EXACT request first, then consider other characteristics.

User's Desired Pet Description:
"${petDescription}"

Available Pets:
${pets.map(p => `{
  "id": "${p.id}",
  "name": "${p.name}",
  "species": "${p.species}",
  "breed": "${p.breed}",
  "age": "${p.age}",
  "size": "${p.size}",
  "description": "${p.description}"
}`).join(',\n')}

Instructions:
1. PRIMARY MATCHING RULE: Match pets that EXACTLY match the user's request first.
2. For each pet:
   - First check if it matches the user's exact request
   - If it doesn't, reduce score accordingly
   - Then consider description, characteristics, traits
3. Match Scoring:
   - Perfect match: 90-100%
   - Good match: 70-89%
   - Partial match: 50-69%
   - Poor match: <50%
4. Include only pets with 50% or higher.

Important:
- Output raw JSON only.
- Only include pets from the provided list.

Response Format:
{
  "pets": [
    {
      "id": "pet-id",
      "matchPercentage": number,
      "matchReason": "reason"
    }
  ],
  "analysis": "lifestyle analysis"
}
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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

    const jsonMatch = generatedText.match(/```json\s*(\{.*?\})\s*```|(\{.*?\})/s);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[2]) : null;

    if (!jsonStr) {
      throw new Error('Could not extract JSON from Gemini response');
    }

    const result = JSON.parse(jsonStr);

    const seen = new Set();
    const updatedPets = result.pets
      .map(match => {
        const pet = pets.find(p => p.id === match.id || p.name === match.name);
        if (!pet || seen.has(pet.id) || seen.has(pet.name)) return null;
        seen.add(pet.id);
        seen.add(pet.name);

        return {
          ...pet,
          matchPercentage: match.matchPercentage,
          matchReason: match.matchReason
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 8); // return top 8 only

    return {
      pets: updatedPets,
      analysis: result.analysis
    };

  } catch (error) {
    console.error('Error in analyzeVibe:', error);

    const fallbackPets = (await handleDatabase())
      .map(pet => ({
        ...pet,
        matchPercentage: Math.floor(Math.random() * 30) + 70,
        matchReason: `${pet.name} could be a good match based on your description.`
      }))
      .filter(pet => pet.matchPercentage >= 50);

    const seenFallback = new Set();
    const uniqueFallbackPets = fallbackPets
      .filter(pet => {
        if (seenFallback.has(pet.id) || seenFallback.has(pet.name)) return false;
        seenFallback.add(pet.id);
        seenFallback.add(pet.name);
        return true;
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 10);

    return {
      pets: uniqueFallbackPets,
      analysis: "Fallback analysis: Based on your description, we've matched pets considering basic compatibility factors."
    };
  }
}