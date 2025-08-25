require('dotenv').config()
const { Configuration, OpenAIApi } = require('openai')

const prompt = process.argv[2]

if (!prompt || prompt.length < 10) {
  console.log('ERROR: El prompt es muy corto o vacío.')
  process.exit(1)
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

async function runAI() {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'Eres un programador experto en buenas prácticas y lógica avanzada. Genera código limpio, eficiente y bien documentado según el prompt.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.2,
    })

    const aiResponse = response.data.choices[0].message.content
    console.log('--- RESPUESTA DE LA IA ---')
    console.log(aiResponse)
    // Opcional: guardar la respuesta en un archivo
    // require('fs').writeFileSync('ai_output.txt', aiResponse);
  } catch (err) {
    console.error('Error al llamar a OpenAI:', err.message)
    process.exit(1)
  }
}

runAI()
