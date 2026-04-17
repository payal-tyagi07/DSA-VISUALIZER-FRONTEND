import topics from './a2zTopics';

export const getAllAlgorithms = () => {
  const algorithms = [];
  for (const step of topics) {
    for (const subtopic of step.subtopics) {
      for (const problem of subtopic.problems) {
        algorithms.push({
          id: problem.id,
          name: problem.name,
          stepName: step.name,
          subtopicName: subtopic.name,
          visualizable: problem.visualizable,
        });
      }
    }
  }
  return algorithms;
};