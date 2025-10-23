import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { AppwriteCreditCardService } from '../services';
import { CreateCreditCardDto, UpdateCreditCardDto } from '../dto';

@Controller('credit-cards')
@UseGuards(JwtAuthGuard)
export class CreditCardsController {
  constructor(private readonly creditCardService: AppwriteCreditCardService) {}

  /**
   * Create a new credit card
   * POST /credit-cards
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCreditCard(@Body() createCreditCardDto: CreateCreditCardDto) {
    return this.creditCardService.createCreditCard(createCreditCardDto);
  }

  /**
   * Get all credit cards for an account
   * GET /credit-cards/account/:accountId
   */
  @Get('account/:accountId')
  async getCreditCardsByAccount(@Param('accountId') accountId: string) {
    return this.creditCardService.getCreditCardsByAccountId(accountId);
  }

  /**
   * Get a specific credit card by ID
   * GET /credit-cards/:id
   */
  @Get(':id')
  async getCreditCard(@Param('id') creditCardId: string) {
    return this.creditCardService.getCreditCardById(creditCardId);
  }

  /**
   * Update a credit card
   * PUT /credit-cards/:id
   */
  @Put(':id')
  async updateCreditCard(@Param('id') creditCardId: string, @Body() updateCreditCardDto: UpdateCreditCardDto) {
    return this.creditCardService.updateCreditCard(creditCardId, updateCreditCardDto);
  }

  /**
   * Delete a credit card
   * DELETE /credit-cards/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCreditCard(@Param('id') creditCardId: string) {
    await this.creditCardService.deleteCreditCard(creditCardId);
  }

  /**
   * Update used limit of a credit card
   * PUT /credit-cards/:id/used-limit
   */
  @Put(':id/used-limit')
  async updateUsedLimit(@Param('id') creditCardId: string, @Body() body: { usedLimit: number }) {
    return this.creditCardService.updateUsedLimit(creditCardId, body.usedLimit);
  }
}
