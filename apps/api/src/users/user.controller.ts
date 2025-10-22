import { Controller, Get, Patch, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AppwriteUserService } from '../database/services/appwrite-user.service';
import { UpdateProfileDto, UpdatePreferencesDto, UpdateSettingsDto } from '../database/dto';

// Você precisará implementar este guard
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
// @UseGuards(JwtAuthGuard) // Descomente quando tiver autenticação
export class UserController {
  constructor(private readonly userService: AppwriteUserService) {}

  /**
   * GET /users/:id
   * Retorna todas as informações do usuário
   */
  @Get(':id')
  async getUserComplete(@Param('id') userId: string) {
    return await this.userService.getCompleteUserData(userId);
  }

  /**
   * GET /users/:id/profile
   * Retorna apenas o perfil do usuário
   */
  @Get(':id/profile')
  async getUserProfile(@Param('id') userId: string) {
    return await this.userService.getProfile(userId);
  }

  /**
   * PATCH /users/:id/profile
   * Atualiza o perfil do usuário
   */
  @Patch(':id/profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Param('id') userId: string, @Body() updateProfileDto: UpdateProfileDto) {
    // Converter DTOs para o formato esperado pelo service
    const updateData: any = { ...updateProfileDto };

    // Converter address de objeto para string JSON se fornecido
    if (updateProfileDto.address) {
      updateData.address = JSON.stringify(updateProfileDto.address);
    }

    // Converter socialLinks de objeto para string JSON se fornecido
    if (updateProfileDto.socialLinks) {
      updateData.social_links = JSON.stringify(updateProfileDto.socialLinks);
      delete updateData.socialLinks; // Remover a propriedade antiga
    }

    // Converter snake_case
    if (updateProfileDto.firstName) {
      updateData.first_name = updateProfileDto.firstName;
      delete updateData.firstName;
    }
    if (updateProfileDto.lastName) {
      updateData.last_name = updateProfileDto.lastName;
      delete updateData.lastName;
    }
    if (updateProfileDto.displayName) {
      updateData.display_name = updateProfileDto.displayName;
      delete updateData.displayName;
    }
    if (updateProfileDto.avatarUrl) {
      updateData.avatar_url = updateProfileDto.avatarUrl;
      delete updateData.avatarUrl;
    }
    if (updateProfileDto.phoneNumber) {
      updateData.phone_number = updateProfileDto.phoneNumber;
      delete updateData.phoneNumber;
    }
    if (updateProfileDto.dateOfBirth) {
      updateData.date_of_birth = updateProfileDto.dateOfBirth;
      delete updateData.dateOfBirth;
    }

    return await this.userService.updateProfile(userId, updateData);
  }

  /**
   * GET /users/:id/preferences
   * Retorna as preferências do usuário
   */
  @Get(':id/preferences')
  async getPreferences(@Param('id') userId: string) {
    return await this.userService.getPreferences(userId);
  }

  /**
   * PATCH /users/:id/preferences
   * Atualiza as preferências do usuário
   */
  @Patch(':id/preferences')
  @HttpCode(HttpStatus.OK)
  async updatePreferences(@Param('id') userId: string, @Body() updatePreferencesDto: UpdatePreferencesDto) {
    // Converter DTOs para o formato esperado pelo service
    const updateData: any = { ...updatePreferencesDto };

    // Converter dashboardWidgets de objeto para string JSON se fornecido
    if (updatePreferencesDto.dashboardWidgets) {
      updateData.dashboard_widgets = JSON.stringify(updatePreferencesDto.dashboardWidgets);
      delete updateData.dashboardWidgets;
    }

    // Converter snake_case
    if (updatePreferencesDto.defaultDashboardView) {
      updateData.default_dashboard_view = updatePreferencesDto.defaultDashboardView;
      delete updateData.defaultDashboardView;
    }
    if (updatePreferencesDto.emailNotifications !== undefined) {
      updateData.email_notifications = updatePreferencesDto.emailNotifications;
      delete updateData.emailNotifications;
    }
    if (updatePreferencesDto.pushNotifications !== undefined) {
      updateData.push_notifications = updatePreferencesDto.pushNotifications;
      delete updateData.pushNotifications;
    }
    if (updatePreferencesDto.smsNotifications !== undefined) {
      updateData.sms_notifications = updatePreferencesDto.smsNotifications;
      delete updateData.smsNotifications;
    }
    if (updatePreferencesDto.notificationFrequency) {
      updateData.notification_frequency = updatePreferencesDto.notificationFrequency;
      delete updateData.notificationFrequency;
    }
    if (updatePreferencesDto.showBalances !== undefined) {
      updateData.show_balances = updatePreferencesDto.showBalances;
      delete updateData.showBalances;
    }
    if (updatePreferencesDto.autoCategorizationEnabled !== undefined) {
      updateData.auto_categorization_enabled = updatePreferencesDto.autoCategorizationEnabled;
      delete updateData.autoCategorizationEnabled;
    }
    if (updatePreferencesDto.budgetAlerts !== undefined) {
      updateData.budget_alerts = updatePreferencesDto.budgetAlerts;
      delete updateData.budgetAlerts;
    }
    if (updatePreferencesDto.profileVisibility) {
      updateData.profile_visibility = updatePreferencesDto.profileVisibility;
      delete updateData.profileVisibility;
    }
    if (updatePreferencesDto.shareDataForInsights !== undefined) {
      updateData.share_data_for_insights = updatePreferencesDto.shareDataForInsights;
      delete updateData.shareDataForInsights;
    }

    return await this.userService.updatePreferences(userId, updateData);
  }

