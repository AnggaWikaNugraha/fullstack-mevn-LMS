import { Request, Response } from 'express';
import QuizQuestion from '../../models/QuizQuestion';

export const getQuizQuestions = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const questions = await QuizQuestion.find({ lessonId }).sort({ order: 1 });
    res.json({ success: true, data: { questions } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const { question, options, correct_index } = req.body;
    const count = await QuizQuestion.countDocuments({ lessonId });
    const q = await QuizQuestion.create({ lessonId, question, options, correct_index, order: count + 1 });
    res.status(201).json({ success: true, data: { question: q } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const q = await QuizQuestion.findByIdAndUpdate(questionId, req.body, { new: true });
    if (!q) { res.status(404).json({ success: false, message: 'Question not found' }); return; }
    res.json({ success: true, data: { question: q } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    await QuizQuestion.findByIdAndDelete(questionId);
    res.json({ success: true, message: 'Question deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
