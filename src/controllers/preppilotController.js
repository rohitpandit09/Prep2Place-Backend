const Questions = require('../models/Questions');
const GroqAI = require('groq-sdk');
const {DeepgramCilent} = require('@deepgram/sdk');
const WebSocket = require('ws')
const { createClient } = require("@deepgram/sdk");

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
        const AIanswer = questionsData.questions.map(q=>q.AIanswer).join(" ");

        
        // storing in database

        const newQuestions = await Questions.create({
            topic,
            subtopic,
            numberOfQuestions,
            difficulty,
            questions : questionsData.questions,
            AIanswer : AIanswer

        })
        

        res.status(201).json({
            message : "Questions generated successfully",
            questions : newQuestions.questions
        })

        
    } catch(err){
        res.status(500).json({
            message : err.message || "Something went wrong while generating questions"
        })
    }
}

exports.answerByUser = async (req,res)=>{
    
    try{

        const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);
        
        // Websocket server

        const wss = new WebSocket.Server({ port: 8080 });

        console.log("WebSocket server started on port 8080");

        // Frontend connection

        wss.on('connection',(cilentSocket)=>{

            console.log("Client connected");

            // deepgram connection

            const dgConnection = deepgramClient.listen.live({
                model : "nova-3",
                smart_format : true,
                punctuate : true,
                interim_results : true
            });

            // deepgram connected

            dgConnection.on('open',()=>{
                console.log("Connected to deepgram");

                // Audio taking from frontend

                cilentSocket.on('message',(audioData)=>{
                    if(dgConnection.getReadyState()===1){
                        dg.Connection.send(audioData);
                    }
                });

                // transcript received from deepgram

                dgConnection.on(
                    "transcript",
                    (data) => {

                        const transcript =
                            data.channel
                            .alternatives[0]
                            .transcript;

                        console.log(transcript);


                        // Send transcript back
                        clientSocket.send(
                            JSON.stringify({
                                transcript,
                            })
                        );
                    }
                );

                // Disconnect
                clientSocket.on("close", () => {

                    console.log(
                        "Frontend disconnected"
                    );

                    dgConnection.finish();
                });
            })

        })

    
    }

    catch(err){
        res.status(500).json({
            message : err.message || "Something went wrong while processing your answer"
        })
    }
}