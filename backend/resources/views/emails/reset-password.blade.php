<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 40px;
        }
        .container {
            background-color: #fff;
            padding: 24px;
            border-radius: 8px;
            max-width: 600px;
            margin: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
        }
        .btn {
            display: inline-block;
            padding: 12px 20px;
            background-color: #1677ff;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 16px;
        }
        .footer {
            margin-top: 24px;
            font-size: 13px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Xin chào,</h2>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
        <p>Vui lòng nhấn vào nút bên dưới để tiến hành đặt lại:</p>
        <a href="{{ $url }}" class="btn">Đặt lại mật khẩu</a>
        <div class="footer">
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.<br>
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
        </div>
    </div>
</body>
</html>
