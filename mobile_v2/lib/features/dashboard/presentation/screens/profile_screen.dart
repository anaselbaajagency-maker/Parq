import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/widgets/app_button.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.spaceLg),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 50,
              backgroundColor: AppColors.border,
              child: Icon(Icons.person, size: 50, color: AppColors.textMuted),
            ),
            const SizedBox(height: AppDimensions.spaceMd),
            Text('Utilisateur Parq',
                style: Theme.of(context).textTheme.displayMedium),
            const Text('utilisateur@parq-maroc.com',
                style: TextStyle(color: AppColors.textBody)),
            const SizedBox(height: AppDimensions.space2Xl),
            _buildListTile(
                context, Icons.person_outline, 'Informations personnelles'),
            _buildListTile(context, Icons.security, 'Connexion et sécurité'),
            _buildListTile(context, Icons.notifications_none, 'Notifications'),
            _buildListTile(context, Icons.payment, 'Préférences de paiement'),
            const Divider(),
            _buildListTile(context, Icons.help_outline, "Centre d'aide"),
            const SizedBox(height: AppDimensions.space2Xl),
            SizedBox(
              width: double.infinity,
              child: AppButton(
                text: 'Se déconnecter',
                isOutlined: true,
                onPressed: () {
                  // Connect to Auth Provider logout
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildListTile(BuildContext context, IconData icon, String title) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: AppColors.heading),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
      onTap: () {},
    );
  }
}
