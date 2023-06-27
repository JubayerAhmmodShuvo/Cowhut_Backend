import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { ICow } from './cows.interface';
import CowModel from './cows.model';
import { IOptionsResult } from '../../../helpers/paginationHelper';

const createCow = async (cowData: ICow): Promise<ICow | null> => {
  try {
    const newCow = await CowModel.create(cowData);
    return newCow;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message);
      } else {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Failed to create cow'
        );
      }
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create cow'
      );
    }
  }
};

const getAllCows = async (options: IOptionsResult): Promise<ICow[]> => {
  try {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      location,
      searchTerm,
    } = options;

    const skip = (page - 1) * limit;

    const query = CowModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });

    if (minPrice > 0) {
      query.where('price').gte(minPrice);
    }

    if (maxPrice > 0) {
      query.where('price').lte(maxPrice);
    }

    if (location) {
      query.where('location').equals(location);
    }

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      query.or([
        { location: searchRegex },
        { breed: searchRegex },
        { category: searchRegex },
      ]);
    }

    const cows = await query.exec();
    return cows;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve cows'
    );
  }
};

const getCowById = async (id: string): Promise<ICow | null> => {
  try {
    const cow = await CowModel.findById(id);
    return cow;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to retrieve cow'
    );
  }
};

const updateCowById = async (
  id: string,
  cowData: ICow
): Promise<ICow | null> => {
  try {
    const cow = await CowModel.findByIdAndUpdate(id, cowData, { new: true });
    return cow;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update cow'
    );
  }
};

const deleteCowById = async (id: string,): Promise<ICow | null> => {
  try {
    const cow = await CowModel.findByIdAndDelete(id);
    return cow;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete cow'
    );
  }
};

export const CowService = {
  createCow,
  getAllCows,
  getCowById,
  updateCowById,
  deleteCowById,
};
