import { IsArray, IsUUID, IsInt, Min } from 'class-validator';

export class BookItemDto {
  @IsUUID()
  itemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class BookItemsDto {
  @IsArray()
  items: BookItemDto[];
}
