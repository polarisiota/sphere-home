import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { logger } from 'src/helper/logger.helper';
import { getReturnableInvoice } from 'src/helper/translate.helper';

@UseGuards(JwtGuard)
@Controller('invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() dto: CreateInvoiceDto, @GetUser() user: User) {
    try {
      const invoice = await this.invoiceService.create(dto, user);
      return {
        statusCode: 201,
        status: 'success',
        data: getReturnableInvoice(invoice),
        message: null,
      };
    } catch (e) {
      logger.error(`create invoice: ${e}`);
      return {
        statuscode: 400,
        status: 'error',
        data: null,
        message: e.message,
      };
    }
  }

  @Get(':id')
  async retrieve(@Param('id') id: string) {
    // TODO catch exception
    const invoiceId = parseInt(id);

    const invoice = await this.invoiceService.retrieve(invoiceId);

    // TODO response type
    return invoice;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @GetUser() user: User,
  ) {
    const invoiceId = parseInt(id);

    const invoice = await this.invoiceService.retrieve(invoiceId);

    if (invoice == null) {
      throw new Error('Invoice not found');
    }

    if (invoice.receiverId !== user.id) {
      throw new Error('Not authorized');
    }
    const updatedInvoice = await this.invoiceService.update(dto);

    // TODo response type
    return invoice;
  }

  @Post(':id')
  async checkout(@Param('id') id: string, @GetUser() user: User) {
    const invoiceId = parseInt(id);

    const invoice = await this.invoiceService.retrieve(invoiceId);
    // TODO error case when invoice null

    if (invoice.payerId !== user.id) {
      throw new Error('Invalid user');
    }
    await this.invoiceService.checkout(invoiceId, invoice.amount, user);
    // TODO if succes, return true, else return false
  }
}
