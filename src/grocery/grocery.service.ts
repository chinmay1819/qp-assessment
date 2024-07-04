import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroceryItem } from './grocery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';
import { BookItemsDto } from './dto/book-items.dto';

@Injectable()
export class GroceryService {
  constructor(
    @InjectRepository(GroceryItem)
    private groceryItemsRepository: Repository<GroceryItem>,
  ) {}

  async create(createGroceryDto: CreateGroceryDto): Promise<GroceryItem> {
    const groceryItem = this.groceryItemsRepository.create(createGroceryDto);
    return this.groceryItemsRepository.save(groceryItem);
  }

  async findAll(): Promise<GroceryItem[]> {
    return this.groceryItemsRepository.find();
  }

  async deleteGroceryItem(itemId: string): Promise<string> {
    const groceryItem = await this.groceryItemsRepository.findOne({
      where: { itemId },
    });
    if (!groceryItem) {
      throw new NotFoundException('Item does not exist');
    }
    await this.groceryItemsRepository.delete({ itemId });
    return `Item with id ${itemId} has been deleted`;
  }

  async updateGroceryItem(
    itemId: string,
    updateGroceryDto: UpdateGroceryDto,
  ): Promise<GroceryItem> {
    const groceryItem = await this.groceryItemsRepository.findOne({
      where: { itemId },
    });
    if (!groceryItem) {
      throw new NotFoundException('Item does not exist');
    }
    Object.assign(groceryItem, updateGroceryDto);
    await this.groceryItemsRepository.update(itemId, updateGroceryDto);
    return groceryItem;
  }

  async findAvailableItems(): Promise<GroceryItem[]> {
    const groceryItemsList = await this.groceryItemsRepository.find({
      where: { quantity: MoreThan(0) },
    });
    return groceryItemsList;
  }

  async bookItems(bookItemsDto: BookItemsDto): Promise<GroceryItem[]> {
    const bookedItems = [];
    for (const item of bookItemsDto.items) {
      const groceryItem = await this.groceryItemsRepository.findOne({
        where: { itemId: item.itemId },
      });
      if (!groceryItem) {
        throw new NotFoundException(
          `Item with id ${item.itemId} does not exist`,
        );
      }
      if (groceryItem.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient quantity for item with id ${item.itemId}`,
        );
      }
      groceryItem.quantity -= item.quantity;
      await this.groceryItemsRepository.save(groceryItem);
      bookedItems.push(groceryItem);
    }
    return bookedItems;
  }
}
