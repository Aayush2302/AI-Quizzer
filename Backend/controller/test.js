const rawdata = `{
    "success": true,
    "data": "Here are the 10 quiz questions for 12th grade and Physics subject with EASY difficulty level:\n\n**Question 1**\n{\n  \"question\": \"What is the fundamental unit of energy?\",\n  \"options\": [\n    {\"option\": \"Joule (J)\", \"id\": 1},\n    {\"option\": \"Watt (W)\", \"id\": 2},\n    {\"option\": \"Newton-meter (N m)\", \"id\": 3},\n    {\"option\": \"Kelvin (K)\", \"id\": 4}\n  ],\n  \"answer\": 1\n}\n\n**Question 2**\n{\n  \"question\": \"Which scientist is credited with the discovery of X-rays?\",\n  \"options\": [\n    {\"option\": \"Albert Einstein\", \"id\": 1},\n    {\"option\": \"Isaac Newton\", \"id\": 2},\n    {\"option\": \"William Gilbert\", \"id\": 3},\n    {\"option\": \"Wilhelm Conrad Röntgen\", \"id\": 4}\n  ],\n  \"answer\": 4\n}\n\n**Question 3**\n{\n  \"question\": \"What is the process by which an object's velocity increases as it moves closer to a source of gravitational pull?\",\n  \"options\": [\n    {\"option\": \"Friction\", \"id\": 1},\n    {\"option\": \"Gravity\", \"id\": 2},\n    {\"option\": \"Elastic collision\", \"id\": 3},\n    {\"option\": \"Acceleration\", \"id\": 4}\n  ],\n  \"answer\": 4\n}\n\n**Question 4**\n{\n  \"question\": \"What is the term for the relationship between the force applied to an object and its resulting acceleration?\",\n  \"options\": [\n    {\"option\": \"Elastic potential energy\", \"id\": 1},\n    {\"option\": \"Viscosity\", \"id\": 2},\n    {\"option\": \"Force-acceleration\", \"id\": 3},\n    {\"option\": \"Newton's Second Law\", \"id\": 4}\n  ],\n  \"answer\": 4\n}\n\n**Question 5**\n{\n  \"question\": \"Which type of radiation has the shortest wavelength?\",\n  \"options\": [\n    {\"option\": \"Gamma rays\", \"id\": 1},\n    {\"option\": \"X-rays\", \"id\": 2},\n    {\"option\": \"Ultraviolet (UV) radiation\", \"id\": 3},\n    {\"option\": \"Radio waves\", \"id\": 4}\n  ],\n  \"answer\": 1\n}\n\n**Question 6**\n{\n  \"question\": \"What is the formula for calculating the kinetic energy of an object?\",\n  \"options\": [\n    {\"option\": \"KE = m × v\", \"id\": 1},\n    {\"option\": \"KE = m^2 × v^2\", \"id\": 2},\n    {\"option\": \"KE = m × v^2\", \"id\": 3},\n    {\"option\": \"KE = m^3 × v^3\", \"id\": 4}\n  ],\n  \"answer\": 3\n}\n\n**Question 7**\n{\n  \"question\": \"Which of the following is NOT a fundamental force of nature?\",\n  \"options\": [\n    {\"option\": \"Gravitational force\", \"id\": 1},\n    {\"option\": \"Electromagnetic force\", \"id\": 2},\n    {\"option\": \"Strong nuclear force\", \"id\": 3},\n    {\"option\": \"Friction force\", \"id\": 4}\n  ],\n  \"answer\": 4\n}\n\n**Question 8**\n{\n  \"question\": \"What is the term for the measure of how closely packed the particles are in a gas?\",\n  \"options\": [\n    {\"option\": \"Density\", \"id\": 1},\n    {\"option\": \"Pressure\", \"id\": 2},\n    {\"option\": \"Temperature\", \"id\": 3},\n    {\"option\": \"Compressibility\", \"id\": 4}\n  ],\n  \"answer\": 4\n}\n\n**Question 9**\n{\n  \"question\": \"Which of the following is an example of a simple harmonic motion?\",\n  \"options\": [\n    {\"option\": \"A car moving at a constant speed\", \"id\": 1},\n    {\"option\": \"A pendulum swinging back and forth\", \"id\": 2},\n    {\"option\": \"A satellite orbiting the Earth\", \"id\": 3},\n    {\"option\": \"A block sliding down a frictionless ramp\", \"id\": 4}\n  ],\n  \"answer\": 2\n}\n\n**Question 10**\n{\n  \"question\": \"What is the term for the amount of energy transferred from one body to another due to a temperature difference?\",\n  \"options\": [\n    {\"option\": \"Heat\", \"id\": 1},\n    {\"option\": \"Work\", \"id\": 2},\n    {\"option\": \"Energy\", \"id\": 3},\n    {\"option\": \"Power\", \"id\": 4}\n  ],\n  \"answer\": 1\n}\n\nThe maximum score for this quiz is 10 points."
}`;

const processData = (rawdata) => {
    const quizzes = [];
    const quizDataArray = rawdata.split('**Quiz');

    quizDataArray.forEach(quizData => {
      if (quizData.trim()) {
        const quizText = quizData.trim();
        const questionRegex = /"question": "(.*?)"/g;
        const optionRegex = /"option":"(.*?)","id":(\d+)/g;
        const answerRegex = /"answer": (\d+)/;

        const questionMatch = questionRegex.exec(quizText);
        const answerMatch = answerRegex.exec(quizText);

        if (questionMatch && answerMatch) {
          const question = questionMatch[1];
          const options = [];
          let optionMatch;
          while ((optionMatch = optionRegex.exec(quizText)) !== null) {
            options.push({ option: optionMatch[1], id: parseInt(optionMatch[2]) });
          }
          const answer = parseInt(answerMatch[1]);

          quizzes.push({ question, options, answer });
        }
      }
    });

    return quizzes; // Return the quizzes array after processing
};

const quizzes = processData(rawdata);
console.log(quizzes);
