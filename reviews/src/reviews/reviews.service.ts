import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReviewsService {
  private logger = new Logger(ReviewsService.name);
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      const review = await this.databaseService.$transaction(async (tx) => {
        const [user, book] = await Promise.all([
          tx.user.findUnique({ where: { id: createReviewDto.userId } }),
          tx.book.findUnique({ where: { id: createReviewDto.bookId } }),
        ]);

        if (!user) {
          await tx.user.create({
            data: {
              id: createReviewDto.userId,
            },
          });
        }

        if (!book) {
          await tx.book.create({
            data: {
              id: createReviewDto.bookId,
            },
          });
        }

        const review = await tx.review.create({
          data: {
            comment: createReviewDto.comment,
            rating: createReviewDto.rating,
            bookId: createReviewDto.bookId,
            userId: createReviewDto.userId,
          },
        });

        return review;
      });

      return { message: `Created review successfully`, data: review };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAll() {
    try {
      const reviews = await this.databaseService.review.findMany();
      return reviews;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
    return `This action returns all reviews`;
  }

  async findBookReviews(bookId: string) {
    try {
      const reviews = await this.databaseService.review.findMany({
        where: {
          bookId,
        },
      });

      return reviews;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
    return `This action returns all reviews`;
  }

  async findUserReviews(userId: string) {
    try {
      const reviews = await this.databaseService.review.findMany({
        where: {
          userId,
        },
      });

      return reviews;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
    return `This action returns all reviews`;
  }

  async findOne(id: string) {
    try {
      const review = await this.databaseService.review.findMany({
        where: {
          id,
        },
      });

      if (!review) {
        throw new NotFoundException(`Review not found`);
      }

      return review;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.databaseService.review.findUnique({
        where: {
          id: updateReviewDto.id,
        },
      });

      if (!review) {
        throw new NotFoundException(`Review not found`);
      }

      const newReview = await this.databaseService.review.update({
        where: { id: updateReviewDto.id },
        data: { ...updateReviewDto },
      });

      return { message: `Updated your review successfully`, data: newReview };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const review = await this.databaseService.review.findMany({
        where: {
          id,
        },
      });

      if (!review) {
        throw new NotFoundException(`Review not found`);
      }

      await this.databaseService.review.delete({
        where: { id },
      });

      return { message: `Removed your review successfully`, data: review };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
