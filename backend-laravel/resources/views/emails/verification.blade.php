<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre compte - PARQ</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: -1px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        h1 {
            color: #0f172a;
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 16px;
        }
        p {
            color: #64748b;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        .otp-box {
            background-color: #fff7ed;
            border: 2px dashed #f97316;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 32px;
        }
        .otp-code {
            font-size: 42px;
            font-weight: 900;
            color: #f97316;
            letter-spacing: 8px;
        }
        .footer {
            padding: 30px;
            text-align: center;
            background-color: #f1f5f9;
            color: #94a3b8;
            font-size: 13px;
        }
        .footer p {
            margin-bottom: 8px;
            font-size: 13px;
        }
        .emphasis {
            color: #0f172a;
            font-weight: 700;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PARQ.</div>
        </div>
        <div class="content">
            <h1>Vérifiez votre email</h1>
            <p>Merci de vous être inscrit sur <span class="emphasis">PARQ</span>. Pour finaliser la création de votre compte et sécuriser vos accès, veuillez utiliser le code de vérification ci-dessous :</p>
            
            <div class="otp-box">
                <div class="otp-code">{{ $code }}</div>
            </div>
            
            <p>Ce code est valable pendant <span class="emphasis">10 minutes</span>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} PARQ. Tous droits réservés.</p>
            <p>Ceci est un message automatique, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
