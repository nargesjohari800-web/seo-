<?php
// create_payment.php
// دریافت اطلاعات سفارش از فرم (orderData باید JSON باشد)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  die('Method Not Allowed');
}

$orderJson = $_POST['orderData'] ?? null;
if (!$orderJson) {
  http_response_code(400);
  die('Invalid request: missing orderData');
}

$orderData = json_decode($orderJson, true);
if (!$orderData) {
  http_response_code(400);
  die('Invalid order JSON');
}

// Basic validation (مثال - خودت شرایط رو قوی‌تر کن)
if (!isset($orderData['id'], $orderData['title'], $orderData['qty'], $orderData['price'], $orderData['total'])) {
  http_response_code(400);
  die('Invalid order fields');
}

// مطمئن شو مبلغ عددی و مثبت است
if (!is_numeric($orderData['total']) || $orderData['total'] <= 0) {
  http_response_code(400);
  die('Invalid order total');
}

// آماده‌سازی پوشه orders (اگر موجود نبود، ایجاد کن)
$ordersDir = __DIR__ . '/orders';
if (!is_dir($ordersDir)) {
  mkdir($ordersDir, 0755, true);
}

// ساخت orderId امن‌تر
$orderId = time() . '-' . bin2hex(random_bytes(5)); // مثال: 1612345678-a3f4...
$orderFile = $ordersDir . "/{$orderId}.json";

// ذخیره وضعیت اولیه سفارش برای پیگیری
$toSave = [
  'order' => $orderData,
  'status' => 'pending',
  'created_at' => date('c')
];

file_put_contents($orderFile, json_encode($toSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// === جای ارسال درخواست به درگاه واقعی قرار می‌گیرد ===
// مثال: ساخت request به API درگاه (curl) و گرفتن $paymentLink
// برای تست محلی فعلاً به یک mock صفحه هدایت می‌کنیم:
$paymentLink = '/mock_gateway.php?orderId=' . urlencode($orderId);

// هدایت کاربر به درگاه (موک یا واقعی)
header("Location: $paymentLink");
exit;
?>
