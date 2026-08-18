<?php
// mock_gateway.php
$orderId = $_GET['orderId'] ?? null;
if (!$orderId) die('Missing orderId');

$ordersDir = __DIR__ . '/orders';
$orderFile = $ordersDir . "/{$orderId}.json";
if (!file_exists($orderFile)) die('Order not found');

$order = json_decode(file_get_contents($orderFile), true);
$total = $order['order']['total'] ?? 0;
?>
<!doctype html>
<html lang="fa">
<head>
<meta charset="utf-8">
<title>Mock Payment Gateway</title>
<style>
  body{font-family:sans-serif;direction:rtl;text-align:center;padding:40px;background:#f5f7fb}
  .card{display:inline-block;padding:20px;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.08);background:white}
  button{padding:10px 18px;margin:8px;border-radius:6px;border:0;background:#3b82f6;color:#fff;cursor:pointer}
  button.cancel{background:#ef4444}
</style>
</head>
<body>
  <div class="card">
    <h2>درگاه پرداخت (شبیه‌ساز)</h2>
    <p>سفارش: <strong><?php echo htmlspecialchars($order['order']['title']); ?></strong></p>
    <p>مبلغ قابل پرداخت: <strong><?php echo number_format($total); ?> تومان</strong></p>

    <!-- دو گزینه: موفق یا ناموفق -->
    <form method="get" action="verify.php" style="display:inline-block">
      <input type="hidden" name="orderId" value="<?php echo htmlspecialchars($orderId); ?>">
      <input type="hidden" name="status" value="paid">
      <button type="submit">پرداخت موفق</button>
    </form>

    <form method="get" action="verify.php" style="display:inline-block">
      <input type="hidden" name="orderId" value="<?php echo htmlspecialchars($orderId); ?>">
      <input type="hidden" name="status" value="failed">
      <button type="submit" class="cancel">پرداخت ناموفق</button>
    </form>
  </div>
</body>
</html>
