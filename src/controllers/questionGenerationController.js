const Questions = require('../models/Questions');
const GroqAI = require('groq-sdk');

const groq = new GroqAI(
  process.env.GROQ_API_KEY
);

exports.generateQuestions = async (req,res) => {

    const {topic, subtopic, numberOfQuestions, difficulty} = req.body;

    const existingQuestions = await Questions.findOne({topic, subtopic, difficulty});

    if(existingQuestions && existingQuestions.questions.length >= numberOfQuestions){
        return res.status(200).json({
            message : "Questions fetched successfully from database",
            questions : existingQuestions.questions.slice(0,numberOfQuestions)
        })
    }

     const prompt = `
        Generate ${numberOfQuestions} ${difficulty} level questions on ${topic}.

        Return ONLY valid JSON.

        Format:

         questions : [
        {
            questionNo : "",
            question : "",
            userAnswer : "",
            AIanswer : "Detailed and simple words answers thats we should say in interview",
            difficulty : "Also tell difficulty level of the question like easy, medium or hard according to the question and as per user which is by default a begineer ",
        }
    ]
        
        `;

    try{
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages:[ 
                {
                    role: "system",
                    content: `Your name is PREPPILOT, an AI assistant designed to help users prepare for interviews by generating practice questions, which users can practice and dont make questions too hard as it is just for practice and Always return valid JSON only.`
                },

                {
                    role: "user",
                    content: prompt
                },

            ],

            temperature : 0.8

        });

        const questionsData = JSON.parse(response.choices[0].message.content);

        
        // storing in database

        const newQuestions = await Questions.create({
            topic,
            subtopic,
            numberOfQuestions,
            difficulty,
            questions : questionsData.questions
        })
        

        res.status(201).json({
            message : "Questions generated successfully",
            questions : newQuestions
        })

        
    } catch(err){
        res.status(500).json({
            message : err.message || "Something went wrong while generating questions"
        })
    }
}