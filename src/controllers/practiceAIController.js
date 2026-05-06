const Practice = require('../models/Practice');
const Question = require('../models/Question');
const axios = require('axios');

exports.practiceAI = async (req, res) => {
    
    const {topic,subtopic, numberOfQuestions, difficulty,timeTaken,answer} = req.body;

    const questions = [];


    try{
        // generating questions using chatGPT AI MODEL

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions',{
            model : "openai/gpt-oss-120b",
            messages :[{
                role : 'user',
                content : `Generate exactly ${numberOfQuestions}  subjective questions with answers for the topic "${topic}" and subtopic "${subtopic}".

                            Difficulty Level: ${difficulty}

                            Return ONLY valid raw JSON in the exact structure below.
                            Do not add markdown, explanations, headings, notes, or extra text.

                            Rules:
                            - Questions must be interview-oriented and subjective.
                            - Questions must be answerable in voice format.
                            - Do NOT generate MCQs or options.
                            - Generate realistic and non-repetitive interview questions.
                            - AIanswer must contain a proper detailed interview-level answer for the question.
                            - userAnswer must remain an empty string.
             
                            - questionNo must start from 1.

                            Output format:

                            {
                            "topic": "${topic}",
                            "subtopic": "${subtopic}",
                            "questions": [
                                {
                                "questionNo": 1,
                                "question": "Question here",
                                "userAnswer": "",
                                "AIanswer": "Detailed answer here",
                                "difficulty": "${difficulty}"
                                
                                }
                            ]
                            } `
            }]
        },

        {
            headers : {
                Authorization : `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type' : 'application/json'
            }
        }
    
        )

        const questionsText = response.data.choices[0].message.content;

        // Saving questions in database

        const newQuestion = await Question.create({
            topic,
            subtopic,
            questions : JSON.parse(questionsText).questions
        })

        questions.push(...JSON.parse(questionsText).questions);

        
        



        res.status(200).json({
            message : "Questions generated successfully",
            newQuestion
            
        })
            
        


    }catch(err){
        return res.status(500).json({
            message : err.message
        })
    }
}