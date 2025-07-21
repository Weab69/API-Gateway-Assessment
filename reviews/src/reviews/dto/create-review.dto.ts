import { IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  id?: string;

  @IsString()
  bookId: string;

  @IsString()
  userId: string;

  @IsString()
  comment: string;

  @IsNumber()
  rating: number;
}
