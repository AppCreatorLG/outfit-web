import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { image } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Describe this clothing item in 2-4 words." },
          {
            type: "image_url",
            image_url: {
              url: image,
            },
          },
        ],
      },
    ],
  });
const generateNameFromImage = async (imageUrl) => {
  try {
    const res = await fetch("/api/name-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageUrl }),
    });

    const data = await res.json();

    if (data.name) {
      setName(data.name);
    }
  } catch (err) {
    console.error(err);
  }
};
  return Response.json({
    name: response.choices[0].message.content,
  });
}