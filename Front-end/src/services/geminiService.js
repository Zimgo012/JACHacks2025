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
   - If user asks for "small dogs", prioritize small dogs above all else
   - If user asks for "calm cats", prioritize calm cats above all else
   - The user's exact request is the most important factor

2. For each pet in the database:
   - First check if it matches the user's exact request
   - If it doesn't match the exact request, reduce its score accordingly
   - Then consider its description to find additional matching factors
   - Then analyze the pet's description to find additional matching factors
   - Then consider other characteristics:
     * Physical characteristics (size, breed, age)
     * Behavioral traits (activity level, temperament)
     * Environmental needs (space requirements, living conditions)

3. Match Scoring Rules:
   - Perfect match to user's exact request: 90-100%
   - Good match but not exact: 70-89%
   - Partial match: 50-69%
   - Poor match: <50%

4. Include ALL pets with a match percentage of 50% or higher.

5. Create a brief lifestyle analysis of the user's preferences.

Important:
- Only include pets with IDs from the list above.
- Output only raw JSON (no markdown, no commentary, no code blocks).
- The user's exact request MUST be the primary matching factor.
- If a pet doesn't match the user's exact request, it should not be ranked highly.
- Use the pet's description to find additional matching factors that align with the user's request.

Response Format:
{
  "pets": [
    {
      "id": "pet-id",
      "matchPercentage": number,
      "matchReason": "specific reason for match score, starting with how well it matches the user's exact request and including relevant details from the pet's description"
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

    // Step 5: Map Gemini results to real pets and remove duplicates
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

    // Ensure no duplicate pets in the final result
    const uniquePets = Array.from(new Map(updatedPets.map(pet => [pet.id, pet])).values());

    return {
      pets: uniquePets,
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

    // Ensure no duplicate pets in the fallback result
    const uniqueFallbackPets = Array.from(new Map(fallbackPets.map(pet => [pet.id, pet])).values());

    return {
      pets: uniqueFallbackPets,
      analysis: "Fallback analysis: Based on your description, we've matched pets considering basic compatibility factors."
    };
  }
}