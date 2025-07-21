import { Controller } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  ALL_REVIEWS_PATTERN,
  BOOK_REVIEWS_PATTERN,
  CREATE_REVIEWS_PATTERN,
  DELETE_REVIEW_PATTERN,
  UNIQUE_REVIEW_PATTERN,
  UPDATE_REVIEW_PATTERN,
  USER_REVIEWS_PATTERN,
} from './reviews.constants';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @EventPattern(CREATE_REVIEWS_PATTERN)
  create(@Payload() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @MessagePattern(ALL_REVIEWS_PATTERN)
  findAll() {
    return this.reviewsService.findAll();
  }

  @MessagePattern(BOOK_REVIEWS_PATTERN)
  findBookReviews(@Payload() payload: { bookId: string }) {
    return this.reviewsService.findBookReviews(payload.bookId);
  }

  @MessagePattern(USER_REVIEWS_PATTERN)
  findUserReviews(@Payload() payload: { userId: string }) {
    return this.reviewsService.findUserReviews(payload.userId);
  }

  @MessagePattern(UNIQUE_REVIEW_PATTERN)
  findOne(@Payload() payload: { id: string }) {
    return this.reviewsService.findOne(payload.id);
  }

  @EventPattern(UPDATE_REVIEW_PATTERN)
  update(@Payload() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(updateReviewDto);
  }

  @EventPattern(DELETE_REVIEW_PATTERN)
  remove(@Payload() payload: { id: string }) {
    return this.reviewsService.remove(payload.id);
  }
}
