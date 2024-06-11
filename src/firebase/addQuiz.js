import { projectFirestore } from '../Config.js';

const addNewQuizz = async (uid, data) => {
  const quizData = {
    title: data.title,
    content: data.content,
    author: uid,
    tags: data.tags,
    answers: [],
    userScores: [] 
  };

  try {
    const quizRef = await projectFirestore.collection('Quizzes').add(quizData);
    const quizId = quizRef.id;

    const userRef = projectFirestore.collection('Users').doc(uid);
    const userData = await userRef.get();
    const currentQuizzes = userData.data().Quizzes || [];
    currentQuizzes.push(quizId);
    await userRef.update({ Quizzes: currentQuizzes });

    console.log('Quiz added successfully!');
  } catch (error) {
    console.error('Error adding quiz:', error);
  }
};

const appendAnswerToQuiz = async (quizId, uid, msg) => {
  const quizRef = projectFirestore.collection('Quizzes').doc(quizId);

  try {
    const quizDoc = await quizRef.get();
    if (!quizDoc.exists) {
      throw new Error('Quiz document does not exist.');
    }
    const currentAnswers = quizDoc.data().answers || [];
    currentAnswers.push({ message: msg, author: uid });
    await quizRef.update({ answers: currentAnswers });

    console.log('Answer appended successfully!');
  } catch (error) {
    console.error('Error appending answer:', error);
  }
};

const updateUserScore = async (quizId, uid, score) => {
  const quizRef = projectFirestore.collection('Quizzes').doc(quizId);

  try {
    const quizDoc = await quizRef.get();
    if (!quizDoc.exists) {
      throw new Error('Quiz document does not exist.');
    }
    const userScores = quizDoc.data().userScores || {};
    userScores[uid] = score; 
    await quizRef.update({ userScores });

    console.log('User score updated successfully!');
  } catch (error) {
    console.error('Error updating user score:', error);
  }
};

export { addNewQuizz, appendAnswerToQuiz, updateUserScore };
