const Roadmap = require('../models/Roadmap');
const axios = require('axios');

// create a roadmap

exports.createRoadmap = async (req,res)=>{

    const {skill} = req.body;

    try{
        const existingRoadmap = await Roadmap.findOne({skill});

        if(existingRoadmap){
            return res.status(200).json({
                existingRoadmap
            })
        }

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions',

            {
                model : "openai/gpt-oss-120b",
                messages : [{
                    role : 'user',
                    content : `Generate a detailed learning roadmap for the skill: ${skill}.

                                Requirements:

                                * Roadmap should be beginner-friendly.
                                * Assume the student is below average and needs more time to understand concepts.
                                * Break the roadmap into clear numbered steps.
                                * For each step include:

                                1. Step Number
                                2. Topic Name
                                3. Short Description
                                4. Estimated Time Required
                                5. Free YouTube Resource Link

                                Output format MUST be strictly in JSON format like this:

                                [
                                {
                                "stepNo": 1,
                                "topicName": "",
                                "description": "",
                                "estimatedTime": "",
                                "youtubeResource": ""
                                }
                                ]

                                Rules:

                                * Only include roadmap data.
                                * No introductions.
                                * No conclusions.
                                * No extra text.
                                * Use only free YouTube resources.
                                * Keep the roadmap practical and industry-relevant.
                                `
                }]
            }
            ,

            {
                headers : {
                    Authorization : `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type" : "application/json"
                }
            }

            
        )

        const roadmapText = response.data.choices[0].message.content;

        const newRoapmap = await Roadmap.create({
            skill,
            steps : JSON.parse(roadmapText)

        })

        res.status(200).json({
            message : "Roadmap created successfully",
            newRoapmap
        })


    }catch(err){
        res.status(500).json({
            message : err.message
        })
    }
}