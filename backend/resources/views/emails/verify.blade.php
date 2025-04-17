<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            padding: 40px;
        }
        .container {
            background-color: #fff;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .btn {
            display: inline-block;
            margin-top: 16px;
            padding: 12px 20px;
            background-color: #1677ff;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
        }
        .footer {
            margin-top: 20px;
            font-size: 13px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Chào bạn!</h2>
        <p>Vui lòng bấm vào nút bên dưới để xác nhận email đăng ký:</p>
        <a class="btn" href="{{ $url }}">Xác nhận email</a>
        <div class="footer">
            Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.<br>
            Xin cảm ơn.
        </div>
    </div>
</body>
</html>