  /**
   * GET /users/:id/settings
   * Retorna as configurações do usuário
   */
  @Get(':id/settings')
  async getSettings(@Param('id') userId: string) {
    return await this.userService.getSettings(userId);
  }

  /**
   * PATCH /users/:id/settings
   * Atualiza as configurações do usuário
   */
  @Patch(':id/settings')
  @HttpCode(HttpStatus.OK)
  async updateSettings(@Param('id') userId: string, @Body() updateSettingsDto: UpdateSettingsDto) {
    // Converter DTOs para o formato esperado pelo service
    const updateData: any = { ...updateSettingsDto };

    // Converter arrays para strings JSON
    if (updateSettingsDto.connectedBanks) {
      updateData.connected_banks = JSON.stringify(updateSettingsDto.connectedBanks);
      delete updateData.connectedBanks;
    }

    if (updateSettingsDto.connectedApps) {
      updateData.connected_apps = JSON.stringify(updateSettingsDto.connectedApps);
      delete updateData.connectedApps;
    }

    if (updateSettingsDto.customSettings) {
      updateData.custom_settings = JSON.stringify(updateSettingsDto.customSettings);
      delete updateData.customSettings;
    }

    // Converter snake_case
    if (updateSettingsDto.twoFactorEnabled !== undefined) {
      updateData.two_factor_enabled = updateSettingsDto.twoFactorEnabled;
      delete updateData.twoFactorEnabled;
    }
    if (updateSettingsDto.twoFactorMethod) {
      updateData.two_factor_method = updateSettingsDto.twoFactorMethod;
      delete updateData.twoFactorMethod;
    }
    if (updateSettingsDto.sessionTimeout !== undefined) {
      updateData.session_timeout = updateSettingsDto.sessionTimeout;
      delete updateData.sessionTimeout;
    }
    if (updateSettingsDto.autoSyncEnabled !== undefined) {
      updateData.auto_sync_enabled = updateSettingsDto.autoSyncEnabled;
      delete updateData.autoSyncEnabled;
    }
    if (updateSettingsDto.syncFrequency !== undefined) {
      updateData.sync_frequency = updateSettingsDto.syncFrequency;
      delete updateData.syncFrequency;
    }
    if (updateSettingsDto.cloudBackupEnabled !== undefined) {
      updateData.cloud_backup_enabled = updateSettingsDto.cloudBackupEnabled;
      delete updateData.cloudBackupEnabled;
    }
    if (updateSettingsDto.betaFeatures !== undefined) {
      updateData.beta_features = updateSettingsDto.betaFeatures;
      delete updateData.betaFeatures;
    }
    if (updateSettingsDto.analyticsOptIn !== undefined) {
      updateData.analytics_opt_in = updateSettingsDto.analyticsOptIn;
      delete updateData.analyticsOptIn;
    }

    return await this.userService.updateSettings(userId, updateData);
  }

  /**
   * PATCH /users/:id/theme
   * Atalho para atualizar apenas o tema
   */
  @Patch(':id/theme')
  @HttpCode(HttpStatus.OK)
  async updateTheme(@Param('id') userId: string, @Body('theme') theme: 'light' | 'dark' | 'system') {
    return await this.userService.updatePreferences(userId, { theme });
  }

  /**
   * PATCH /users/:id/language
   * Atalho para atualizar apenas o idioma
   */
  @Patch(':id/language')
  @HttpCode(HttpStatus.OK)
  async updateLanguage(@Param('id') userId: string, @Body('language') language: 'pt-BR' | 'en-US' | 'es-ES') {
    return await this.userService.updatePreferences(userId, { language });
  }
}
