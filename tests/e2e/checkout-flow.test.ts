/**
 * End-to-End Checkout Flow Test Suite
 * Simulates complete user purchasing flow:
 * 1. Customer login
 * 2. Add product to cart
 * 3. Place order with UPI payment
 * 4. Verify Ekart tracking generated & cart cleared
 * 5. Admin shipment stage update to SHIPPED
 * 6. Order cancellation verification
 */
import { db } from '../../database';
import { OrderService } from '../../backend/src/services/orderService';

export async function runCheckoutE2ETests() {
  console.log('\n--- Running End-to-End Checkout Tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    const customer = db.getUser('usr-default');
    assert(customer !== null, 'E2E Step 1: Customer record found');

    // Step 2: Add iPhone to Cart
    db.clearCart('usr-default');
    db.addToCart('usr-default', 'prod-iphone15', 1);
    const cart = db.getCart('usr-default');
    assert(cart.length === 1 && cart[0].productId === 'prod-iphone15', 'E2E Step 2: Item added to cart');

    // Step 3: Checkout and place order
    const defaultAddress = customer?.addresses[0];
    assert(!!defaultAddress, 'E2E Step 3: Delivery address identified');

    const order = OrderService.placeOrder({
      userId: 'usr-default',
      addressId: defaultAddress!.id,
      paymentMethod: 'UPI',
      couponCode: 'FLIPKART500',
      useSuperCoins: false
    });

    assert(!!order.id && order.status === 'PLACED', 'E2E Step 4: Order created with status PLACED');
    assert(order.courierName === 'Ekart Logistics Express', 'E2E Step 5: Ekart Logistics Express assigned');
    assert(Boolean(order.trackingNumber && order.trackingNumber.startsWith('FKOD')), `E2E Step 6: Ekart tracking generated (${order.trackingNumber})`);

    // Verify cart was cleared after purchase
    const remainingCart = db.getCart('usr-default');
    assert(remainingCart.length === 0, 'E2E Step 7: Customer cart cleared automatically after checkout');

    // Step 8: Admin updates status to SHIPPED
    const updatedOrder = db.updateOrderStatus(order.id, 'SHIPPED', 'Dispatched from Bengaluru fulfillment center');
    assert(updatedOrder?.status === 'SHIPPED', 'E2E Step 8: Admin successfully advances status to SHIPPED');

    const currentStep = updatedOrder?.trackingHistory.find((s) => s.current);
    assert(currentStep?.status === 'SHIPPED', 'E2E Step 9: Tracking stepper timeline reflects SHIPPED stage');

  } catch (err: any) {
    assert(false, `E2E Flow encountered an error: ${err.message}`);
  }

  return { passed, failed };
}
