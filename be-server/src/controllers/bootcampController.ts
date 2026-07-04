import { Request, Response, NextFunction } from 'express';
import BootcampPackage from '../models/BootcampPackage';
import BootcampBatch from '../models/BootcampBatch';
import BootcampSession from '../models/BootcampSession';

// ─── Daftar Bootcamp ──────────────────────────────────────────────────────────

export const getBootcamps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '9', status, search } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.max(1, parseInt(limit as string));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const [bootcamps, total] = await Promise.all([
      BootcampPackage.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      BootcampPackage.countDocuments(filter),
    ]);

    // Ambil batch terendah per package untuk tampil harga di card
    const packageIds = bootcamps.map((b) => b._id);
    const batches = await BootcampBatch.find({ packageId: { $in: packageIds } }).sort({ price: 1 });

    // Map harga terendah dari batch open per package
    const lowestPriceMap = new Map<string, number>();
    for (const batch of batches) {
      const pkgId = batch.packageId.toString();
      if (!lowestPriceMap.has(pkgId)) {
        lowestPriceMap.set(pkgId, batch.price);
      }
    }

    const bootcampsWithPrice = bootcamps.map((b) => ({
      ...b.toJSON(),
      starting_price: lowestPriceMap.get(b._id.toString()) ?? 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        bootcamps: bootcampsWithPrice,
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

// ─── Detail Bootcamp ──────────────────────────────────────────────────────────
// Mengembalikan package + semua batch beserta sesinya dalam satu response.
// Switching antar batch dilakukan client-side tanpa refetch.

export const getBootcampDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const bootcamp = await BootcampPackage.findById(id);
    if (!bootcamp) {
      res.status(404).json({ success: false, message: 'Bootcamp not found.' });
      return;
    }

    // Ambil semua batch untuk package ini
    const batches = await BootcampBatch.find({ packageId: id }).sort({ started_at: 1 });
    const batchIds = batches.map((b) => b._id);

    // Ambil semua sesi sekaligus pakai $in — 1 query untuk semua batch
    const sessions = await BootcampSession.find({ batchId: { $in: batchIds } }).sort({ session_date: 1 });

    // Pasangkan sesi ke batch masing-masing
    const batchesWithSessions = batches.map((batch) => ({
      ...batch.toJSON(),
      sessions: sessions.filter((s) => s.batchId.toString() === batch._id.toString()),
    }));

    res.status(200).json({
      success: true,
      data: {
        bootcamp: {
          ...bootcamp.toJSON(),
          batches: batchesWithSessions,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
