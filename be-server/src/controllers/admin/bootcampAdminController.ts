import { Response, NextFunction } from 'express';
import BootcampPackage from '../../models/BootcampPackage';
import BootcampBatch from '../../models/BootcampBatch';
import BootcampSession from '../../models/BootcampSession';
import User from '../../models/User';
import { AuthRequest } from '../../middlewares/authMiddleware';

// ─── List semua user berperan mentor (untuk dropdown form) ────────────────────

export const listMentors = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('_id name avatar_url').sort({ name: 1 });
    res.json({ success: true, data: { mentors } });
  } catch (err) {
    next(err);
  }
};

// ─── List semua package ───────────────────────────────────────────────────────

export const listPackages = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const packages = await BootcampPackage.find()
      .populate('mentors.userId', 'name avatar_url')
      .sort({ createdAt: -1 });

    const result = await Promise.all(
      packages.map(async (pkg) => {
        const batchCount = await BootcampBatch.countDocuments({ packageId: pkg._id });
        return { ...pkg.toObject(), batch_count: batchCount };
      })
    );

    res.json({ success: true, data: { packages: result } });
  } catch (err) {
    next(err);
  }
};

// ─── Detail package + batches + sessions ─────────────────────────────────────

export const getPackageDetail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const pkg = await BootcampPackage.findById(id)
      .populate('mentors.userId', 'name avatar_url');
    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found.' });
      return;
    }

    const batches = await BootcampBatch.find({ packageId: id }).sort({ createdAt: 1 });
    const batchIds = batches.map((b) => b._id);
    const sessions = await BootcampSession.find({ batchId: { $in: batchIds } }).sort({ session_date: 1 });

    const batchesWithSessions = batches.map((batch) => ({
      ...batch.toObject(),
      sessions: sessions.filter((s) => s.batchId.toString() === batch._id.toString()),
    }));

    res.json({ success: true, data: { package: { ...pkg.toObject(), batches: batchesWithSessions } } });
  } catch (err) {
    next(err);
  }
};

// ─── Buat package ─────────────────────────────────────────────────────────────

export const createPackage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, image_url, status, mentors } = req.body;
    const pkg = await BootcampPackage.create({
      title,
      description,
      image_url: image_url ?? '',
      status: status ?? 'coming_soon',
      mentors: mentors ?? [],
    });
    res.status(201).json({ success: true, data: { package: pkg } });
  } catch (err) {
    next(err);
  }
};

// ─── Update package ───────────────────────────────────────────────────────────

export const updatePackage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const pkg = await BootcampPackage.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .populate('mentors.userId', 'name avatar_url');
    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found.' });
      return;
    }
    res.json({ success: true, data: { package: pkg } });
  } catch (err) {
    next(err);
  }
};

// ─── Hapus package + cascade batch + session ─────────────────────────────────

export const deletePackage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const pkg = await BootcampPackage.findById(id);
    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found.' });
      return;
    }

    const batches = await BootcampBatch.find({ packageId: id }).select('_id');
    const batchIds = batches.map((b) => b._id);

    await Promise.all([
      BootcampSession.deleteMany({ batchId: { $in: batchIds } }),
      BootcampBatch.deleteMany({ packageId: id }),
      BootcampPackage.findByIdAndDelete(id),
    ]);

    res.json({ success: true, message: 'Package deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── Batch ────────────────────────────────────────────────────────────────────

export const createBatch = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: packageId } = req.params;
    const pkg = await BootcampPackage.findById(packageId);
    if (!pkg) {
      res.status(404).json({ success: false, message: 'Package not found.' });
      return;
    }

    const {
      title, sub_title, description,
      started_at, ended_at,
      quota_used_percentage, price, strikethrough_price, package_type,
    } = req.body;

    const batch = await BootcampBatch.create({
      packageId,
      title,
      sub_title: sub_title ?? '',
      description: description ?? '',
      started_at,
      ended_at,
      quota_used_percentage: quota_used_percentage ?? 0,
      price,
      strikethrough_price: strikethrough_price ?? 0,
      package_type: package_type ?? 'online',
    });

    res.status(201).json({ success: true, data: { batch } });
  } catch (err) {
    next(err);
  }
};

export const updateBatch = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const batch = await BootcampBatch.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!batch) {
      res.status(404).json({ success: false, message: 'Batch not found.' });
      return;
    }
    res.json({ success: true, data: { batch } });
  } catch (err) {
    next(err);
  }
};

export const deleteBatch = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await Promise.all([
      BootcampSession.deleteMany({ batchId: id }),
      BootcampBatch.findByIdAndDelete(id),
    ]);
    res.json({ success: true, message: 'Batch deleted.' });
  } catch (err) {
    next(err);
  }
};

// ─── Session ──────────────────────────────────────────────────────────────────

export const createSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: batchId } = req.params;
    const batch = await BootcampBatch.findById(batchId);
    if (!batch) {
      res.status(404).json({ success: false, message: 'Batch not found.' });
      return;
    }

    const { title, session_name, session_date, session_start_time, session_end_time } = req.body;
    const session = await BootcampSession.create({
      batchId,
      title,
      session_name,
      session_date,
      session_start_time,
      session_end_time,
    });

    res.status(201).json({ success: true, data: { session } });
  } catch (err) {
    next(err);
  }
};

export const updateSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const session = await BootcampSession.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!session) {
      res.status(404).json({ success: false, message: 'Session not found.' });
      return;
    }
    res.json({ success: true, data: { session } });
  } catch (err) {
    next(err);
  }
};

export const deleteSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await BootcampSession.findByIdAndDelete(id);
    res.json({ success: true, message: 'Session deleted.' });
  } catch (err) {
    next(err);
  }
};
