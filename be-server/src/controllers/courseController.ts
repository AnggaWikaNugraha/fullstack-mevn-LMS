import { Request, Response, NextFunction } from 'express';
import Course from '../models/Course';

// ─── Get Course List ──────────────────────────────────────────────────────────

export const getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { topic, page = '1', limit = '10' } = req.query;

    const filter: Record<string, unknown> = {};
    if (topic) filter.topic = topic;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, parseInt(limit as string));
    const skip = (pageNum - 1) * limitNum;

    const [courses, total] = await Promise.all([
      Course.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Course.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Topics ───────────────────────────────────────────────────────────────
// Topics are not a separate collection — aggregated from distinct topic + topic_name in Course

export const getTopics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const topics = await Course.aggregate([
      {
        $group: {
          _id: '$topic',
          topic_name: { $first: '$topic_name' },
        },
      },
      {
        $project: {
          _id: 0,
          topic: '$_id',
          topic_name: 1,
        },
      },
      { $sort: { topic: 1 } },
    ]);

    res.status(200).json({ success: true, data: { topics } });
  } catch (err) {
    next(err);
  }
};
