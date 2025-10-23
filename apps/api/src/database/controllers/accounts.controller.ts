import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/auth.guard';
import { AppwriteAccountService } from '../services';
import { CreateAccountDto, UpdateAccountDto } from '../dto';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountService: AppwriteAccountService) {}

  /**
   * Create a new account
   * POST /accounts
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccount(@Request() req: any, @Body() createAccountDto: CreateAccountDto) {
    const userId = req.user.userId;
    return this.accountService.createAccount(userId, createAccountDto);
  }

  /**
   * Get all accounts for the authenticated user
   * GET /accounts
   */
  @Get()
  async getAccounts(@Request() req: any) {
    const userId = req.user.userId;
    return this.accountService.getAccountsByUserId(userId);
  }

  /**
   * Get a specific account by ID
   * GET /accounts/:id
   */
  @Get(':id')
  async getAccount(@Request() req: any, @Param('id') accountId: string) {
    const userId = req.user.userId;
    return this.accountService.getAccountById(accountId, userId);
  }

  /**
   * Update an account
   * PUT /accounts/:id
   */
  @Put(':id')
  async updateAccount(@Request() req: any, @Param('id') accountId: string, @Body() updateAccountDto: UpdateAccountDto) {
    const userId = req.user.userId;
    return this.accountService.updateAccount(accountId, userId, updateAccountDto);
  }

  /**
   * Delete an account
   * DELETE /accounts/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Request() req: any, @Param('id') accountId: string) {
    const userId = req.user.userId;
    await this.accountService.deleteAccount(accountId, userId);
  }

  /**
   * Get account balance
   * GET /accounts/:id/balance
   */
  @Get(':id/balance')
  async getAccountBalance(@Param('id') accountId: string) {
    const balance = await this.accountService.getAccountBalance(accountId);
    return { balance };
  }
}
