const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai/suggest - Get AI suggestions for task optimization
router.post('/suggest', async (req, res) => {
  try {
    const { task, context = '' } = req.body;

    if (!task || !task.title) {
      return res.status(400).json({
        success: false,
        error: 'Task title is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured'
      });
    }

    const prompt = `
As a productivity expert, analyze this task and provide helpful suggestions:

Task Title: ${task.title}
Description: ${task.description || 'No description provided'}
Priority: ${task.priority || 'medium'}
Category: ${task.category || 'general'}
Due Date: ${task.dueDate || 'No due date set'}
Additional Context: ${context}

Please provide:
1. Task breakdown suggestions (if the task is complex)
2. Estimated time to complete
3. Priority recommendation
4. Potential challenges and solutions
5. Related tasks or dependencies to consider

Keep your response concise and actionable.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful productivity assistant that provides practical task management advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const suggestions = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        suggestions,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        success: false,
        error: 'OpenAI API quota exceeded'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        success: false,
        error: 'Invalid OpenAI API key'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to get AI suggestions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/ai/generate-tasks - Generate tasks from a description
router.post('/generate-tasks', async (req, res) => {
  try {
    const { description, projectContext = '' } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured'
      });
    }

    const prompt = `
Based on this project description, generate a list of specific, actionable tasks:

Project/Goal: ${description}
Context: ${projectContext}

Generate 5-8 tasks that would help accomplish this goal. For each task, provide:
- Title (concise, action-oriented)
- Brief description
- Estimated priority (low, medium, high, urgent)
- Category
- Estimated duration in minutes

Format your response as a JSON array of tasks with these properties:
[
  {
    "title": "Task title",
    "description": "Brief description",
    "priority": "medium",
    "category": "category",
    "estimatedDuration": 60
  }
]

Only respond with the JSON array, no additional text.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a project management expert who breaks down goals into actionable tasks. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.5,
    });

    let generatedTasks;
    try {
      generatedTasks = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      throw new Error('Failed to parse AI response as JSON');
    }

    res.json({
      success: true,
      data: {
        tasks: generatedTasks,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate tasks',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/ai/analyze-workload - Analyze task workload and provide recommendations
router.post('/analyze-workload', async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        error: 'Tasks array is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured'
      });
    }

    // Summarize tasks for AI analysis
    const taskSummary = tasks.map(task => ({
      title: task.title,
      priority: task.priority,
      status: task.status,
      estimatedDuration: task.estimatedDuration,
      dueDate: task.dueDate
    }));

    const prompt = `
Analyze this task workload and provide recommendations:

Tasks: ${JSON.stringify(taskSummary, null, 2)}

Please analyze:
1. Overall workload assessment
2. Priority distribution
3. Time management suggestions
4. Potential bottlenecks or overcommitments
5. Recommendations for task scheduling and organization

Provide a concise analysis with actionable recommendations.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a productivity consultant who analyzes workloads and provides optimization recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.6,
    });

    const analysis = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        analysis,
        taskCount: tasks.length,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to analyze workload',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;