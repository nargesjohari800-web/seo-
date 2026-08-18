<?php
// verify.php
// این صفحه توسط درگاه به عنوان callback فراخوانی می‌شود یا کاربر به آن بازمی‌گردد

$orderId = $_GET['orderId'] ?? null;

if (!$orderId) {
    die("سفارش نامعتبر یا شناسه سفارش موجود نیست.");
}

$file = "orders/{$orderId}.json";

if (!file_exists($file)) {
    die("سفارش مورد نظر یافت نشد.");
}

// خواندن اطلاعات سفارش
$data = json_decode(file_get_contents($file), true);
if (!$data || !isset($data['order'])) {
    die("داده‌های سفارش نامعتبر است.");
}

// === شبیه‌سازی verify درگاه ===
// در حالت واقعی، باید API درگاه را با transaction id و hash بررسی کنید
$paid = true; // true یعنی پرداخت موفق، false یعنی ناموفق (شبیه‌سازی)

if ($paid) {
    $data['status'] = 'paid';
    $data['paid_at'] = date('Y-m-d H:i:s'); // زمان پرداخت
    file_put_contents($file, json_encode($data));

    // اضافه کردن سفارش به آرشیو خریدها (مثلاً DB یا فایل جدا)
    // file_put_contents("purchases/{$orderId}.json", json_encode($data));

    // هدایت به صفحه موفق
    header("Location: /payment_success.html?orderId={$orderId}");
    exit;
} else {
    $data['status'] = 'failed';
    $data['failed_at'] = date('Y-m-d H:i:s');
    file_put_contents($file, json_encode($data));

    // هدایت به صفحه ناموفق
    header("Location: /payment_failed.html?orderId={$orderId}");
    exit;
}
?>
