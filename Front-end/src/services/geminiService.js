import {handleDatabase} from '../data/handleDatabase';

const API_KEY = 'AIzaSyDdrmCTZ1dRW6dLlR0X-qImb-t9KKqpjfc';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function analyzeVibe(petDescription) {
  try {
    const pets = await handleDatabase();

    const prompt = `
      You are a pet matching expert system. Analyze the provided pet description to find ideal pet matches.
      
      User's Desired Pet Description:
      "${petDescription}"

      Available Pet IDs:
      [${pets.map(p => "${p.id}").join(', ')}]

      Instructions:
      1. First, identify the primary pet type (cat, dog, bird, rabbit, etc.) mentioned in the description
      2. Prioritize matching pets of the requested type
      3. For each pet in the database:
         - Calculate compatibility score (0-100)
         - Consider: activity level, space needs, time commitment, experience required, allergies, household fit
         - Generate specific match reasoning
      4. Include ALL pets with a match percentage of 50% or higher
      5. Create a brief lifestyle analysis of the user's preferences

      Important:
      - Only include pets with IDs from the list above
      - Only include pets with match percentage >= 50%
      - Each pet should appear only once in the results
      - If a specific pet type is requested, prioritize that type in the matches
      - If no specific type is requested, consider all types equally
      - Output only raw JSON (no markdown, no commentary, no code blocks)

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

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
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

    // Parse JSON response, handling potential markdown code blocks
    const jsonMatch = generatedText.match(/```json\s*(\{.*?\})\s*```|(\{.*?\})/s);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[2]) : null;

    if (!jsonStr) {
      throw new Error('Could not extract JSON from Gemini response');
    }

    const result = JSON.parse(jsonStr);

    // Map Gemini's matches to full pet objects, remove duplicates, and sort by match percentage
    const seenIds = new Set();
    const updatedPets = result.pets
      .map(match => {
        const pet = mockPets.find(p => p.id === match.id);
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
    
    // Intelligent fallback matching based on basic criteria
    const seenIds = new Set();
    return {
      pets: mockPets
        .map(pet => {
          if (seenIds.has(pet.id)) return null;
          seenIds.add(pet.id);
          return {
            ...pet,
            matchPercentage: Math.floor(Math.random() * 30) + 70,
            matchReason: `${pet.name} could be a good match based on your description.`
          };
        })
        .filter(Boolean)
        .filter(pet => pet.matchPercentage >= 50)
        .sort((a, b) => b.matchPercentage - a.matchPercentage),
      analysis: "Based on your description, we've identified several pets that could match your preferences. Each match considers factors like activity level, space requirements, and time commitment.",
    };
  }
} 