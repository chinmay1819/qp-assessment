import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GroceryService } from './grocery.service';
import { AuthService } from 'src/auth/auth.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { Responses } from 'src/shared/const/responses';
import { StatusCodes } from 'src/shared/const/status-codes';
import { CustomMessages } from 'src/shared/const/custom-messages';
import { UpdateGroceryDto } from './dto/update-grocery.dto';
import { BookItemsDto } from './dto/book-items.dto';

@ApiBearerAuth()
@ApiTags('Grocery')
@ApiSecurity('authorization')
@UseGuards(RolesGuard)
@Controller('grocery')
export class GroceryController {
  constructor(
    private readonly groceryService: GroceryService,
    private readonly authService: AuthService,
  ) {}

  // API to Add item in the Grocery Repository -> only permitted to admin
  @Post('additem')
  async createG(
    @Body() createGroceryDto: CreateGroceryDto,
    @Req() req: Request,
  ): Promise<any> {
    try {
      if (this.authService.isUser(req)) {
        return new Responses(
          StatusCodes.UNAUTHORIZED,
          null,
          CustomMessages.UNAUTHORIZED,
          false,
        );
      }
      const data = await this.groceryService.create(createGroceryDto);
      return new Responses(
        StatusCodes.CREATED,
        data,
        CustomMessages.CREATED,
        true,
      );
    } catch (error) {
      return new Responses(
        StatusCodes.INTERNAL_SERVER_ERROR,
        null,
        error.message,
        false,
      );
    }
  }

  // API to retrieve all items in the grocery repository
  @Get('all-items')
  async findAllItems(@Req() req: Request): Promise<any> {
    try {
      if (this.authService.isUser(req)) {
        return new Responses(
          StatusCodes.UNAUTHORIZED,
          null,
          CustomMessages.UNAUTHORIZED,
          false,
        );
      }
      const data = await this.groceryService.findAll();
      return new Responses(StatusCodes.OK, data, CustomMessages.ACCEPTED, true);
    } catch (error) {
      return new Responses(
        StatusCodes.INTERNAL_SERVER_ERROR,
        null,
        error.message,
        false,
      );
    }
  }

  // API to remove grocery items from grocery repository
  @Delete('remove-item/:id')
  async removeGroceryItem(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<any> {
    try {
      if (this.authService.isUser(req)) {
        return new Responses(
          StatusCodes.UNAUTHORIZED,
          null,
          CustomMessages.UNAUTHORIZED,
          false,
        );
      }
      const data = await this.groceryService.deleteGroceryItem(id);
      return new Responses(StatusCodes.OK, data, CustomMessages.DELETED, true);
    } catch (error) {
      return new Responses(
        StatusCodes.INTERNAL_SERVER_ERROR,
        null,
        error.message,
        false,
      );
    }
  }

  // API to update details of existing item
  @Put('update-item/:id')
  async updateGroceryItem(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateGroceryDto: UpdateGroceryDto,
  ): Promise<any> {
    try {
      if (this.authService.isUser(req)) {
        return new Responses(
          StatusCodes.UNAUTHORIZED,
          null,
          CustomMessages.UNAUTHORIZED,
          false,
        );
      }
      const data = await this.groceryService.updateGroceryItem(
        id,
        updateGroceryDto,
      );
      return new Responses(StatusCodes.OK, data, CustomMessages.UPDATED, true);
    } catch (error) {
      return new Responses(
        StatusCodes.INTERNAL_SERVER_ERROR,
        null,
        error.message,
        false,
      );
    }
  }

  // API to retrieve available items in the grocery inventory
  @Get('available-items')
  async listAvailableItems(): Promise<any> {
    try {
      const data = await this.groceryService.findAvailableItems();
      return new Responses(StatusCodes.OK, data, CustomMessages.SUCCESS, true);
    } catch (error) {
      return new Responses(
        StatusCodes.INTERNAL_SERVER_ERROR,
        null,
        error.message,
        false,
      );
    }
  }

  // API to book items
  @Post('book-items')
  async bookGroceryItem(@Body() bookItemsDto: BookItemsDto): Promise<any> {
    try {
      const data = await this.groceryService.bookItems(bookItemsDto);
      return new Responses(
        StatusCodes.OK,
        data,
        CustomMessages.ORDER_BOOK_DONE,
        true,
      );
    } catch (error) {
      return new Responses(
        StatusCodes.INTERNAL_SERVER_ERROR,
        null,
        error.message,
        false,
      );
    }
  }
}
