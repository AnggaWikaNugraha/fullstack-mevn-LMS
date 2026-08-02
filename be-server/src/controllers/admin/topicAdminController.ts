import { Response, NextFunction } from 'express';
import Topic from '../../models/Topic';
import Course from '../../models/Course';
import { AuthRequest } from '../../middlewares/authMiddleware';

// ─── Daftar semua topik ───────────────────────────────────────────────────────

export const listTopics = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const topics = await Topic.find().sort({ slug: 1 });
    res.status(200).json({ success: true, data: { topics } });
  } catch (err) {
    next(err);
  }
};

// ─── Buat topik baru ──────────────────────────────────────────────────────────

export const createTopic = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug, name } = req.body;

    if (!slug || !name) {
      res.status(400).json({ success: false, message: 'slug dan name wajib diisi.' });
      return;
    }

    // Validasi format slug: hanya huruf kecil, angka, dan tanda hubung
    if (!/^[a-z0-9-]+$/.test(slug)) {
      res.status(400).json({ success: false, message: 'slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung.' });
      return;
    }

    const existing = await Topic.findOne({ slug });
    if (existing) {
      res.status(409).json({ success: false, message: `Topik dengan slug "${slug}" sudah ada.` });
      return;
    }

    const topic = await Topic.create({ slug, name });
    res.status(201).json({ success: true, data: { topic } });
  } catch (err) {
    next(err);
  }
};

// ─── Update topik ─────────────────────────────────────────────────────────────

export const updateTopic = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { slug, name } = req.body;

    const topic = await Topic.findById(id);
    if (!topic) {
      res.status(404).json({ success: false, message: 'Topik tidak ditemukan.' });
      return;
    }

    // Jika slug diubah, pastikan tidak bentrok dengan topik lain
    if (slug && slug !== topic.slug) {
      if (!/^[a-z0-9-]+$/.test(slug)) {
        res.status(400).json({ success: false, message: 'slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung.' });
        return;
      }
      const conflict = await Topic.findOne({ slug, _id: { $ne: id } });
      if (conflict) {
        res.status(409).json({ success: false, message: `Topik dengan slug "${slug}" sudah ada.` });
        return;
      }

      // Sync topic_name di semua course yang memakai slug lama
      await Course.updateMany({ topic: topic.slug }, { topic: slug, ...(name ? { topic_name: name } : {}) });
    }

    if (slug) topic.slug = slug;
    if (name) topic.name = name;
    await topic.save();

    // Sync topic_name di semua course yang memakai slug ini
    await Course.updateMany({ topic: topic.slug }, { topic_name: topic.name });

    res.status(200).json({ success: true, data: { topic } });
  } catch (err) {
    next(err);
  }
};

// ─── Hapus topik ──────────────────────────────────────────────────────────────
// Diblokir jika masih ada course yang menggunakan topik ini

export const deleteTopic = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const topic = await Topic.findById(id);
    if (!topic) {
      res.status(404).json({ success: false, message: 'Topik tidak ditemukan.' });
      return;
    }

    const courseCount = await Course.countDocuments({ topic: topic.slug });
    if (courseCount > 0) {
      res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus topik "${topic.name}" karena masih digunakan oleh ${courseCount} kursus.`,
      });
      return;
    }

    await Topic.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Topik berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};
