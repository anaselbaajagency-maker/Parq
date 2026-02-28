# Parq Mobile (Flutter)

## Setup

```bash
cd mobile
flutter pub get
```

## API Base URL

This app uses `--dart-define` for environment configuration.

Example (Android emulator):

```bash
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8000/api/v1
```

Example (physical device):

```bash
flutter run --dart-define=API_BASE_URL=http://YOUR_LOCAL_IP:8000/api/v1
```

Example (production):

```bash
flutter run --dart-define=API_BASE_URL=https://YOUR_API_DOMAIN/api/v1
```
